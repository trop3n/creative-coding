# 01 — Tech Stack

Everything you need installed and configured before Week 1 of the learning sequence.

## Engine

**Unreal Engine 5.5 or newer** via the Epic Games Launcher. Install 5.5 LTS or the latest stable 5.x.

### Required plugins (enable via *Edit → Plugins*)

| Plugin | Category | Purpose |
|---|---|---|
| **OSC Server** | Networking | Receives OSC messages from Resolume |
| **DMX Plugin by Epic** | Other | Receives Art-Net / sACN from lighting console |
| **Motion Design** (Beta) | Other | 2D/3D text, shapes, cloners, data-driven graphics |
| **Niagara** | FX (built-in, default) | GPU particles, ribbons, motion graphics VFX |
| **Level Sequencer** | Built-in (default) | Timeline-based cinematic & event animation |
| **Variant Manager** | Built-in | State switching for looks/palettes/scene variants |
| **Spout for UE** | Community plugin | GPU texture share to Resolume on the same machine |
| **nDisplay** | Virtual Production | Stretch: multi-viewport / clustered LED wall rendering |
| **Live Link** | Virtual Production | Stretch: camera / tracker input |

### Where to get community plugins

- **Spout for UE**: search GitHub for `getspout` or `tomwalker224 Spout` — pick the build matching your UE version
- **NDI 5 for UE** (alternative to Spout): from NewTek / Vizrt developer portal — only needed if you move to multi-machine output before adopting nDisplay

## Resolume side

| Component | Notes |
|---|---|
| **Resolume Arena 7+** | Avenue does **not** include OSC output, DMX, or Advanced Output. Arena is required. |
| **OSC Output** | Preferences → OSC. Target UE machine IP, port `8000`. |
| **Custom OSC Mapping** | Arena only. Lets you emit arbitrary OSC addresses from Dashboard widgets. |
| **Spout sources** | Add UE's Spout sender as a clip source. |
| **Advanced Output** | Pixel-map LED wall slices, edge blends, screen regions. |

## Lighting console side

| Console | Protocol notes |
|---|---|
| **grandMA3** | Art-Net (default) or sACN. Patch via the `DMX Protocols` menu. |
| **ChamSys MagicQ** | Art-Net. Configure via `Network Settings`. |
| **ETC Eos** | sACN (default). Configure via shell `Settings → Network → sACN`. |
| **Avolites (Diamond / Tiger)** | Art-Net. Configure via `DMX Output`. |

Pick whichever protocol your console already speaks — UE's DMX plugin handles both Art-Net and sACN identically from the Blueprint side.

## Protocols

| Path | Protocol | Transport | Use |
|---|---|---|---|
| Resolume → UE | **OSC** | UDP `:8000` | Cue triggers (primary) |
| Console → UE | **Art-Net** or **sACN** | UDP `:6454` / `:5568` | Cue triggers (parallel to OSC) |
| UE → Resolume | **Spout** | Shared GPU texture (same machine) | Rendered output |
| UE → Resolume (multi-machine) | **NDI HX3** | UDP, ~10–80 ms latency | Alternative output |
| Frame sync (nDisplay stretch) | **Genlock / PTP** | Hardware | Multi-node sync |

## Hardware tiers

### Dev / learning (current target)

| Component | Spec |
|---|---|
| GPU | RTX 3080 / 4070 Ti / 4080 / 4090 (12 GB+ VRAM) |
| CPU | Modern 8-core (Ryzen 7 / i7 or better) |
| RAM | 32 GB |
| Storage | 1 TB NVMe Gen4 |
| Network | 1 GbE to console + Resolume machine |
| Display | 2 monitors (editor + preview/out) |

### Stretch: small show

| Component | Spec |
|---|---|
| GPU | RTX 4090 or dual-GPU workstation |
| RAM | 64 GB |
| Sync | Optional NVAPI frame sync (single GPU, no Quadro Sync needed) |
| LED processor | Brompton Tessera / NovaStar MX / Megapixel HELIOS |

### Out of scope for now: large LED volume

Multi-machine nDisplay cluster, Quadro Sync cards, camera tracking (Mo-Sys / stYpe / OptiTrack), 10 GbE backbone. Revisit when scope expands.

## Network topology (current scope)

```
┌──────────────┐      Art-Net/sACN       ┌──────────────────┐     Spout (local)     ┌──────────────┐
│   Lighting   │ ─────────────────────►  │                  │ ◄───────────────────► │              │
│   Console    │                         │   UE machine     │                       │   Resolume   │
└──────────────┘                         │  (Win, 1 GPU)    │   OSC :8000           │   Arena      │
                                         │                  │ ◄─────────────────────│              │
┌──────────────┐      OSC :8000          │                  │                       └──────┬───────┘
│   Resolume   │ ─────────────────────►  │                  │                              │
│   (VJ)       │                         └──────────────────┘                              │
└──────────────┘                                                                           ▼
                                                                                  [ LED processor ]
```

## Plugin install order (recommended)

1. Create a new blank UE project
2. Enable built-in plugins: OSC Server, DMX, Motion Design, Niagara, nDisplay
3. Restart UE
4. Install community Spout plugin to `Engine/Plugins/` (or project `Plugins/` folder)
5. Restart UE
6. Verify each plugin appears in *Edit → Plugins* as enabled

## Sanity check after install

After everything is enabled, you should be able to:

- Add a `OSC Server` object to the level and bind a port
- Add a `DMX Entity` / `DMX Component` to a Blueprint
- See the **Motion Design** tab in the *Place Actors* panel (Text 3D, Shape, Cloner, etc.)
- Create a `Niagara System` from the content browser
- See `SpoutSender` as a Blueprint node after the Spout plugin loads

If any of those fail, the corresponding plugin isn't enabled or didn't compile.

---

Next: `02-learning-sequence.md`
