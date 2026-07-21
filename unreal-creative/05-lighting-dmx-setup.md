# 05 — Lighting Console DMX Setup

How to integrate a lighting console (grandMA3, ChamSys MagicQ, ETC Eos, Avolites) as a parallel cue source alongside Resolume. The ShowController treats DMX triggers identically to OSC triggers — same logical cue IDs, same dispatcher.

## Why DMX alongside OSC

A lighting console is the most reliable cue source in a live-events environment:
- **Hardware buttons** (no misclicks on a touchscreen)
- **Operator muscle memory** (LD is already running the console)
- **Show file integration** (cues fire with the rest of the lighting plot)
- **Redundancy** — if Resolume crashes, the console still triggers UE
- **No software layer in the way** (no macOS audio restart, no app focus issues)

The ShowController listens to both OSC and DMX in parallel. Either source can fire any cue.

## Console selection notes

| Console | Protocol | Offline editor for learning |
|---|---|---|
| **grandMA3** | Art-Net (default) or sACN | grandMA3 onPC (free) |
| **ChamSys MagicQ** | Art-Net | MagicQ PC (free) |
| **ETC Eos** | sACN (default) | Eos nomad (free tier) |
| **Avolites Diamond / Tiger** | Art-Net | Titan Simulator (free) |

For learning, install the offline editor that matches the console you'll use on the actual show. All of them are free and let you patch fixtures and configure DMX output without hardware.

## Art-Net vs sACN

| Concern | Art-Net | sACN (ANSI E1.31) |
|---|---|---|
| Default port | UDP `6454` | UDP `5568` (multicast `239.255.x.x`) |
| Transport | Unicast or broadcast | Multicast |
| Network load | Higher (every packet goes everywhere on broadcast) | Lower (multicast, switches filter) |
| Console default | grandMA3, ChamSys, Avolites | ETC Eos |
| UE DMX plugin support | ✓ | ✓ |

Pick whichever protocol your console already speaks — the Blueprint side is identical. If starting from scratch, prefer **sACN** for cleaner multicast behavior on a managed switch.

## Part 1 — Patch a "UE Trigger" Fixture

Conceptually, you don't need real lighting fixtures. You need channels that fire when cues run. The cleanest way is to patch a generic "UE Trigger" fixture with one channel per cue.

### Patch on the console

1. **Fixture definition**: a custom fixture with N channels of 8-bit intensity (or 16-bit if you want smooth fades). For 10 cues, that's 10 channels — fits in one DMX universe.
2. **Patch** to Universe 1, starting at address 1.
3. **Assign to a cue list**: in your show file, each cue stores values for those channels.
4. **Per cue**: the channel for the triggered cue goes to full (`255`); all others stay at `0`.

Example cue list (channels 1–5):
| Cue | Ch 1 | Ch 2 | Ch 3 | Ch 4 | Ch 5 |
|---|---|---|---|---|---|
| 1 (blackout) | 255 | 0 | 0 | 0 | 0 |
| 2 (title card) | 0 | 255 | 0 | 0 | 0 |
| 3 (particle burst) | 0 | 0 | 255 | 0 | 0 |
| 4 (color wash) | 0 | 0 | 0 | 255 | 0 |
| 5 (look B) | 0 | 0 | 0 | 0 | 255 |

Per-channel values are stored as part of each cue's tracking. Running cue N fires its values.

### Console-specific patching

#### grandMA3
1. `Patch` → `Fixture Types` → import or create custom "UE Trigger" type with 5 attributes (8-bit each)
2. `Patch` → select fixture type → tap on channel grid → assign to Universe 1, Address 1
3. `Network → Art-Net` → enable, set subnet 0, universe 0
4. Set destination IP to UE machine IP
5. Save show

#### ChamSys MagicQ
1. **Patch Window** → enter fixture type `9999` (generic 10-channel) → universe 1, DMX 1
2. **Setup → View Settings → Network** → enable Art-Net output, set UE IP
3. Save show

#### ETC Eos (sACN)
1. **Show Control → Patch** → enter fixture type `Generic Dimmer`, count 10, address 1 / universe 1
2. **Shell → Settings → Network → sACN** → enable
3. Set UE machine IP as sACN output target (or rely on multicast)
4. Save show

#### Avolites
1. **Patch** → generic dimmer, 10 channels, address 1, universe 1
2. **DMX Output Mapping** → enable Art-Net, set UE IP
3. Save show

## Part 2 — Configure UE DMX Plugin

### Enable and set protocol

1. UE → **Edit → Project Settings → Plugins → DMX Plugin**
2. **DMX Protocol**: select `Art-Net` or `sACN` (must match console)
3. For Art-Net: set **Universe ID** to match console (default 0)
4. For sACN: set **Universe ID** to match console (default 1; note sACN is 1-indexed, Art-Net is 0-indexed — verify per console)

### Patch the DMX Component on ShowController

