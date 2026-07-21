# 03 — ShowController Blueprint

The central cue router. One Actor placed in the persistent level that owns all cue logic. Both Resolume (OSC) and the lighting console (DMX) feed into it; both produce the same kind of logical cue ID that drives the same dispatcher.

## Design Principles

1. **Logical cue IDs are protocol-agnostic.** Cue `3` means "title card Sequence" no matter who triggered it.
2. **Idempotent re-triggers.** Firing Cue 3 twice in a row should never spawn overlapping Sequences.
3. **Routing tables are data-driven.** Maps are populated from a `DataAsset` at `BeginPlay` so non-programmers can edit mappings without touching Blueprint logic.
4. **No transport sync.** This is one-shot triggering only — no BPM, no timecode, no MTC.

## Components

Added in the Blueprint's *Components* panel:

| Component | Settings |
|---|---|
| `OSCReceiver` | Port `8000`, bound at `BeginPlay` |
| `DMXComponent` | Protocol matches console (Art-Net or sACN), Universe `1`, Starting Channel `1`, N channels |

## Variables

### EditableAnywhere (set per-project)

| Name | Type | Purpose |
|---|---|---|
| `CueSequences` | `TArray<ULevelSequence*>` | Index → sequence asset per cue |
| `CueNiagaraSystems` | `TArray<UNiagaraSystem*>` | Index → particle effect per cue (nullable per entry) |
| `LookVariants` | `TArray<FString>` | Variant Manager set names per cue (nullable) |
| `MasterBrightnessMPC` | `UMaterialParameterCollection*` | Global brightness multiplier for blackout |
| `RouteTable` | `UCueRouteTable*` (DataAsset) | OSC address / DMX channel → cue ID mapping |
| `DebugLogging` | `bool` (default true) | Verbose `PrintString` for development |

### Transient (runtime only)

| Name | Type | Purpose |
|---|---|---|
| `ActiveSequencePlayer` | `ULevelSequencePlayer*` | Currently playing sequence (for clean stop on re-trigger) |
| `CurrentLook` | `int32` | Active look index |
| `BlackoutID` | `int32` | Reserved cue ID (default `-1` for none) |
| `NextLookID` | `int32` | Reserved cue ID (default `-1` for none) |

## CueRouteTable DataAsset

A simple `UPrimaryDataAsset` subclass holding:

```cpp
USTRUCT(BlueprintType)
struct FOSCMapping {
    GENERATED_BODY()
    UPROPERTY(EditAnywhere) FString Address;   // e.g. "/composition/columns/2/connect"
    UPROPERTY(EditAnywhere) int32 CueId = -1;
};

USTRUCT(BlueprintType)
struct FDMXMapping {
    GENERATED_BODY();
    UPROPERTY(EditAnywhere) int32 Channel = 0;   // 1-based
    UPROPERTY(EditAnywhere) int32 CueId = -1;
};

UCLASS()
class UCueRouteTable : public UPrimaryDataAsset {
    GENERATED_BODY()
public:
    UPROPERTY(EditAnywhere) TArray<FOSCMapping> OscRoutes;
    UPROPERTY(EditAnywhere) TArray<FDMXMapping> DmxRoutes;
};
```

Create one instance per project in the Content Browser. Edit mappings in the DataAsset editor (no Blueprint changes needed when adding cues).

## Event Graph — Three Layers

### Layer 1: Receivers (raw protocol events)

```
[BeginPlay]
   │
   ├──► OSCReceiver.SetReceivePort(8000)
   ├──► OSCReceiver.Start()
   ├──► Build maps from RouteTable (OscAddressToCueId, DmxChannelToCueId)
   │
[Event OnOSCMessage(Address, Data)]  ──► OscToCueId(Address)  ──► FireCue(CueId, "OSC:"+Address)
[Event OnDmxChannelValueChange(Channel, Value)]  ──► DmxToCueId(Channel, Value)  ──► FireCue(CueId, "DMX:ch"+Channel)
```

### Layer 2: Protocol → Logical Cue ID

```
FUNCTION OscToCueId(Address : FString) → int32
    if OscAddressToCueId.Contains(Address):
        return OscAddressToCueId[Address]
    return -1

FUNCTION DmxToCueId(Channel : int32, Value : float) → int32
    // Only fire on rising edge — ignore Value=0 (release)
    if Value <= 0:
        return -1
    if DmxChannelToCueId.Contains(Channel):
        return DmxChannelToCueId[Channel]
    return -1
```

**Rising-edge note**: Consoles often hold a fader at a non-zero value after release. Without the rising-edge check, every frame would re-fire the cue. The check above only fires on a non-zero value *change* — for binary triggers use a "value went from 0 to >0" check, for faders use a threshold crossing.

### Layer 3: Dispatcher (only place that does real work)

