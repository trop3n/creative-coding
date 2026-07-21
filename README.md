# render-shader

Renders a GLSL fragment shader to a video file (headless GL via moderngl, encoded by ffmpeg).

```
./render-shader shaders/plasma.frag --size 1920x1080 --fps 60 --dur 8 --codec hap_q
```

Accepts three shader dialects, auto-detected:

- **Shadertoy-style** — `mainImage(out vec4, in vec2)` with `iTime`, `iResolution`, `iFrame`, `iTimeDelta`, `iMouse`, `iDate` (mouse is fixed at 0; `iChannelN` textures are not supported)
- **glslCanvas-style** — `void main()` with `gl_FragColor`, `u_time`, `u_resolution`
- **raw GLSL 330+** — has its own `#version` line and `out vec4`

## Options

| flag | default | meaning |
|---|---|---|
| `--size WxH` | `1920x1080` | output resolution |
| `--fps N` | `60` | frame rate |
| `--dur SECONDS` | `10` | length of the clip |
| `--start SECONDS` | `0` | shader time at the first frame |
| `--codec NAME` | `h264` | see table below |
| `--crf N` | `16` | h264 quality (lower = better) |
| `--out FILE` | shader name + ext | output path |
| `--still SECONDS` | — | render one frame at that time to a PNG instead |
| `--ffmpeg PATH` | `$FFMPEG` or `ffmpeg` | alternate ffmpeg binary |

## Codecs

| codec | container | alpha | use for |
|---|---|---|---|
| `h264` | .mp4 | no | previews, sharing |
| `prores` | .mov | no | editing (ProRes 422 HQ) |
| `prores4444` | .mov | yes | editing with alpha |
| `hap` | .mov | no | VJ playback, smallest |
| `hap_q` | .mov | no | VJ playback, higher quality |
| `hap_alpha` | .mov | yes | VJ playback with alpha |
| `dxv` | .mov | no | Resolume-native (needs ffmpeg >= 7.0) |

For Resolume, use `hap_q` (plays natively, GPU-decoded) or `dxv`. The system ffmpeg
here is 6.1, which has no DXV encoder — point `--ffmpeg` at a 7.0+ build if you want
DXV, or just use HAP. ffmpeg's DXV is DXT1 ("Normal Quality"), no alpha.

HAP/DXV need width and height divisible by 4; h264 needs them even.

## Notes

- Time is driven by the frame counter, not the clock, so output is deterministic and
  render speed doesn't affect the result. Rendering uses llvmpipe (software GL) under
  WSL2 — heavy shaders at 4K just take longer.
- Install elsewhere on PATH: `ln -s ~/dev/creative-coding/render-shader ~/.local/bin/`
- Setup (already done): `python3 -m venv .venv && .venv/bin/pip install moderngl`
