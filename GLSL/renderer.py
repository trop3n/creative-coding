#!/usr/bin/env python3
"""
GLSL Fragment Shader to Video Renderer

Renders .frag shader files to video files (MP4/MOV) at specified resolution.
Uses ModernGL for GPU-accelerated rendering and FFmpeg for video encoding.

Usage:
    python renderer.py shader.frag                    # Render to shader.mp4
    python renderer.py shader.frag -o output.mov     # Render to specific file
    python renderer.py shader.frag -d 10 -fps 60     # 10 seconds at 60fps
    python renderer.py shader.frag -w 3840 -h 2160   # 4K resolution
"""

import argparse
import subprocess
import sys
import os
from pathlib import Path

try:
    import moderngl
except ImportError:
    print("Error: moderngl not installed. Run: pip install moderngl")
    sys.exit(1)

try:
    import numpy as np
except ImportError:
    print("Error: numpy not installed. Run: pip install numpy")
    sys.exit(1)


VERTEX_SHADER = """
#version 330
in vec2 in_position;
void main() {
    gl_Position = vec4(in_position, 0.0, 1.0);
}
"""

FRAGMENT_SHADER_TEMPLATE = """
#version 330
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

out vec4 fragColor;

// User shader code will be inserted here
{shader_code}

void main() {{
    mainImage(fragColor, gl_FragCoord.xy);
}}
"""


def convert_shader(shader_source: str) -> str:
    """
    Convert a GLSL ES shader to GLSL 330 format.
    Handles both old-style (gl_FragColor) and ES 3.0 style (out vec4 fragColor).
    Returns cleaned shader code (without version/precision/uniforms we provide).
    """
    lines = shader_source.split('\n')
    output_lines = []

    in_gl_es_block = False
    for line in lines:
        stripped = line.strip()

        # Skip version directives - we'll use our own
        if stripped.startswith('#version'):
            continue

        # Track and skip GL_ES ifdef blocks
        if stripped.startswith('#ifdef GL_ES'):
            in_gl_es_block = True
            continue
        if in_gl_es_block and stripped.startswith('#endif'):
            in_gl_es_block = False
            continue
        if in_gl_es_block:
            continue

        if stripped.startswith('precision '):
            continue

        # Skip uniform declarations we'll provide ourselves
        if 'uniform float u_time' in stripped or 'uniform vec2 u_resolution' in stripped or 'uniform vec2 u_mouse' in stripped:
            continue

        output_lines.append(line)

    result = '\n'.join(output_lines)

    # For old-style shaders, replace gl_FragColor
    result = result.replace('gl_FragColor', 'fragColor')

    return result


def create_standalone_shader(shader_source: str) -> str:
    """
    Create a standalone GLSL 330 fragment shader from the user's shader code.
    """
    converted = convert_shader(shader_source)

    # Check if shader already has 'out vec4' declaration
    has_out_declaration = 'out vec4' in converted

    if has_out_declaration:
        # ES 3.0 style - just add version and uniforms
        shader = f"""#version 330

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

{converted}
"""
    else:
        # Old style - need to add out declaration
        shader = f"""#version 330

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

out vec4 fragColor;

{converted}
"""
    return shader


