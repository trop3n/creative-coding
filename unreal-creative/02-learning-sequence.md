# 02 — Learning Sequence (8 Weeks)

A focused curriculum from zero Unreal experience to a rehearsed cue-driven show. Assumes technical literacy (you write shaders / use TouchDesigner / are comfortable in Resolume) but no prior UE experience.

## Time commitment

- **6–10 hours per week** (mix of tutorials + hands-on project work)
- 8 weeks total → ~50–80 hours
- Pace is more important than clock time — don't skip the deliverables

## Prerequisites

- Complete `01-tech-stack.md` (UE installed, plugins enabled)
- Have Resolume Arena 7+ licensed and installed
- Have access to a lighting console (real hardware or offline editor — e.g. grandMA3 onPC, ChamSys MagicQ PC, Eos nomad all work for learning)
- Optional but helpful: a second monitor for editor + preview

---

## Week 1 — UE Foundations, Non-Game Mindset

**Goal**: Get past the UI and develop intuition for how UE thinks. Lean on your shader background — the Material Editor is a node graph that mirrors what you already know.

### Topics
- Install UE 5.5, enable all plugins from `01-tech-stack.md`
- Viewport navigation (F focus, W/E/R transform modes, orthographic toggles)
- World Outliner, Details panel, Content Browser
- **Material Editor**: node graph, `World Position Offset`, `Time`, `Sine`, `Fresnel`
- The `Custom` node (lets you write raw HLSL — direct mapping from GLSL/SKSL intuition)
- Actor / Component / Pawn / GameMode / PlayerController mental model
- Difference between **Level** (scene) and **Blueprint** (reusable logic)

### Deliverable
A 1920×1080 movie render of a sphere with an animated procedural material driven by sin/cos of world position and time. Use the **Movie Render Queue** (not the legacy Sequencer render) for output.

### Resources
- Epic Online Learning: *Your First Hour in UE5*
- YouTube: **Unreal Sensei** — UE5 beginner tutorial (skip the landscape sections)
- YouTube: **Ben Cloward** — Shader/Material tutorials

---

## Week 2 — Blueprints & Sequencer

**Goal**: Master the two tools you'll use most — visual scripting (Blueprints) and timeline animation (Sequencer). These are the bedrock of cue-driven work.

### Topics
- Blueprint types: Actor, Component, GameMode, Pawn
- Event Graph vs Construction Script vs Function vs Macro
- Variables, structs, arrays, maps (`TMap`)
- **Event Dispatchers** — the UE equivalent of "emitter" patterns you'll need for cue routing
- Blueprint Interfaces (BPI) — how unrelated Blueprints communicate
- **Level Sequencer**: keyframing, tracks, camera cuts, event tracks
- **Variant Manager**: switch Material/Transform states on a group of actors
- Trigger a Sequencer from a keypress via Blueprint

### Deliverable
Press a key → fires a Level Sequence (3–5 second animation) **and** swaps a Variant (e.g., color palette changes). Bonus: bind a second key to fire the same sequence in reverse.

### Resources
- Epic Online Learning: *Blueprint Quick Start*, *Level Sequencer*
- YouTube: **William Faucher** — Sequencer deep dives
- YouTube: **Unreal Sensei** — Blueprint fundamentals

---

## Week 3 — Motion Graphics & Niagara

**Goal**: Build the actual content that cues will trigger. Three reusable scripted looks ready to slot into the ShowController.

### Topics
- **Motion Design plugin**: Text 3D, Shape actors, Cloner (replicator), Modifier actors
- Data-Driven graphics: bind Text 3D to CSV/JSON for live-updating numbers
- **Niagara**: emitter templates, ribbons, GPU sprites, parameter collections
- Niagara data interfaces (position feedback, scratch pads)
- Reusing the same look with different parameters via Blueprint-exposed variables

### Deliverable
Three reusable look assets:
1. **Title card** — Motion Design Text 3D animates in over 2 seconds (Sequencer)
2. **Particle burst** — Niagara emitter, GPU sprites, color from a Material Parameter Collection
3. **Color wash** — full-screen post-process Material that animates via a Sequencer-driven scalar

Save each as a Level Sequence asset that can be triggered by ShowController.

### Resources
- YouTube: **The Pixel Lab** — Motion Design plugin tutorials
- YouTube: **Spongeham** — broadcast / mograph in UE
- YouTube: **Ben Cloward** — Niagara fundamentals

---

## Week 4 — Cue Plumbing: OSC + DMX In Parallel

**Goal**: Get both trigger sources printing into UE. Prove the network plumbing works end-to-end before building any real routing.

### Topics
- **Resolume OSC Output**: configure in Preferences, learn default addresses
  - `/composition/columns/<n>/connect` (column triggers)
  - `/composition/layers/<l>/clips/<c>/connect` (clip triggers)
  - `/composition/selectedclip/...` (selected clip)
- **UE OSC Server**: bind port `8000`, `OnOSCMessage` event
- **Lighting console DMX Output**:
  - grandMA3: enable Art-Net in `Network → Art-Net`, assign universe
  - ChamSys: `Network Settings → Art-Net`
  - ETC Eos: enable sACN in shell settings
  - Avolites: `DMX Output → Art-Net`
- **UE DMX plugin**: configure protocol matching console, patch a DMX Component, read channel values
- Network debugging: **Wireshark** filters `osc` and `art-net` / `ansi e1.31`

### Deliverable
- Pressing a clip in Resolume prints its OSC address to UE's output log
- Pushing a fader up on the console prints the changed channel + value to UE's output log
- Both ports visible in Wireshark from the UE machine

### Resources
- Epic DMX Plugin docs (search "UE DMX Plugin" in Epic docs)
- YouTube: **PafLiber** — UE + lighting console integration
- Resolume manual: OSC section

