# Interactive Web Development with Three.js and A-Frame

Web development focus with Three.js and A-Frame integration.

## Quick Start

```bash
# From root directory
npm run interactive

# Or from this directory
npm run dev
```

**URL:** http://localhost:5175

## Chapters

- **01 - Three.js Basics**: Introduction to Three.js concepts
- **02 - Scene Setup**: Configuring scenes for web applications
- **03 - Animations**: Animation techniques for web
- **04 - Interactions**: User interaction and events
- **05 - Advanced Techniques**: Advanced Three.js topics

**Note:** This book also covers A-Frame for VR/AR applications. A-Frame examples can be added as needed.

## Switching Chapters

Edit `src/main.js` to import different chapters:

```javascript
// Chapter 01
import './chapters/01-threejs-basics/main.js';

// Switch to Chapter 02
// import './chapters/02-scene-setup/main.js';
```

## Using Shared Utilities

```javascript
import { 
  createOrbitControls,
  createDramaticLighting,
  addStats,
  addGUI 
} from '@shared/utils/index.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Use shared utilities
const controls = createOrbitControls(camera, renderer, {
  autoRotate: true,
  autoRotateSpeed: 2.0
});
const lights = createDramaticLighting(scene);
const stats = addStats();
```

## Book Focus

This book emphasizes:
- ✅ Web development with Three.js
- ✅ Interactive applications
- ✅ User experience considerations
- ✅ Performance optimization for web
- ✅ A-Frame for VR/AR experiences
- ✅ Integration with web technologies

## Tips

- **Web focus**: Examples optimized for web deployment
- **Interactivity**: Heavy focus on user interactions
- **Performance**: Learn optimization techniques
- **Real-world**: Practical web application examples

## A-Frame Integration

This workspace includes A-Frame dependency. To use A-Frame:

```javascript
// Note: A-Frame uses HTML-based syntax
// Create separate HTML files for A-Frame examples
```

Or create A-Frame-specific folders:
```
src/aframe/
  01-vr-scene/
  02-360-photos/
  03-interactions/
```

## Book Information

- **Title**: Interactive Web Development with Three.js and A-Frame
- **Focus**: Web applications, interactivity, VR/AR
- **Level**: Intermediate
- **Technologies**: Three.js, A-Frame, Web APIs

## Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js >= 18.0.0
- Intermediate JavaScript knowledge
- Basic HTML/CSS understanding
- Web development fundamentals

## Adding New Chapters

To add a new chapter:

1. **Create directory:**
   ```bash
   mkdir src/chapters/06-webgl-shaders
   ```

2. **Create main.js:**
   ```javascript
   import * as THREE from 'three';
   import { createOrbitControls, addStats } from '@shared/utils/index.js';
   
   // Your chapter code here
   console.log('📖 Chapter 06: WebGL Shaders');
   ```

3. **Update src/main.js:**
   ```javascript
   import './chapters/06-webgl-shaders/main.js';
   ```

## Troubleshooting

See [../../TROUBLESHOOTING.md](../../TROUBLESHOOTING.md) for common issues.

## Recommended Learning Path

1. **Prerequisites**: Complete Discover Three.js or have basic Three.js knowledge
2. **Then**: This book for web development focus
3. **Finally**: Advanced topics in Learn Three.js

## Additional Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [A-Frame Documentation](https://aframe.io/docs/)
- [WebGL Fundamentals](https://webglfundamentals.org/)

---

**Happy learning! 🌐**