def check_ffmpeg() -> bool:
    """Check if FFmpeg is available."""
    try:
        subprocess.run(['ffmpeg', '-version'], capture_output=True, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False


def render_shader_to_video(
    shader_path: str,
    output_path: str,
    width: int = 1920,
    height: int = 1080,
    duration: float = 10.0,
    fps: int = 30,
    start_time: float = 0.0
) -> None:
    """
    Render a fragment shader to a video file.

    Args:
        shader_path: Path to the .frag shader file
        output_path: Output video file path (.mp4 or .mov)
        width: Video width in pixels
        height: Video height in pixels
        duration: Duration in seconds
        fps: Frames per second
        start_time: Starting time for u_time uniform
    """
    import tempfile
    import shutil

    # Read shader source
    shader_file = Path(shader_path)
    if not shader_file.exists():
        raise FileNotFoundError(f"Shader file not found: {shader_path}")

    with open(shader_file, 'r', encoding='utf-8') as f:
        shader_source = f.read()

    # Create OpenGL context (standalone/headless)
    ctx = moderngl.create_standalone_context()

    # Create the fragment shader
    try:
        fragment_shader = create_standalone_shader(shader_source)
        prog = ctx.program(
            vertex_shader=VERTEX_SHADER,
            fragment_shader=fragment_shader
        )
    except moderngl.Error as e:
        print(f"Shader compilation error:\n{e}")
        print("\n--- Generated shader ---")
        print(fragment_shader)
        sys.exit(1)

    # Create fullscreen quad
    vertices = np.array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
         1.0,  1.0,
    ], dtype='f4')

    vbo = ctx.buffer(vertices)
    vao = ctx.simple_vertex_array(prog, vbo, 'in_position')

    # Create framebuffer for offscreen rendering
    fbo = ctx.framebuffer(
        color_attachments=[ctx.texture((width, height), 4)]
    )

    # Get uniform locations
    u_time = prog.get('u_time', None)
    u_resolution = prog.get('u_resolution', None)
    u_mouse = prog.get('u_mouse', None)

    if u_resolution:
        u_resolution.value = (float(width), float(height))
    if u_mouse:
        u_mouse.value = (0.0, 0.0)

    total_frames = int(duration * fps)

    # Create temp directory for frames
    temp_dir = tempfile.mkdtemp(prefix='glsl_render_')
    print(f"Rendering {shader_file.name} to {output_path}")
    print(f"Resolution: {width}x{height}, Duration: {duration}s, FPS: {fps}")
    print(f"Total frames: {total_frames}")
    print(f"Temp directory: {temp_dir}")
    sys.stdout.flush()

    try:
        # Render frames
        for frame in range(total_frames):
            t = start_time + frame / fps

            # Update time uniform
            if u_time:
                u_time.value = t

            # Render
            fbo.use()
            ctx.clear(0.0, 0.0, 0.0, 1.0)
            vao.render(moderngl.TRIANGLE_STRIP)

            # Read pixels and flip vertically (OpenGL origin is bottom-left)
            data = fbo.color_attachments[0].read()
            pixels = np.frombuffer(data, dtype=np.uint8).reshape(height, width, 4)
            pixels = np.flipud(pixels)

            # Save as raw file
            frame_path = os.path.join(temp_dir, f'frame_{frame:06d}.raw')
            pixels.tofile(frame_path)

            # Progress
            if (frame + 1) % fps == 0 or frame == total_frames - 1:
                progress = (frame + 1) / total_frames * 100
                print(f"Rendering: {frame + 1}/{total_frames} frames ({progress:.1f}%)")
                sys.stdout.flush()

        print("Encoding video with FFmpeg...")
        sys.stdout.flush()

        # Determine output format
        output_ext = Path(output_path).suffix.lower()
        if output_ext == '.mov':
            codec = 'prores_ks'
            pix_fmt = 'yuv422p10le'
            extra_args = ['-profile:v', '3']  # ProRes HQ
        else:
            codec = 'libx264'
            pix_fmt = 'yuv420p'
            extra_args = ['-crf', '18', '-preset', 'medium']

        # Read all frames and pipe to FFmpeg
        ffmpeg_cmd = [
            'ffmpeg',
            '-y',
            '-f', 'rawvideo',
            '-pixel_format', 'rgba',
            '-video_size', f'{width}x{height}',
            '-framerate', str(fps),
            '-i', 'pipe:0',
            '-c:v', codec,
            '-pix_fmt', pix_fmt,
            *extra_args,
            output_path
        ]

        proc = subprocess.Popen(
            ffmpeg_cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )

        # Feed frames to FFmpeg
        for i in range(total_frames):
            frame_path = os.path.join(temp_dir, f'frame_{i:06d}.raw')
            with open(frame_path, 'rb') as f:
                proc.stdin.write(f.read())

        proc.stdin.close()
        _, stderr = proc.communicate()

        if proc.returncode != 0:
            print(f"FFmpeg error:\n{stderr.decode()}")
            sys.exit(1)

        print(f"Done! Output saved to: {output_path}")

    finally:
        # Cleanup
        fbo.release()
        vao.release()
        vbo.release()
        prog.release()
        ctx.release()
        shutil.rmtree(temp_dir, ignore_errors=True)


def main():
    parser = argparse.ArgumentParser(
        description='Render GLSL fragment shaders to video files',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python renderer.py shader.frag                     # Render to shader.mp4
  python renderer.py shader.frag -o output.mov       # Render to MOV
  python renderer.py shader.frag -d 10 --fps 60      # 10 seconds at 60fps
  python renderer.py shader.frag -w 3840 -h 2160     # 4K resolution
  python renderer.py shader.frag --start 5           # Start at t=5 seconds
        """
    )

    parser.add_argument('shader', help='Path to the .frag shader file')
    parser.add_argument('-o', '--output', help='Output video file path (default: shader_name.mp4)')
    parser.add_argument('-w', '--width', type=int, default=1920, help='Video width (default: 1920)')
    parser.add_argument('-ht', '--height', type=int, default=1080, help='Video height (default: 1080)')
    parser.add_argument('-d', '--duration', type=float, default=10.0, help='Duration in seconds (default: 10)')
    parser.add_argument('--fps', type=int, default=30, help='Frames per second (default: 30)')
    parser.add_argument('--start', type=float, default=0.0, help='Start time for u_time (default: 0)')

    args = parser.parse_args()

    # Check FFmpeg
    if not check_ffmpeg():
        print("Error: FFmpeg not found. Please install FFmpeg and add it to your PATH.")
        print("Download from: https://ffmpeg.org/download.html")
        sys.exit(1)

    # Determine output path
    if args.output:
        output_path = args.output
    else:
        shader_name = Path(args.shader).stem
        output_path = f"{shader_name}.mp4"

    render_shader_to_video(
        shader_path=args.shader,
        output_path=output_path,
        width=args.width,
        height=args.height,
        duration=args.duration,
        fps=args.fps,
        start_time=args.start
    )


if __name__ == '__main__':
    main()
