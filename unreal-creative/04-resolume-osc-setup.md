# 04 — Resolume OSC Setup

How to configure **Resolume Arena 7+** to send cue triggers to the UE ShowController via OSC. Also covers how to bring UE's Spout output back into Resolume as a source layer.

> **Arena required.** Resolume Avenue does not include OSC Output, Custom OSC Mapping, or Advanced Output. You need Arena for this entire workflow.

## Part 1 — OSC Output to UE

### Enable OSC Output

1. Resolume → **Application → Preferences → OSC**
2. Check **Enabled**
3. Set **IP** to the UE machine's IP on the local network (or `127.0.0.1` if running on the same machine)
4. Set **Port** to `8000` (matches ShowController default)
5. Apply

### Verify in Wireshark

On the UE machine, capture on the listening interface with filter:
```
udp.port == 8000
```
Press any clip in Resolume. You should see OSC packets containing the clip's address.

### Default OSC addresses Resolume emits

These are sent automatically when OSC Output is enabled — no extra mapping needed.

| Action in Resolume | OSC Address |
|---|---|
| Trigger clip in layer L, column C | `/composition/layers/L/clips/C/connect` (value `1.0`) |
| Trigger column C | `/composition/columns/C/connect` (value `1.0`) |
| Clear layer L | `/composition/layers/L/clear` (value `1.0`) |
| Composition speed | `/composition/screenspeed` |
| Tempo tap | `/composition/tempocontroller/tempo` |
| Crossfade | `/composition/master` (0.0–1.0) |
| Selected clip opacity | `/composition/selectedclip/opacity` |

Addresses use 1-based indices matching Resolume's UI. Verify exact strings in Resolume's manual for your version — they've shifted slightly across releases.

### Map default addresses to ShowController cues

In your `CueRouteTable` DataAsset (see `03-showcontroller-blueprint.md`), populate:

| OSC Address (from Resolume) | Cue ID |
|---|---|
| `/composition/columns/1/connect` | 0 (blackout) |
| `/composition/columns/2/connect` | 1 (title card) |
| `/composition/columns/3/connect` | 2 (particle burst) |
| `/composition/columns/4/connect` | 3 (color wash) |
| `/composition/columns/5/connect` | 4 (look B) |
| `/composition/columns/6/connect` | 99 (next look) |

Now pressing Column 1 in Resolume fires Cue 0 in UE, Column 2 fires Cue 1, etc. No custom OSC mapping needed — just use Resolume's Column buttons as your cue buttons.

## Part 2 — Custom OSC Mapping (when defaults aren't enough)

For non-standard triggers (e.g., "fire Cue 5 only when this Dashboard widget is at 50%"), use Resolume's **Custom OSC** feature.

### Dashboard widgets

1. Open **Dashboard** panel in Resolume
2. Add a Button, Slider, or Animation widget
3. Right-click the widget → **Edit OSC Output**
4. Enter a custom address (e.g., `/cue/look/next`)
5. Choose value type (`f` for float, `i` for int, `s` for string)

Map your custom address in the `CueRouteTable`:
| Custom Address | Cue ID |
|---|---|
| `/cue/look/next` | 99 |
| `/cue/blackout` | 0 |
| `/cue/title` | 1 |

### Use Dashboard to extend the cue palette

Once the default Column-1-through-N scheme runs out, add a Dashboard with named buttons. Each button outputs a distinct custom OSC address that maps to a cue ID. This is how you scale past 6–8 cues without growing the column grid.

### Mapping clip triggers with arguments

For parameterized cues (e.g., "play sequence X with parameter Y"), use a clip's OSC payload:

```
/composition/layers/2/clips/3/connect  1.0
/composition/layers/2/clips/3/transport/position  0.5
```

The ShowController currently only reads the address (not the args). To use args, extend Layer 2 of the Blueprint to also pass `Data[0]` into `FireCue`. This is a future enhancement, not needed for one-shot triggering.

## Part 3 — Bringing UE Output Back Into Resolume

### Add UE's Spout sender as a source

1. In Resolume, open **Sources** tab in the file browser
2. Find **Spout** in the list (you should see it after enabling Spout output from UE)
3. Drag `UE_Output` (the sender name set in the OutputRig — see `03`) onto a layer
4. The clip is now live — it always shows whatever UE is rendering

### Treat UE like any other video source

Once it's a clip, you can:
- Apply effects to it (color, distortion, feedback)
- Composite it over/under other clips
- Crossfade between UE content and pre-rendered VJ loops
- Send it through the Advanced Output pipeline for LED wall slicing

This is the main reason UE → Spout → Resolume → wall is preferred over UE → wall direct: you keep Resolume's full VJ toolkit in the signal chain.

## Part 4 — Advanced Output (LED Wall Mapping)

### Define an LED wall screen

1. **Output → Advanced** (Arena only)
2. **Screens** tab → add a **Slice** for each panel or block in your wall
3. For each slice:
   - Set **Input** to the composition area mapping UE content
   - Set **Output** rectangle to the pixel coordinates your LED processor expects
4. Assign to the physical output (DisplayPort / HDMI to the processor)

### Match LED processor resolution

Common processors and their input conventions:

| Processor | Resolution | Notes |
|---|---|---|
| **Brompton Tessera SX40** | Up to 4K per output | Per-output ROI in processor config |
| **NovaStar MX40 Pro** | Up to 2K per output | Carries in processor "Screen" setup |
| **Megapixel HELIOS** | Up to 8K total | Per-port mapping in VRM |

In Resolume Advanced Output, set the **Screen** resolution to match what the processor reports per input port. Off-by-one pixel mismatches manifest as visible seams — check the processor's reported active area, not the marketing resolution.

### Test pattern workflow

Before show day, route a known test pattern from UE (a checkerboard with coordinates) through Spout → Resolume → processor → wall. Verify pixel coordinates against the test pattern. This catches 90% of mapping errors before they're show-stoppers.

## Part 5 — Color / EOTF

UE renders in Linear color space. Resolume and most LED processors expect Rec.709 gamma-encoded. Mismatched pipeline causes the classic "UE looks great in editor, washed-out on wall" issue.

### Three options (pick one)

1. **In UE (recommended)**: Set the OutputRig's `TextureRenderTarget2D` format to `RTF RGBA8 sRGB`. UE auto-encodes Linear → sRGB when writing to an sRGB target. Cheap and predictable.

2. **In Resolume**: Set the Spout source's color space to "Linear" and let Resolume apply the transfer function. Works if your Resolume version exposes this option (recent Arena builds do).

3. **OCIO**: Apply an OCIO config to both UE and Resolume mapping `Linear → Rec.709`. Most rigorous, most setup. Only worth it if your show has strict color review (broadcast, film).

### Quick sanity check

Render a Material that's 50% gray (`RGB = 0.5`) in UE. On the wall it should appear mid-gray (around 0.5 in sRGB, ~20% luminance). If it looks too dark, you're double-encoding. If it looks too bright, you're missing the encoding step.

---

Next: `05-lighting-dmx-setup.md`
