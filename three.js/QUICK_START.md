# Quick Reference Guide

Fast lookup for common tasks and commands.

## 🚀 Start Development

```bash
# Install dependencies (first time only)
npm install

# Start development servers
npm run discover      # Discover Three.js (port 5173)
npm run learn         # Learn Three.js (port 5174)
npm run interactive   # Interactive Web (port 5175)
```

## 📁 Project Structure

```
three.js/
├── shared/              # Shared utilities and assets
│   ├── utils/          # Reusable functions
│   ├── assets/         # Models, textures, HDRIs
│   └── shaders/        # Custom GLSL
├── books/              # Book workspaces
│   ├── discover-three-js/
│   ├── learn-threejs-4th-ed/
│   └── interactive-web-threejs-aframe/
└── README.md           # Main documentation
```

## 🎯 Switch Between Chapters

Edit `books/discover-three-js/src/main.js`:

```javascript
// Comment out current chapter
// import './chapters/01-first-scene/main.js';

// Uncomment desired chapter
import './chapters/02-basic-components/main.js';
```

## 🛠️ Common Imports

```javascript
// Basic Three.js
import * as THREE from 'three';

// Shared utilities
import { 
  createOrbitControls, 
  createStudioLighting,
  addStats,
  createCube 
} from '@shared/utils/index.js';
```

## 📦 Available Utilities

### Lighting
- `createStudioLighting(scene)` - Professional 3-point lighting
- `createOutdoorLighting(scene)` - Natural outdoor light
- `createDramaticLighting(scene)` - Colored spotlights
- `createPointLight(scene, color, intensity, position)` - Point lights

### Controls
- `createOrbitControls(camera, renderer, options)` - Orbit controls
- `createFlyControls(camera, renderer)` - Flight controls
- `createFirstPersonControls(camera, renderer)` - FPS controls

### Loaders
- `loadGLTF(path)` - Load .gltf/.glb models
- `loadOBJ(path)` - Load .obj models
- `loadFBX(path)` - Load .fbx models
- `loadTexture(path, options)` - Load textures
- `loadHDR(path)` - Load HDR environment maps

### Helpers
- `addStats()` - FPS counter
- `addGUI()` - Debug GUI (lil-gui)
- `addAxesHelper(scene, size)` - XYZ axes
- `addGridHelper(scene, size, divisions)` - Ground grid
- `createCube(size, color)` - Quick cube
- `createSphere(radius, color)` - Quick sphere
- `createPlane(width, height, color)` - Quick plane

## 🎨 Basic Scene Template

```javascript
import * as THREE from 'three';
import { createOrbitControls, createStudioLighting, addStats } from '@shared/utils/index.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(3, 3, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Utilities
const controls = createOrbitControls(camera, renderer);
const lights = createStudioLighting(scene);
const stats = addStats();

// Animation loop
function animate() {
  stats.begin();
  controls.update();
  renderer.render(scene, camera);
  stats.end();
  requestAnimationFrame(animate);
}

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
```

## 🔍 Debug Tips

```javascript
// Log Three.js renderer info
console.log(renderer.info);

// Check object properties
console.log(mesh.position, mesh.rotation, mesh.scale);

// Add GUI for tweaking
import { addGUI } from '@shared/utils/index.js';
const gui = addGUI();
gui.add(mesh.position, 'x', -10, 10);
gui.addColor(material, 'color');

// Show axes and grid
import { addAxesHelper, addGridHelper } from '@shared/utils/index.js';
addAxesHelper(scene);
addGridHelper(scene);
```

## 📊 Performance Check

```javascript
// Check performance
console.log('Memory:', renderer.info.memory);
console.log('Render:', renderer.info.render);

// Use Stats.js
import { addStats } from '@shared/utils/index.js';
const stats = addStats();
// FPS counter appears in top-left
```

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Black screen | Add lights to scene |
| Controls not working | Call `controls.update()` in animation loop |
| Import errors | Add `.js` extension to imports |
| Port in use | Vite auto-finds next available port |
| Model not loading | Check path from HTML file, not JS file |

## 📚 Learning Path

1. **Discover Three.js** - Start here (Chapters 1-10)
2. **Learn Three.js** - Deep dive (Chapters 1-15)
3. **Interactive Web** - Advanced topics

## 🎮 Keyboard Shortcuts

- **H** - Toggle info panel
- **Ctrl+C** - Stop dev server
- **F12** - Open browser DevTools

## 📖 Resources

- **Three.js Docs**: https://threejs.org/docs/
- **Three.js Examples**: https://threejs.org/examples/
- **Discourse**: https://discourse.threejs.org/

## 🆘 Get Help

1. Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Read [SETUP.md](./SETUP.md)
3. Search Three.js Discourse
4. Check browser console for errors

---

**Quick start**: `npm install && npm run discover`
