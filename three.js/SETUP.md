# Setup Guide

Complete instructions for setting up your Three.js learning environment.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Editor Setup](#editor-setup)
- [Running Examples](#running-examples)
- [Understanding the Structure](#understanding-the-structure)
- [Next Steps](#next-steps)

## Prerequisites

### Required Software

1. **Node.js** (v18.0.0 or higher)
   ```bash
   # Check version
   node --version
   
   # Install via nvm (recommended)
   nvm install 18
   nvm use 18
   ```

2. **npm** (v9.0.0 or higher)
   ```bash
   # Check version
   npm --version
   
   # Update npm
   npm install -g npm@latest
   ```

3. **Git**
   ```bash
   # Check version
   git --version
   ```

### Recommended Software

- **VS Code** - Primary recommended editor
- **Zed Editor** - Alternative fast editor
- **Chrome/Firefox** - Modern browser with dev tools

## Installation

### Step 1: Clone/Download

If you have this code in a git repository:
```bash
git clone <your-repo-url>
cd three.js
```

Or if you're already in the directory:
```bash
cd /path/to/three.js
```

### Step 2: Install Dependencies

```bash
npm install
```

This will:
- Install all workspace dependencies
- Set up the shared package
- Install dependencies for all three books

**Expected output:**
```
added 450 packages in 15s

45 packages are looking for funding
  run `npm fund` for details
```

### Step 3: Verify Installation

```bash
# Check that workspaces are recognized
npm ls --depth=0

# Should show:
# threejs-learning@1.0.0
# ├── @threejs-learning/shared@1.0.0
# ├── discover-three-js@1.0.0
# ├── interactive-web-threejs-aframe@1.0.0
# └── learn-threejs-4th-ed@1.0.0
```

### Step 4: Test a Dev Server

```bash
npm run discover
```

Expected:
- Dev server starts on port 5173
- Browser opens automatically
- You see a rotating cube with orbit controls
- FPS counter in top-left corner

Press `Ctrl+C` to stop the server.

## Editor Setup

### VS Code

#### Automatic Setup

1. Open the project in VS Code:
   ```bash
   code /path/to/three.js
   ```

2. VS Code will prompt to install recommended extensions - click **Install All**

#### Manual Setup

If prompts don't appear, install these extensions:

**Required:**
- **ESLint** (`dbaeumer.vscode-eslint`) - JavaScript linting
- **Prettier** (`esbenp.prettier-vscode`) - Code formatting

**Recommended:**
- **Three.js IntelliSense** (`viz-js.vscode-threejs`) - Three.js autocomplete
- **Color Info** (`bierner.color-info`) - Color previews
- **GitLens** (`eamodio.gitlens`) - Git integration
- **Import Cost** (`wix.vscode-import-cost`) - Package size display

#### Verify VS Code Setup

1. Open any `.js` file in `books/discover-three-js/src/`
2. Type `THREE.` - you should see autocomplete suggestions
3. Type `import {` - you should see import suggestions
4. Save a file - it should auto-format

### Zed Editor

1. Open the project:
   ```bash
   zed /path/to/three.js
   ```

2. Settings are pre-configured in `.zed/settings.json`

3. Verify:
   - JavaScript files have syntax highlighting
   - Auto-save works when switching files
   - Tab size is 2 spaces

## Running Examples

### Starting Development Servers

**Option 1: From root (recommended)**
```bash
# Discover Three.js (port 5173)
npm run discover

# Learn Three.js (port 5174)
npm run learn

# Interactive Web (port 5175)
npm run interactive
```

**Option 2: From book directory**
```bash
cd books/discover-three-js
npm run dev
```

### Accessing the Application

Each book runs on a different port:

| Book | URL | Port |
|------|-----|------|
| Discover Three.js | http://localhost:5173 | 5173 |
| Learn Three.js | http://localhost:5174 | 5174 |
| Interactive Web | http://localhost:5175 | 5175 |

### Hot Module Replacement

The dev servers support HMR:
- Edit any JavaScript file
- Save the file
- Browser automatically reloads with changes
- No manual refresh needed

### Debugging in Browser

1. Start dev server
2. Open Chrome DevTools (`F12` or `Ctrl+Shift+I`)
3. Go to **Console** tab
4. You'll see helpful messages:
   ```
   🚀 Discover Three.js - Chapter 01: First Scene
   📚 Book: Discover Three.js
   🎮 Controls: Mouse drag to rotate, scroll to zoom
   ```

5. Set breakpoints in Chrome DevTools → Sources tab

### Debugging in VS Code

1. Start a dev server (e.g., `npm run discover`)
2. In VS Code, go to **Run and Debug** (`Ctrl+Shift+D`)
3. Select **"Launch Discover Three.js"**
4. Click the green play button
5. New Chrome window opens with debugger attached

## Understanding the Structure

### Workspace Architecture

```
three.js/
├── package.json          # Root workspace config
├── shared/               # Shared across all books
└── books/                # Individual book workspaces
    ├── discover-three-js/
    ├── learn-threejs-4th-ed/
    └── interactive-web-threejs-aframe/
```

### How Workspaces Work

1. **Root `package.json`** defines workspaces:
   ```json
   {
     "workspaces": [
       "shared",
       "books/*"
     ]
   }
   ```

2. **Single `node_modules`** at root:
   - All dependencies installed at root
   - Books reference shared dependencies
   - Reduces disk usage and install time

3. **Isolated `package.json`** per book:
   - Each book has its own dependencies
   - Can use different versions if needed
   - Independent build configurations

### Shared Package

The `shared/` package provides utilities used across all books:

```javascript
// Import from any book
import { createOrbitControls } from '@shared/utils/index.js';
```

**Benefits:**
- Write once, use everywhere
- Consistent behavior across books
- Easy to maintain and update

### Vite Configuration

Each book has a `vite.config.js`:

```javascript
export default defineConfig({
  resolve: {
    alias: {
      '@shared': resolve(__dirname, '../../shared')
    }
  },
  server: {
    port: 5173,  // Different port per book
    open: true   // Auto-open browser
  }
});
```

## Next Steps

### 1. Explore the Working Example

```bash
npm run discover
```

Navigate to `books/discover-three-js/src/chapters/01-first-scene/main.js` and:
- Modify the cube color
- Change rotation speed
- Add a second cube
- Watch changes appear instantly

### 2. Understand Shared Utilities

Read through the files in `shared/utils/`:
- `lighting.js` - See available lighting presets
- `controls.js` - Understand camera control options
- `loaders.js` - Learn how to load models and textures
- `helpers.js` - Discover available helper functions

### 3. Start a Book

**Discover Three.js:**
1. Start with Chapter 00: Introduction
2. Progress through chapters sequentially
3. Each chapter builds on the previous

**Learn Three.js:**
1. More comprehensive coverage
2. Good for reference and deep dives
3. Can jump between topics

**Interactive Web:**
1. Assumes basic Three.js knowledge
2. Focus on web integration
3. Includes A-Frame for VR/AR

### 4. Customize Your Setup

**Add your own assets:**
```bash
# Add a 3D model
cp ~/Downloads/my-model.glb shared/assets/models/

# Use it in code
import { loadGLTF } from '@shared/utils/loaders.js';
const model = await loadGLTF('../../shared/assets/models/my-model.glb');
```

**Create new utilities:**
```bash
# Add to shared/utils/
echo "export function myHelper() { ... }" >> shared/utils/helpers.js

# Update index.js
echo "export { myHelper } from './helpers.js';" >> shared/utils/index.js

# Use anywhere
import { myHelper } from '@shared/utils/index.js';
```

### 5. Practice Workflow

1. **Start dev server**: `npm run discover`
2. **Open chapter file**: `books/discover-three-js/src/chapters/01-first-scene/main.js`
3. **Make changes**: Modify code
4. **See results**: Browser auto-reloads
5. **Debug**: Use browser dev tools or VS Code debugger
6. **Commit**: Save your progress with git

## Common Tasks

### Switching Between Books

```bash
# Stop current server (Ctrl+C)
# Start different book
npm run learn
```

### Building for Production

```bash
npm run build:discover
```

Output goes to `books/discover-three-js/dist/`

### Adding Dependencies

**To a specific book:**
```bash
cd books/discover-three-js
npm install some-package
```

**To shared utilities:**
```bash
cd shared
npm install some-package
```

**To root (dev tools):**
```bash
npm install -D some-dev-tool
```

### Updating Three.js

Update all books at once:
```bash
npm install three@latest
```

## Getting Help

- **Troubleshooting**: See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Three.js Docs**: https://threejs.org/docs/
- **Community**: https://discourse.threejs.org/
- **Examples**: https://threejs.org/examples/

---

**Setup complete!** Run `npm run discover` to start learning.