In the ShowController Blueprint's `DMXComponent`:
1. Set **Universe** to console's output universe
2. Set **Starting Channel** to match your patch (default 1)
3. Set **Channel Count** to cover your cue count (e.g., 10 channels for 10 cues)
4. Enable **Receive Updates**

### Verify reception

In the ShowController Event Graph, add a temporary debug node:

```
[Event OnDmxChannelValueChange(Channel, Value)]
   → PrintString("DMX ch=%d val=%f".Format(Channel, Value))
```

Push a fader on the console. You should see the channel and value print in the UE output log.

If nothing arrives:
- **Check Wireshark** filter `art-net` or `udp.port == 5568` (sACN)
- Verify console IP and UE IP are on the same subnet
- Verify firewall allows the DMX port on the UE machine (Windows Defender often blocks by default)
- Check that the console is sending *to* the UE IP (unicast) or that the switch passes multicast (sACN)

## Part 3 — Channel-to-CueID Mapping

In the `CueRouteTable` DataAsset (see `03-showcontroller-blueprint.md`), populate the DMX routes:

| Channel | Cue ID |
|---|---|
| 1 | 0 (blackout) |
| 2 | 1 (title card) |
| 3 | 2 (particle burst) |
| 4 | 3 (color wash) |
| 5 | 4 (look B) |
| 6 | 99 (next look) |

Note these are the **same cue IDs** as the OSC routes — both protocols map into one namespace.

## Part 4 — Triggering Modes

### Mode A: Trigger cue (recommended)

Console fires channel to `255` instantly, holds for the duration of the cue, returns to `0` when next cue fires.

The ShowController's `DmxToCueId` uses a **rising-edge** check: only fires when the value transitions from `0` to non-zero. Re-fires safely if the operator pushes the same cue again.

### Mode B: Latched cues

Channel stays at `255` until operator explicitly releases. Same rising-edge logic — fires once per transition into non-zero.

### Mode C: Fader-controlled (advanced, not used for one-shot)

Channel value (0–255) maps to a continuous parameter. Not in scope for the current ShowController, which is one-shot only. Add later if you want parameterized looks (e.g., "fader controls bloom intensity").

### Avoid: HTP/LTP conflicts

DMX uses **HTP (Highest Takes Precedence)** for intensity channels by default. If multiple sources write to the same channel, the highest wins. Don't put two trigger sources on the same channel — give each cue its own channel.

## Part 5 — Network Configuration

### Dedicated DMX network (recommended)

For real shows, isolate DMX traffic on its own VLAN or physical network:

```
┌─────────────────┐         ┌─────────────────┐
│  Lighting       │  Art-Net │                │
│  Console  ──────┼─────────┼─► UE machine    │
│                 │   VLAN 10                │
└─────────────────┘                          │
                                             │
┌─────────────────┐         ┌─────────────────┐
│  Resolume  ─────┼─OSC─────┼─► UE machine    │
│                 │  VLAN 20                │
└─────────────────┘                          │
```

For learning/dev: a single flat network is fine. Just make sure the UE machine's firewall allows inbound on UDP `6454` (Art-Net), `5568` (sACN), and `8000` (OSC).

### Windows Defender Firewall

Add inbound rules for:
- UDP `8000` (OSC from Resolume)
- UDP `6454` (Art-Net from console)
- UDP `5568` (sACN from console)

Or temporarily disable the firewall on the private network for testing only — never on a show-day network without IT approval.

### Latency

- Art-Net over a managed switch: < 5 ms one-way
- sACN multicast on a busy switch: 5–20 ms
- OSC over Wi-Fi: 10–50 ms (use wired if possible)

For cue triggering, anything under 50 ms is perceptually instantaneous. The ShowController adds ~1 frame (16 ms at 60 Hz) of internal latency before the Sequence starts playing.

## Part 6 — Failure Modes and Recovery

| Failure | Symptom | Mitigation |
|---|---|---|
| Console reboot mid-show | UE stops receiving DMX | Heartbeat in ShowController: warn if no DMX packets for 5 s; show continues from last cue |
| Wrong universe selected | No DMX in UE | Check `Project Settings → DMX Plugin → Universe ID` matches console |
| Multicast not routed (sACN) | No DMX in UE | Verify IGMP snooping enabled on managed switch |
| Channel conflict | Wrong cue fires | Audit console show file for overlapping patches |
| Value held high | Cue fires once, then stops | Rising-edge logic in `DmxToCueId` — only fires on 0 → non-zero transition |

## Part 7 — Testing Without Hardware

Free tools to validate the DMX path before any console is connected:

- **DMXWorkshop** (Art-Net, Windows/Mac): graphical Art-Net transmitter/recorder
- **sACNView** (sACN, Windows): sACN transmitter and viewer
- **OLA (Open Lighting Architecture)**: cross-platform, both protocols, CLI-friendly

Send test values from these tools to verify UE receives correctly. Then swap to the real console — Blueprint side never changes.

---

Next: `06-ndisplay-single-machine.md`
