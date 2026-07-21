# 06 — nDisplay on a Single Machine (Stretch)

> **Stretch goal.** Skip this document entirely if your shows will always route through Resolume for VJ mixing, and the latency of the UE → Spout → Resolume → processor pipeline (Week 6) is acceptable. nDisplay is only worth adopting when you need lower latency, frame-locked multi-screen output, or LED-volume parallax — none of which are required for the current single-machine scope.

## When to graduate from Spout → nDisplay

Adopt nDisplay when **any** of these become true:

| Requirement | Why nDisplay |
|---|---|
| Sub-frame latency to wall processor | Spout → Resolume → processor adds 1–3 frames. nDisplay writes direct. |
| Multiple outputs, frame-locked | nDisplay syncs viewports via Genlock / NVAPI; Spout doesn't. |
| LED volume with camera tracking | Inner/outer frustum rendering requires nDisplay's projection system. |
| Bypass Resolume entirely for one layer | Some shows run UE direct to processor + Resolume in parallel on a separate output. |
| You need > 4 outputs | Resolume is limited to GPU output count. nDisplay clusters scale horizontally. |

Stay with Spout → Resolume when:

- You actively VJ during the show (mixing UE content with pre-rendered loops)
- One machine is enough for your output count
- 1–3 frame latency is invisible to the audience (most non-music-sync shows)
- Resolume's effects chain adds value (feedback, color, crossfade)

## Conceptual model

nDisplay is **UE's distributed rendering system for LED walls and large projection setups**. Key ideas:

1. **Node**: one UE instance running on one machine (or one GPU viewport on a multi-GPU machine).
2. **Viewport**: a rectangular view into the rendered scene, with a defined projection.
3. **Screen**: a logical group of viewports forming one physical screen (LED wall, projector, etc.).
4. **Inner/Outer frustum** (LED volumes only): inner = what the camera sees; outer = what's visible to the audience when the camera isn't looking. The illusion of depth on a 2D wall.
5. **Sync**: Genlock (hardware) or software PTP, ensuring all nodes swap buffers at the same instant.
6. **Cluster**: all nodes running the same scene with a shared `.ndisplay` config.

## Single-node cluster (current scope)

On a single machine, nDisplay lets you define multiple viewports rendered from offset cameras, each writing to a separate output. This simulates a multi-screen rig without any additional hardware.

A typical 3-screen dev rig:
- 3 viewports, each 1920×1080
- Left camera yawed -60°, center forward, right yawed +60°
- Each viewport writes to a separate Spout sender (`Screen_Left`, `Screen_Center`, `Screen_Right`)
- Resolume ingests all three and composites / outputs to the wall

## Part 1 — The `.ndisplay` config file

nDisplay reads a text configuration file describing the cluster. Format changed substantially in UE 5.0 (now uses `[scene_node]` / `[screen_node]` / `[viewport]` blocks). Example for a single-node 3-screen rig:

```ini
; Single-node, 3-screen dev rig
[cluster_node]
id=node01
host=127.0.0.1

; Define the render node (the UE instance)
[window]
id=wnd_main
mode=fullscreen
ownswnd=true

; Three screens, each rendered from an offset camera
[scene_node]
id=cam_left
loc=0,0,0
rot=pitch=0,yaw=-60,roll=0

[scene_node]
id=cam_center
loc=0,0,0
rot=pitch=0,yaw=0,roll=0

[scene_node]
id=cam_right
loc=0,0,0
rot=pitch=0,yaw=60,roll=0

; Viewports — one per screen
[viewport]
id=vp_left
type=render
screen=screen_left
camera=cam_left
size=1920,1080

[viewport]
id=vp_center
type=render
screen=screen_center
camera=cam_center
size=1920,1080

[viewport]
id=vp_right
type=render
screen=screen_right
camera=cam_right
size=1920,1080

; Output surfaces (LED wall geometry — for flat panels, simple planes)
[screen_node]
id=screen_left
loc=0,0,0
size=1920x1080
rotation=yaw=-60

[screen_node]
id=screen_center
loc=0,0,0
size=1920x1080
rotation=yaw=0

[screen_node]
id=screen_right
loc=0,0,0
size=1920x1080
rotation=yaw=60
```

Save as `MyShow.ndisplay` in the project's `Config` folder.

> **Syntax disclaimer**: nDisplay config format has evolved across UE versions. The block names above (`[scene_node]`, `[screen_node]`, `[viewport]`) reflect UE 5.4+. Always cross-check against the version-specific Epic docs at `dev.epicgames.com/documentation/unreal-engine/ndisplay`.

## Part 2 — Launching nDisplay