---

## Week 5 — ShowController: Unified Cue Router

**Goal**: Both protocols route into a single cue namespace. This is the centerpiece Blueprint — see `03-showcontroller-blueprint.md` for the full spec.

### Topics
- Design the **logical cue ID** concept — both OSC addresses and DMX channels map to integers
- Use `TMap<FString, int32>` for OSC routing, `TMap<int32, int32>` for DMX routing
- Build the three-layer event graph (Receivers → Protocol-to-CueID → Dispatcher)
- **Idempotent re-trigger**: stop the previous Level Sequence cleanly before playing the next
- Specialty cues: `BLACKOUT`, `NEXT_LOOK`
- Populate maps at `BeginPlay` from data assets (so non-programmers can edit mappings)

### Deliverable
Five logical cues triggerable from **either** source:
1. Cue 0 → blackout
2. Cue 1 → title card Sequence
3. Cue 2 → particle burst
4. Cue 3 → color wash
5. Cue 4 → next look (variant swap)

Both Resolume clip 1 and console channel 12 should fire Cue 1, etc.

### Resources
- `03-showcontroller-blueprint.md` (in this repo)
- Epic Online Learning: *Blueprint Communication*
- Forum: Unreal Engine forums → *Blueprint* section (search for "OSC blueprint" and "DMX blueprint")

---

## Week 6 — Output Pipeline: UE → Spout → Resolume → Wall

**Goal**: Get UE content showing on a (simulated or real) LED wall via Resolume as the output mapper.

### Topics
- **Spout plugin**: create a Spout Sender Blueprint, name it `UE_Output`
- **RenderTarget setup**: create a 1920×1080 (or wall native res) RenderTarget texture
- **SceneCaptureComponent2D** on a camera Actor → writes scene to RenderTarget
- Connect RenderTarget to Spout Sender
- **Resolume source**: add Spout source, select `UE_Output`
- **Resolume Advanced Output**: define screen, slice, pixel-map to LED processor resolution
- **Color / EOTF**: UE renders in Linear; Resolume expects Rec.709 by default — apply OCIO or a gamma node in the RenderTarget Material
- Latency budget: expect 1–3 frames of UE → Spout → Resolume → processor latency. Measure it.

### Deliverable
A scene rendered in UE appears in Resolume as a Spout source, is correctly colored, and is mapped to a virtual LED wall slice in Advanced Output (even if you only have a monitor as the stand-in).

### Resources
- Spout for UE GitHub README
- Resolume manual: Spout source, Advanced Output, Color Space settings
- YouTube: **Skyhood** — UE → Resolume workflows

---

## Week 7 (Stretch) — nDisplay Single-Machine

**Goal**: Decide if/when you need nDisplay, and prototype it on one machine. See `06-ndisplay-single-machine.md`.

### Topics
- Why nDisplay instead of Spout → Resolume → processor? (Latency, frame-lock, sync)
- When the trade-off is worth it
- `.ndisplay` config file format
- Single-node 3-screen rig: define 3 viewports, 3 projection matrices
- Inner/outer frustum concept for LED volumes
- **Genlock** (conceptual) — what you'd need for a multi-node cluster
- Switching output from Spout → nDisplay in the ShowController (no Blueprint changes needed — only output config)

### Deliverable (stretch only)
A single-machine nDisplay rig driving 3 virtual screens (offset cameras) and writing to 3 separate Spout senders (or one stitched output). Compare latency and visual quality vs the Week 6 setup.

### When to skip
If your shows will always route through Resolume for VJ mixing and the latency of Week 6 is acceptable, **skip this week**. Revisit only when a show demands frame-locked output direct to the processor.

### Resources
- `06-ndisplay-single-machine.md` (in this repo)
- Epic docs: *nDisplay*
- YouTube: **Sam Michlak** — nDisplay basics

---

## Week 8 — Show Readiness

**Goal**: Take everything from Weeks 1–6 (or 1–7) and stress-test it the way a real show will.

### Topics
- **Profiling**: `stat gpu`, `stat unit`, GPU Visualizer (`Ctrl+Shift+,`), Lumen/Nanite budget tuning
- Frame budget: keep under 16.6 ms (60 Hz) or 8.3 ms (120 Hz) with headroom
- **OSC packet loss handling**: cues must be idempotent — re-firing Cue 1 should never break the show
- **DMX failure mode**: console reboot mid-show — UE should detect stale values via heartbeat or timeout
- **Multi-User Editor**: live editing during rehearsal (multiple operators in one scene)
- **Backup strategy**: version control the UE project (Perforce or Git LFS), export a known-good build before show day
- Rehearsal: run the cue list end-to-end with a timer, document any missed cues
- Run the show on a fresh boot with no editor (Standalone Game mode) to catch shipping-only bugs

### Deliverable
A rehearsed cue list (5–10 cues minimum) run end-to-end with documented:
- Cue sheet (cue #, trigger source, action, duration)
- Recovery procedure for each known failure mode
- Performance budget report (`stat gpu` screenshot at peak)

### Resources
- Epic docs: *Multi-User Editor*, *Profiling Tools*
- YouTube: **Inside Unreal** livestreams on live events
- Unreal Fest talks (YouTube) — search "virtual production live events"

---

## Pacing notes

- **Weeks 1–3** can be compressed if you pick up UE quickly — they're foundational but straightforward
- **Week 4–5 are the crux** — don't rush them. The router Blueprint is what everything else depends on
- **Week 6** is essential before any show
- **Week 7** is genuinely optional for many shows
- **Week 8** is not optional — don't skip rehearsal and failure-mode planning

---

Next: `03-showcontroller-blueprint.md`
