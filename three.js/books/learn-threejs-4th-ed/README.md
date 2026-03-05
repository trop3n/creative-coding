# Learn Three.js - Fourth Edition

Comprehensive Three.js guide from Packt Publishing.

## Quick Start

```bash
# From root directory
npm run learn

# Or from this directory
npm run dev
```

**URL:** http://localhost:5174

## Chapters

### Part I: Getting Started
- **01 - Getting Started**: Setup and basic concepts
- **02 - Basic Components**: Scene, camera, renderer deep dive

### Part II: Core Concepts
Additional chapters to be added as you progress through the book:
- 03 - Working with Light Sources
- 04 - Working with Three.js Materials
- 05 - Learning to Geometries
- 06 - Advanced Geometries
- 07 - Points and Sprites
- 08 - Creating and Loading Meshes
- 09 - Animations and Moving the Camera
- 10 - Loading Textures and External Models
- 11 - Adding Physics to Your Scene
- 12 - Adding Sounds to Your Scene
- 13 - Post-processing
- 14 - Shaders
- 15 - Creating a Simple Game

## Switching Chapters

Edit `src/main.js` to import different chapters:

```javascript
// Chapter 01
import './chapters/01-getting-started/main.js';

// Switch to Chapter 02
// import './chapters/02-basic-components/main.js';
```

## Using Shared Utilities

```javascript
import { 
  createOrbitControls,
  createOutdoorLighting,
  loadGLTF,
  addGUI 
} from '@shared/utils/index.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Use shared utilities
const controls = createOrbitControls(camera, renderer);
const lights = createOutdoorLighting(scene);
const gui = addGUI();

// Add GUI controls
gui.add(camera.position, 'x', -10, 10);
gui.add(camera.position, 'y', -10, 10);
gui.add(camera.position, 'z', -10, 10);
```

## Book Focus

This book provides:
- ✅ Comprehensive coverage of Three.js features
- ✅ Deep dives into rendering concepts
- ✅ Advanced topics (physics, shaders, post-processing)
- ✅ Practical examples and exercises
- ✅ Game development basics

## Tips

- **Sequential learning**: This book is best read chapter by chapter
- **Reference guide**: Use as a reference for specific topics
- **Deep dives**: Each chapter covers topics in detail
- **Practical examples**: All concepts have working code

## Book Information

- **Title**: Learn Three.js - Fourth Edition
- **Publisher**: Packt Publishing
- **Authors**: 
  - Jos Dirksen
- **ISBN**: 9781803235007
- **Website**: https://www.packtpub.com/product/learn-three-js-fourth-edition/9781803235007
- **Focus**: Comprehensive Three.js guide
- **Level**: Intermediate to Advanced

## Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js >= 18.0.0
- Intermediate JavaScript knowledge
- Basic 3D graphics concepts helpful

## Adding New Chapters

To add a new chapter:

1. **Create directory:**
   ```bash
   mkdir src/chapters/03-light-sources
   ```

2. **Create main.js:**
   ```javascript
   import * as THREE from 'three';
   import { createOrbitControls, addStats } from '@shared/utils/index.js';
   
   // Your chapter code here
   console.log('📖 Chapter 03: Light Sources');
   ```

3. **Update src/main.js:**
   ```javascript
   import './chapters/03-light-sources/main.js';
   ```

## Troubleshooting

See [../../TROUBLESHOOTING.md](../../TROUBLESHOOTING.md) for common issues.

## Recommended Learning Path

1. **Start with**: Discover Three.js (if you're new to Three.js)
2. **Then**: Learn Three.js for comprehensive understanding
3. **Finally**: Interactive Web for advanced topics

## Additional Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [Three.js Examples](https://threejs.org/examples/)
- [Packt GitHub Repo](https://github.com/PacktPublishing/Learn-Three.js-Fourth-Edition)

---

**Happy learning! 📚**
