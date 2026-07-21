# Unreal Engine as a Creative Tool

A working reference for using **Unreal Engine 5** as a creative / live-events tool — not for game development. The target workflow:

- Procedural and motion-graphics content rendered in Unreal
- **Resolume Arena** used as the VJ front-end and LED-wall output mapper
- A **lighting console** (grandMA3, ChamSys, Eos, Avolites) integrated as a parallel cue source
- Cue triggers from either Resolume (OSC) or the console (Art-Net / sACN) drive scripted events in Unreal
- One-shot triggering only — no timecode / MTC sync required

## Scope (current)

- **Single-machine dev**. Multi-machine LED volume clusters are out of scope for now but covered conceptually as a stretch path (see `06-ndisplay-single-machine.md`).
- Output path: **UE → Spout → Resolume → LED processor**. NDI and direct-to-processor nDisplay are noted as alternatives.

## System Diagram

```
┌──────────────────┐        OSC / UDP :8000         ┌──────────────────────────┐
│  Resolume Arena  │ ─────────────────────────────► │                          │
│  (VJ front-end)  │                                │     Unreal Engine 5      │
└──────────────────┘                                │  ┌────────────────────┐  │
                                                    │  │   ShowController   │  │
┌──────────────────┐    Art-Net / sACN / UDP        │  │   (cue router)     │  │
│  Lighting        │ ─────────────────────────────► │  └─────────┬──────────┘  │
│  Console         │                                │            │             │
│  (cue triggers)  │                                │            ▼             │
└──────────────────┘                                │   Sequencer / Niagara /  │
                                                    │   Variant / Material     │
                                                    │            │             │
                                                    │            ▼             │
                                                    │   SceneCapture2D → RT    │
                                                    │            │             │
                                                    │            ▼             │
                                                    │     Spout Sender         │
                                                    └────────────┬─────────────┘
                                                                 │
                                                    ┌────────────▼─────────────┐
                                                    │  Resolume (Spout source) │
                                                    │  Advanced Output slices  │
                                                    └────────────┬─────────────┘
                                                                 │
                                                                 ▼
                                                          [ LED wall processor ]
```

## Quick Start (tl;dr)

1. **Install UE 5.5+** and enable plugins: *OSC Server*, *DMX Plugin*, *Motion Design*, *Niagara*. See `01-tech-stack.md`.
2. **Build the ShowController** Blueprint per `03-showcontroller-blueprint.md`. Place one instance in the persistent level.
3. **Wire both cue sources**:
   - Resolume OSC — see `04-resolume-osc-setup.md`
   - Console DMX — see `05-lighting-dmx-setup.md`
4. **Pipe UE output back to Resolume** via Spout — see `03` (RenderTarget section) and `04` (Resolume source setup).
5. **Stretch goal**: simulate a 3-screen LED rig on one machine via nDisplay — `06-ndisplay-single-machine.md`.

For the full learning path week-by-week, see `02-learning-sequence.md`.

## Document Index

| File | Contents |
|---|---|
| `01-tech-stack.md` | Engine version, plugins, protocols, hardware tiers |
| `02-learning-sequence.md` | 8-week curriculum from UE basics to a rehearsed cue show |
| `03-showcontroller-blueprint.md` | Central router Blueprint — vars, components, event graph |
| `04-resolume-osc-setup.md` | Arena OSC preferences, default addresses, custom mapping |
| `05-lighting-dmx-setup.md` | Console fixture patching, Art-Net/sACN, channel mapping |
| `06-ndisplay-single-machine.md` | Stretch: single-node nDisplay rig for 3 screens |

## Assumptions about the reader

- Comfortable with shader / creative-coding concepts (GLSL, SKSL, TouchDesigner, etc.)
- No prior Unreal experience required
- Has a Resolume Arena 7+ license and access to a lighting console
- Working on a Windows machine with a mid-to-high-end GPU (RTX 3080 / 4070 Ti or better)

## Licensing note

UE5 is royalty-free for non-game commercial use. Live events, broadcast, and virtual production work generally does **not** trigger the 5% game royalty. Per-seat **Enterprise** licensing is optional and only needed for support, full C++ source access, or specific UEFN-adjacent features.

---

Last updated: 2026-07-21
