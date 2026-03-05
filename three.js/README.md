# Three.js Learning Environment

A professional, workspace-based development environment for learning Three.js from multiple books and courses.

## 📚 Included Books

- **Discover Three.js** - Interactive examples and tutorials
- **Learn Three.js - Fourth Edition** - Comprehensive Three.js guide
- **Interactive Web Development with Three.js and A-Frame** - Web development focus

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Install all dependencies** (from root directory):
   ```bash
   npm install
   ```

2. **Start a development server**:
   ```bash
   # Discover Three.js (port 5173)
   npm run discover
   
   # Learn Three.js (port 5174)
   npm run learn
   
   # Interactive Web (port 5175)
   npm run interactive
   ```

3. **Open in browser**: The dev server will automatically open your browser to the correct URL.

## 📁 Project Structure

```
three.js/
├── shared/                    # Shared utilities and assets
│   ├── utils/                # Reusable Three.js utilities
│   │   ├── lighting.js       # Preset lighting setups
│   │   ├── controls.js       # Camera controls wrappers
│   │   ├── loaders.js        # Model/texture loaders
│   │   └── helpers.js        # Stats, GUI, mesh helpers
│   ├── assets/               # Shared 3D assets
│   │   ├── models/
│   │   ├── textures/
│   │   ├── hdri/
│   │   └── fonts/
│   └── shaders/              # Custom GLSL shaders
│
├── books/                     # Individual book workspaces
│   ├── discover-three-js/
│   ├── learn-threejs-4th-ed/
│   └── interactive-web-threejs-aframe/
│
├── .vscode/                   # VS Code configuration
└── .zed/                      # Zed editor configuration
```

## 🛠️ Development Workflow

### Working with Chapters

Each book has its own folder structure organized by chapters:

```
books/discover-three-js/
├── src/
│   ├── chapters/
│   │   ├── 01-first-scene/
│   │   │   └── main.js      # Chapter code
│   │   ├── 02-basic-components/
│   │   └── ...
│   └── main.js              # Entry point
```

**To switch between chapters:**
1. Open the book's `src/main.js`
2. Import the chapter you want to run:
   ```javascript
   import './chapters/02-basic-components/main.js';
   ```

### Using Shared Utilities

Import shared utilities from any chapter:

```javascript
import { 
  createOrbitControls, 
  createStudioLighting,
  addStats,
  createCube 
} from '@shared/utils/index.js';

// Use in your scene
const controls = createOrbitControls(camera, renderer);
const lights = createStudioLighting(scene);
const stats = addStats();
const cube = createCube(1, 0x00ff88);
```

### Adding New Chapters

1. Create a new folder in the appropriate book:
   ```bash
   mkdir books/discover-three-js/src/chapters/11-new-chapter
   ```

2. Create a `main.js` file:
   ```javascript
   import * as THREE from 'three';
   import { createOrbitControls, addStats } from '@shared/utils/index.js';
   
   // Your chapter code here
   ```

3. Update `src/main.js` to import your new chapter

### Adding Shared Assets

**Models:**
```bash
cp ~/Downloads/model.glb shared/assets/models/
```

**Textures:**
```bash
cp ~/Downloads/texture.jpg shared/assets/textures/
```

**Use in code:**
```javascript
import { loadGLTF, loadTexture } from '@shared/utils/loaders.js';

const model = await loadGLTF('../../shared/assets/models/model.glb');
const texture = await loadTexture('../../shared/assets/textures/texture.jpg');
```

## 📦 Available Scripts

### Root Level
- `npm run discover` - Start Discover Three.js dev server (port 5173)
- `npm run learn` - Start Learn Three.js dev server (port 5174)
- `npm run interactive` - Start Interactive Web dev server (port 5175)
- `npm run build:discover` - Build Discover Three.js for production
- `npm run build:learn` - Build Learn Three.js for production
- `npm run build:interactive` - Build Interactive Web for production

### Per Book
Navigate to a book directory and run:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎯 Features