Run from the project's binary folder:

```bash
# Windows
UnrealEditor.exe MyShow.uproject -game -ndisplay=Config/MyShow.ndisplay

# Or via the nDisplay Launcher wizard (built into the editor)
# Edit → Project Settings → nDisplay → Configuration Wizard
```

You should see three windows (or one triple-wide window) appear, each showing the scene from its respective camera angle. They will be perfectly frame-locked on a single GPU because they share the same render thread.

## Part 3 — Output to Spout (instead of physical outputs)

In single-machine dev, route each viewport to a Spout sender instead of a physical display:

1. Add the **nDisplay Spout Output** plugin (community plugin, similar to regular Spout for UE)
2. In the `.ndisplay` config, set each viewport's `output` to a Spout sender name:
   ```ini
   [viewport]
   id=vp_left
   ...
   output=spout:Screen_Left
   ```
3. In Resolume, add three Spout sources: `Screen_Left`, `Screen_Center`, `Screen_Right`
4. Composite in Resolume Advanced Output as before

This gives you nDisplay's frame-locked multi-view rendering while keeping Resolume's output mapping and VJ layer — best of both worlds for dev.

## Part 4 — Inner / Outer Frustum (Conceptual)

Relevant only when you have a **camera-tracked LED volume** (wall + ceiling + floor that actors / presenters stand inside). Skip this section if you're only doing flat LED walls or projection.

The problem: a flat LED wall shows a fixed perspective. When a real camera moves through the volume, the perspective on the wall should shift as if the wall were a window into a virtual world.

The solution:
- **Outer frustum**: what the human eye (audience, not the camera) sees on the wall. Slowly updated, smooth.
- **Inner frustum**: what the in-camera view sees through the wall. Updated at the camera's actual position via Live Link tracking data. Higher latency tolerance (camera sees only the inner frustum region).

nDisplay composites both layers per frame. The result: walking a camera through the volume produces parallax-correct imagery on the wall that reads correctly through the lens.

For a single-machine dev rig, you can simulate this by:
1. Connecting a fake Live Link source (use the **Live Link Free Camera** plugin)
2. Defining a virtual "camera frustum" rectangle inside your screen
3. Letting nDisplay render the inner frustum from the tracked camera's perspective

Most shows don't need this. It's mentioned here so you know what nDisplay *does* — and what you're skipping if you stay with Spout → Resolume.

## Part 5 — Sync (Conceptual, Required for Multi-Node)

If/when you graduate to multi-machine clusters, you'll need hardware sync:

| Option | Hardware | Notes |
|---|---|---|
| **Genlock (BNC)** | Quadro Sync card + reference signal | Industry standard, most reliable |
| **NVAPI Sync** | Single-vendor NVIDIA GPUs on one machine | Cheaper than Quadro Sync, single-machine only |
| **PTP (IEEE 1588)** | Network time sync | Newer, growing adoption, no BNC cable required |

For single-machine dev (current scope), sync is automatic — all viewports share the render thread. No hardware sync needed.

When you do graduate, plan for:
- One **Quadro Sync card per machine** (RTX 4000 Ada / RTX 6000 Ada or similar)
- A **reference signal generator** (tri-level sync, typically 59.94 Hz or 60 Hz matching the wall processor)
- A **managed switch** with PTP support if using PTP sync
- **Genlock cables** (BNC) daisy-chained across machines

## Part 6 — Decision Matrix

| Question | Yes | No |
|---|---|---|
| Do you need Resolume's VJ layer for compositing? | Stay with Spout (Week 6) | nDisplay optional |
| Is 1–3 frame latency acceptable for your show? | Stay with Spout | nDisplay |
| Are you doing a tracked LED volume (parallax)? | nDisplay | Stay with Spout |
| Are you running out of GPU outputs on one card? | nDisplay multi-node | Add a second GPU with NVAPI sync first |
| Is your team experienced with cluster deployment? | nDisplay | Stay with Spout until you can train |

For most VJ / live-events / motion-graphics work, **stay with Spout → Resolume**. Move to nDisplay when a specific show demands it, not preemptively.

## Part 7 — Migration Path

When you do adopt nDisplay, the ShowController Blueprint doesn't change. Only the **output** layer does:

1. Current: `OutputRig` Actor with SceneCapture2D → RenderTarget → Spout Sender
2. Future: `.ndisplay` config defines viewports; nDisplay handles capture and output internally

The cue router (ShowController), the OSC/DMX receivers, the Sequencer/Niagara/Variant firing — all unchanged. This is the payoff of decoupling cue logic from output in the original design.

---

Back to: [README.md](./README.md)
