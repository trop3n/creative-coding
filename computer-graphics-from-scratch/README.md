# Computer Graphics from Scratch - C Implementation

Following along with "Computer Graphics from Scratch" by Gabriel Gambetta (No Starch Press) using C.

## Setup

### Prerequisites
- GCC or Clang compiler
- Make build tool
- Image viewer that supports PPM format

On Ubuntu/Debian:
```bash
sudo apt install gcc make
```

Optional - for converting PPM to PNG:
```bash
sudo apt install imagemagick
```

### Building

Build and run Chapter 2 (Basic Raytracing):
```bash
make ch02
```

Build all chapters:
```bash
make all
```

Clean generated files:
```bash
make clean
```

## Viewing Results

### Option 1: Direct PPM Viewing
Most image viewers support PPM:
- **Linux**: `feh output.ppm`, `eog output.ppm`, or GIMP
- **macOS**: Preview.app
- **Windows**: IrfanView, XnView

### Option 2: Convert to PNG
```bash
convert output.ppm output.png
```

## Project Structure

```
.
├── common/               # Shared utilities
│   ├── vec3.h           # Vector math operations
│   ├── color.h          # Color operations
│   ├── ppm.h            # PPM file writer
│   ├── ray.h            # Ray structure
│   └── utils.h          # Helper functions
├── 02-basic-raytracing/ # Chapter 2
│   └── main.c
├── 03-light/            # Chapter 3
├── ...                  # More chapters
└── Makefile
```

## Chapter Progress

- [x] Chapter 1: Introductory Concepts
- [x] Chapter 2: Basic Raytracing (Gradient example)
- [ ] Chapter 3: Light
- [ ] Chapter 4: Shadows and Reflections
- [ ] Chapter 5: Extending the Raytracer
- [ ] Chapters 6-15: Rasterization

## Notes

- All code uses header-only libraries for simplicity
- PPM P3 format (ASCII) for easy debugging
- Minimal dependencies - just standard C math library
