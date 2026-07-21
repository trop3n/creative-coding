#!/usr/bin/env python3
"""Render a GLSL fragment shader to a video file (mp4/mov) via headless GL + ffmpeg.

Accepts Shadertoy-style shaders (mainImage/iTime/iResolution), glslCanvas-style
shaders (gl_FragColor/u_time/u_resolution), and raw GLSL 330+ fragment shaders.
"""

import argparse
import datetime
import os
import re
import subprocess
import sys
import time

CODECS = {
    "h264":       dict(ext=".mp4", alpha=False, mult=2, args=["-c:v", "libx264", "-preset", "slow", "-movflags", "+faststart", "-pix_fmt", "yuv420p"]),
    "prores":     dict(ext=".mov", alpha=False, mult=2, args=["-c:v", "prores_ks", "-profile:v", "3", "-pix_fmt", "yuv422p10le"]),
    "prores4444": dict(ext=".mov", alpha=True,  mult=2, args=["-c:v", "prores_ks", "-profile:v", "4444", "-pix_fmt", "yuva444p10le"]),
    "hap":        dict(ext=".mov", alpha=False, mult=4, args=["-c:v", "hap"]),
    "hap_q":      dict(ext=".mov", alpha=False, mult=4, args=["-c:v", "hap", "-format", "hap_q"]),
    "hap_alpha":  dict(ext=".mov", alpha=True,  mult=4, args=["-c:v", "hap", "-format", "hap_alpha"]),
    "dxv":        dict(ext=".mov", alpha=False, mult=4, args=["-c:v", "dxv"]),
}

VERTEX_SHADER = """\
#version 330 core
out vec2 v_uv;
void main() {
    vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
    v_uv = p;
    gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}
"""

SHADERTOY_HEADER = """\
#version 330 core
uniform vec3  iResolution;
uniform float iTime;
uniform float iTimeDelta;
uniform int   iFrame;
uniform vec4  iMouse;
uniform vec4  iDate;
out vec4 rs_fragColor;
#define texture2D texture
"""

SHADERTOY_FOOTER = """
void main() { mainImage(rs_fragColor, gl_FragCoord.xy); }
"""

LEGACY_HEADER = """\
#version 330 core
#define gl_FragColor rs_fragColor
#define texture2D texture
#define varying in
out vec4 rs_fragColor;
"""


def build_fragment_shader(src):
    """Wrap the user's shader into GLSL 330 core, based on its dialect."""
    has_version = re.search(r"^\s*#version\b", src, re.M)
    stripped = re.sub(r"^\s*#version[^\n]*\n", "", src, count=1, flags=re.M)

    if re.search(r"\bmainImage\s*\(", src):
        return SHADERTOY_HEADER + stripped + SHADERTOY_FOOTER, "shadertoy"
    if "gl_FragColor" in src:
        return LEGACY_HEADER + stripped, "glslCanvas"
    if has_version:
        return src, "raw"
    return "#version 330 core\n" + src, "raw"


def parse_size(text):
    m = re.fullmatch(r"(\d+)x(\d+)", text.lower())
    if not m:
        raise argparse.ArgumentTypeError(f"size must look like 1920x1080, got {text!r}")
    return int(m.group(1)), int(m.group(2))


def check_encoder(ffmpeg, name):
    out = subprocess.run([ffmpeg, "-hide_banner", "-encoders"],
                         capture_output=True, text=True).stdout
    return re.search(rf"\b{name}\b", out) is not None


def set_uniform(prog, name, value):
    member = prog.get(name, None)
    if member is not None:
        member.value = value