✅ **Workspace-based** - Isolated dependencies per book  
✅ **Shared utilities** - Write once, use everywhere  
✅ **Hot Module Replacement** - Instant preview as you code  
✅ **Type-safe imports** - Full IntelliSense support  
✅ **Pre-configured** - Vite, ESLint, Prettier ready  
✅ **Editor support** - VS Code + Zed configurations  
✅ **Asset management** - Organized shared assets folder  

## 🎨 Shared Utilities

### Lighting Setups
- `createStudioLighting(scene)` - Professional 3-point lighting
- `createOutdoorLighting(scene)` - Natural outdoor light
- `createDramaticLighting(scene)` - Colored spotlights
- `createPointLight(scene, options)` - Custom point lights

### Controls
- `createOrbitControls(camera, renderer, options)` - Orbit controls with defaults
- `createFlyControls(camera, renderer)` - Flight simulator controls
- `createFirstPersonControls(camera, renderer)` - FPS-style controls

### Loaders
- `loadGLTF(path)` - Load .gltf/.glb models
- `loadOBJ(path)` - Load .obj models
- `loadFBX(path)` - Load .fbx models
- `loadTexture(path, options)` - Load textures
- `loadHDR(path)` - Load HDR environment maps

### Helpers
- `addStats()` - FPS counter
- `addGUI()` - Debug GUI (lil-gui)
- `addAxesHelper(scene)` - XYZ axes visualization
- `addGridHelper(scene)` - Ground grid
- `createCube(size, color)` - Quick cube mesh
- `createSphere(radius, color)` - Quick sphere mesh
- `createPlane(width, height, color)` - Quick plane mesh

## 🔧 Editor Configuration

### VS Code
**Recommended Extensions** (auto-suggested):
- ESLint
- Prettier
- Three.js IntelliSense
- Color Info
- GitLens

**Features:**
- Format on save
- Auto imports
- Three.js autocomplete
- GLSL syntax highlighting
- Debug configurations for all three books

### Zed Editor
- JavaScript/TypeScript LSP configured
- Auto-save on focus change
- 2-space indentation
- Word wrap enabled

## 📖 Learning Path

### Recommended Order
1. **Discover Three.js** (Chapters 1-10) - Best for beginners
2. **Learn Three.js** (Chapters 1-15) - Deep dive into concepts
3. **Interactive Web** - Advanced topics and A-Frame

### Chapter Guide

**Discover Three.js:**
- Ch 00: Introduction
- Ch 01: First Scene ✨ *Working example included*
- Ch 02: Basic Components
- Ch 03: Camera Controls
- Ch 04: Geometry & Materials
- Ch 05: Textures
- Ch 06: Lighting
- Ch 07: Animations
- Ch 08: Loading Models
- Ch 09: Going Live
- Ch 10: Final Project

## 🐛 Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues and solutions.

## 📝 Adding a New Book

1. Create new workspace:
   ```bash
   mkdir -p books/new-book/src/{chapters,styles}
   ```

2. Create `package.json`:
   ```json
   {
     "name": "new-book",
     "version": "1.0.0",
     "private": true,
     "type": "module",
     "scripts": {
       "dev": "vite --port 5176",
       "build": "vite build",
       "preview": "vite preview --port 5176"
     },
     "dependencies": {
       "three": "^0.160.0",
       "stats.js": "^0.17.0",
       "lil-gui": "^0.19.1"
     },
     "devDependencies": {
       "vite": "^5.0.0"
     }
   }
   ```

3. Create `vite.config.js` (copy from existing book, change port)

4. Add to root `package.json` scripts:
   ```json
   "new-book": "npm run dev -w books/new-book"
   ```

5. Run `npm install`

## 🤝 Contributing

This is a personal learning environment, but feel free to:
- Add new shared utilities
- Improve documentation
- Add more example assets
- Share your chapter implementations

## 📄 License

MIT

## 🎓 Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [Three.js Examples](https://threejs.org/examples/)
- [Discover Three.js](https://discoverthreejs.com/)
- [Learn Three.js Book](https://www.packtpub.com/product/learn-three-js-fourth-edition/9781803235007)

---

**Happy coding! 🚀**

Start with `npm install`, then `npm run discover` to see the working example.
