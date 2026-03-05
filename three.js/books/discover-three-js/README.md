# Discover Three.js

Interactive examples and tutorials from "Discover Three.js" book.

## Quick Start

```bash
# From root directory
npm run discover

# Or from this directory
npm run dev
```

**URL:** http://localhost:5173

## Chapters

- **00 - Introduction**: Overview and setup
- **01 - First Scene** ✨: Basic scene with rotating cube (working example)
- **02 - Basic Components**: Scene, camera, renderer basics
- **03 - Camera Controls**: OrbitControls and camera manipulation
- **04 - Geometry & Materials**: Different geometries and material types
- **05 - Textures**: Applying textures to objects
- **06 - Lighting**: Various lighting setups
- **07 - Animations**: Basic animation techniques
- **08 - Loading Models**: Loading external 3D models
- **09 - Going Live**: Preparing for production
- **10 - Final Project**: Complete application

## Working Example

Chapter 01 includes a complete working example demonstrating:
- ✅ Scene setup with camera and renderer
- ✅ OrbitControls for camera interaction
- ✅ Professional lighting setup
- ✅ Rotating cube with animation
- ✅ Ground plane with shadows
- ✅ FPS counter (Stats.js)
- ✅ Hot module replacement
- ✅ Responsive window resizing

**To run:**
```bash
npm run discover
```

## Switching Chapters

Edit `src/main.js` to import different chapters:

```javascript
// Chapter 01
import './chapters/01-first-scene/main.js';

// Switch to Chapter 02
// import './chapters/02-basic-components/main.js';
```

## Using Shared Utilities

```javascript
import { 
  createOrbitControls,
  createStudioLighting,
  createCube,
  addStats 
} from '@shared/utils/index.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Use shared utilities
const controls = createOrbitControls(camera, renderer);
const lights = createStudioLighting(scene);
const cube = createCube(1, 0x00ff88);
const stats = addStats();

scene.add(cube);
```

## Tips

- **Hide info panel**: Press `H` to toggle the info panel
- **Camera controls**: Mouse drag to rotate, scroll to zoom
- **Hot reload**: Edit any file and save - browser reloads automatically
- **Console logs**: Open browser DevTools to see helpful messages

## Book Information

- **Title**: Discover Three.js
- **Website**: https://discoverthreejs.com/
- **Focus**: Beginner-friendly, hands-on tutorials
- **Style**: Interactive, learn by doing

## Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js >= 18.0.0
- Basic JavaScript knowledge

## Troubleshooting

See [../../TROUBLESHOOTING.md](../../TROUBLESHOOTING.md) for common issues.

## Next Steps

1. Complete Chapter 01 examples
2. Progress through chapters sequentially
3. Experiment with shared utilities
4. Build your own scenes using learned concepts

---

**Happy learning! 🎨**