def main():
    ap = argparse.ArgumentParser(
        prog="render-shader",
        description="Render a GLSL fragment shader to video.",
        epilog="Codecs: " + ", ".join(CODECS))
    ap.add_argument("shader", help="fragment shader file (.frag/.glsl)")
    ap.add_argument("--size", type=parse_size, default=(1920, 1080), metavar="WxH",
                    help="output resolution (default 1920x1080)")
    ap.add_argument("--fps", type=float, default=60.0, help="frame rate (default 60)")
    ap.add_argument("--dur", type=float, default=10.0, metavar="SECONDS",
                    help="duration in seconds (default 10)")
    ap.add_argument("--start", type=float, default=0.0, metavar="SECONDS",
                    help="shader time at first frame (default 0)")
    ap.add_argument("--codec", choices=CODECS, default="h264",
                    help="output codec (default h264)")
    ap.add_argument("--crf", type=int, default=16,
                    help="h264 quality, lower is better (default 16)")
    ap.add_argument("--out", metavar="FILE",
                    help="output path (default: shader name + codec extension)")
    ap.add_argument("--still", type=float, metavar="SECONDS",
                    help="render a single frame at this time to a PNG instead of a video")
    ap.add_argument("--ffmpeg", default=os.environ.get("FFMPEG", "ffmpeg"),
                    help="ffmpeg binary to use (or set $FFMPEG)")
    args = ap.parse_args()

    W, H = args.size
    codec = CODECS[args.codec]
    mult = codec["mult"]
    if W % mult or H % mult:
        ap.error(f"{args.codec} needs width and height divisible by {mult}, got {W}x{H}")

    if args.codec == "dxv" and not check_encoder(args.ffmpeg, "dxv"):
        sys.exit(f"error: {args.ffmpeg!r} has no DXV encoder (needs ffmpeg >= 7.0).\n"
                 "  - use --codec hap_q instead (Resolume plays HAP natively), or\n"
                 "  - point --ffmpeg (or $FFMPEG) at a newer build, e.g. a BtbN static release.\n"
                 "  Note: ffmpeg's DXV is DXT1 ('Normal Quality'), no alpha.")

    with open(args.shader) as f:
        source = f.read()
    frag, dialect = build_fragment_shader(source)

    stem = os.path.splitext(os.path.basename(args.shader))[0]
    still = args.still is not None
    out = args.out or (stem + (".png" if still else codec["ext"]))

    import moderngl
    try:
        ctx = moderngl.create_context(standalone=True)
    except Exception:
        ctx = moderngl.create_context(standalone=True, backend="egl")

    try:
        prog = ctx.program(vertex_shader=VERTEX_SHADER, fragment_shader=frag)
    except moderngl.Error as e:
        sys.exit(f"shader compile failed (interpreted as {dialect} dialect):\n{e}")

    vao = ctx.vertex_array(prog, [])
    fbo = ctx.simple_framebuffer((W, H), components=4)
    fbo.use()

    components = 4 if codec["alpha"] else 3
    pix_fmt = "rgba" if codec["alpha"] else "rgb24"

    set_uniform(prog, "iResolution", (float(W), float(H), 1.0))
    set_uniform(prog, "u_resolution", (float(W), float(H)))
    set_uniform(prog, "iMouse", (0.0, 0.0, 0.0, 0.0))
    set_uniform(prog, "u_mouse", (0.0, 0.0))
    now = datetime.datetime.now()
    secs = now.hour * 3600 + now.minute * 60 + now.second
    set_uniform(prog, "iDate", (float(now.year), float(now.month), float(now.day), float(secs)))

    def render_frame(frame_index, t):
        set_uniform(prog, "iTime", t)
        set_uniform(prog, "u_time", t)
        set_uniform(prog, "iTimeDelta", 1.0 / args.fps)
        set_uniform(prog, "iFrame", frame_index)
        vao.render(vertices=3)
        return fbo.read(components=components)

    if still:
        cmd = [args.ffmpeg, "-hide_banner", "-loglevel", "error", "-y",
               "-f", "rawvideo", "-pix_fmt", pix_fmt, "-s", f"{W}x{H}", "-i", "-",
               "-vf", "vflip", "-frames:v", "1", out]
        proc = subprocess.run(cmd, input=render_frame(0, args.still))
        if proc.returncode:
            sys.exit(proc.returncode)
        print(f"wrote {out} ({W}x{H}, t={args.still}s)")
        return

    total = round(args.dur * args.fps)
    if total < 1:
        ap.error("duration too short for one frame")

    codec_args = list(codec["args"])
    if args.codec == "h264":
        codec_args += ["-crf", str(args.crf)]
    cmd = [args.ffmpeg, "-hide_banner", "-loglevel", "warning", "-y",
           "-f", "rawvideo", "-pix_fmt", pix_fmt, "-s", f"{W}x{H}",
           "-r", f"{args.fps:g}", "-i", "-",
           "-vf", "vflip", *codec_args, out]

    print(f"{args.shader} [{dialect}] -> {out}")
    print(f"  {W}x{H} @ {args.fps:g} fps, {args.dur:g}s ({total} frames), codec {args.codec}")

    encoder = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    t0 = time.monotonic()
    try:
        for i in range(total):
            data = render_frame(i, args.start + i / args.fps)
            encoder.stdin.write(data)
            if i % 30 == 29 or i == total - 1:
                elapsed = time.monotonic() - t0
                rate = (i + 1) / elapsed
                eta = (total - i - 1) / rate if rate else 0
                sys.stderr.write(f"\r  frame {i + 1}/{total}  {rate:5.1f} fps  ETA {eta:4.0f}s ")
                sys.stderr.flush()
        sys.stderr.write("\n")
    except BrokenPipeError:
        sys.stderr.write("\n")
        encoder.wait()
        sys.exit(f"error: ffmpeg exited early (code {encoder.returncode})")
    except KeyboardInterrupt:
        sys.stderr.write("\ninterrupted, finalizing partial file...\n")

    encoder.stdin.close()
    encoder.wait()
    if encoder.returncode:
        sys.exit(f"error: ffmpeg failed (code {encoder.returncode})")
    size_mb = os.path.getsize(out) / 1e6
    print(f"wrote {out} ({size_mb:.1f} MB)")


if __name__ == "__main__":
    main()