```
EVENT FireCue(CueId : int32, Source : FString)
    if DebugLogging: PrintString("Cue %d from %s".Format(CueId, Source))

    if CueId == BlackoutID:
        ExecuteBlackout()
        return

    if CueId == NextLookID:
        ExecuteNextLook()
        return

    if CueId < 0 or CueId >= CueSequences.Length:
        if DebugLogging: PrintString("Invalid cue %d".Format(CueId))
        return

    // Idempotent re-trigger: stop previous cleanly
    if IsValid(ActiveSequencePlayer):
        ActiveSequencePlayer.StopWithoutCleanup()

    // Brightness back to normal in case of prior blackout
    SetMPCScalar(MasterBrightnessMPC, "Brightness", 1.0)

    // Fire sequence
    ActiveSequencePlayer = CreateLevelSequencePlayer(CueSequences[CueId])
    ActiveSequencePlayer.Play()

    // Optional Niagara burst
    if CueNiagaraSystems.IsValidIndex(CueId) && IsValid(CueNiagaraSystems[CueId]):
        SpawnSystemAtLocation(CueNiagaraSystems[CueId], FVector(0,0,0))

    // Optional Variant swap
    if LookVariants.IsValidIndex(CueId) && !LookVariants[CueId].IsEmpty():
        VariantManager.SetActiveVariantByName(LookVariants[CueId])
```

### Specialty cues

```
FUNCTION ExecuteBlackout()
    if IsValid(ActiveSequencePlayer):
        ActiveSequencePlayer.StopWithoutCleanup()
    SetMPCScalar(MasterBrightnessMPC, "Brightness", 0.0)

FUNCTION ExecuteNextLook()
    CurrentLook = (CurrentLook + 1) % LookVariants.Length
    VariantManager.SetActiveVariantByName(LookVariants[CurrentLook])
    if DebugLogging: PrintString("Look: " + LookVariants[CurrentLook])
```

## Sample Mapping Tables

### OSC (Resolume)

| OSC Address | Cue ID | Meaning |
|---|---|---|
| `/composition/columns/1/connect` | 0 | Blackout |
| `/composition/columns/2/connect` | 1 | Title card |
| `/composition/columns/3/connect` | 2 | Particle burst |
| `/composition/columns/4/connect` | 3 | Color wash |
| `/composition/columns/5/connect` | 4 | Look B |
| `/composition/columns/6/connect` | 99 | Next look (reserved) |

### DMX (lighting console)

| Channel | Cue ID | Meaning |
|---|---|---|
| 1 | 0 | Blackout |
| 2 | 1 | Title card |
| 3 | 2 | Particle burst |
| 4 | 3 | Color wash |
| 5 | 4 | Look B |
| 6 | 99 | Next look (reserved) |

Both tables live in the `CueRouteTable` DataAsset. Note that OSC and DMX cue IDs match for the same logical cue — that's the point.

## RenderTarget + Spout (Output side)

The ShowController does **not** own the Spout output (separation of concerns). Create a separate `OutputRig` Actor:

### OutputRig Actor

**Components**:
- `SceneCaptureComponent2D` (set `CaptureSource = Final Color HDR`, resolution to wall native)
- `SpoutSender` (community plugin)

**Variables**:
- `OutputRenderTarget` (TextureRenderTarget2D, 1920×1080 or wall native)
- `SenderName` (default `"UE_Output"`)

**Construction Script**:
```
SceneCapture.TextureTarget = OutputRenderTarget
SpoutSender.SetRenderTarget(OutputRenderTarget)
SpoutSender.SetSenderName(SenderName)
```

**Tick**: `SceneCapture.CaptureScene()` every frame (or only on demand for performance)

**Color**: UE renders Linear. If Resolume expects sRGB, set `RenderTarget`'s `RenderTargetFormat` to `RTF RGBA8 sRGB` and apply an OCIO config, or apply a `Power(1/2.2)` in a post-process Material before capture.

## End-to-End Flow

```
[Resolume clip]  ──OSC──┐
                        ├──► ShowController.FireCue(id) ──► Sequencer + Niagara + Variant
[Console cue]    ──DMX──┘
                                                                      │
                                                                      ▼
                                                          OutputRig.SceneCapture
                                                                      │
                                                                      ▼
                                                              SpoutSender "UE_Output"
                                                                      │
                                                                      ▼
                                                       Resolume source → Advanced Output → wall
```

## Failure-mode handling (revisit in Week 8)

| Failure | Mitigation |
|---|---|
| OSC packet lost | Cues are idempotent — operator can re-fire safely. Heartbeat ping every 1 s with console log on timeout. |
| DMX value held by console | Rising-edge check in `DmxToCueId` prevents refire loops |
| Console reboot | Heartbeat: if no DMX packets for 5 s, print warning but keep running |
| Sequence player leak | `StopWithoutCleanup` on every refire; garbage collector handles the rest |
| Invalid cue ID | Logged and silently ignored — never crashes the show |
| Brightness stuck at 0 | `FireCue` resets to 1.0 before playing (so blackout → next cue always restores visibility) |

## Testing without hardware

- **OSC**: use **TouchOSC** (mobile app) or **oscsend** CLI to fire addresses into UE
- **DMX**: use **DMXWorkshop** (Art-Net) or **sACNView** to send values
- **Spout**: SpoutOutput can be monitored by **SpoutReceiver** app independently of Resolume

This lets you develop and verify the ShowController with zero physical hardware.

---

Next: `04-resolume-osc-setup.md`
