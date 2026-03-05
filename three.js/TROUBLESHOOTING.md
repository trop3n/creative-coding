# Troubleshooting Guide

Common issues and their solutions.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Development Server Issues](#development-server-issues)
- [Import/Module Issues](#importmodule-issues)
- [Three.js Specific Issues](#threejs-specific-issues)
- [Editor/IDE Issues](#editoride-issues)
- [Performance Issues](#performance-issues)
- [Browser Issues](#browser-issues)

## Installation Issues

### `npm install` fails

**Symptoms:**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions:**

1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Use legacy peer deps (if needed):**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Check Node version:**
   ```bash
   node --version  # Should be >= 18.0.0
   
   # If too old, upgrade:
   nvm install 18
   nvm use 18
   ```

### Dependencies not found

**Symptoms:**
```
Error: Cannot find module 'three'
```

**Solutions:**

1. **Verify workspaces are installed:**
   ```bash
   npm ls three
   ```

2. **Reinstall from root:**
   ```bash
   cd /path/to/three.js  # Go to root
   npm install
   ```

3. **Check package.json exists:**
   ```bash
   # Each book should have package.json
   ls books/*/package.json
   ```

### Permission errors

**Symptoms:**
```
npm ERR! Error: EACCES: permission denied
```

**Solutions:**

1. **Don't use sudo** (fix permissions instead):
   ```bash
   # Fix npm permissions
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
   source ~/.bashrc
   ```

2. **Fix directory ownership:**
   ```bash
   sudo chown -R $(whoami) ~/.npm
   sudo chown -R $(whoami) /path/to/three.js
   ```

## Development Server Issues

### Port already in use

**Symptoms:**
```
Error: Port 5173 is already in use
```

**Solutions:**

1. **Kill process on port:**
   ```bash
   # Linux/Mac
   lsof -ti:5173 | xargs kill -9
   
   # Or use fuser
   fuser -k 5173/tcp
   ```

2. **Use different port:**
   ```bash
   # Edit vite.config.js in the book
   server: {
     port: 5180  # Change to available port
   }
   ```

3. **Find what's using the port:**
   ```bash
   lsof -i :5173
   ```

### Dev server won't start

**Symptoms:**
- No output after `npm run discover`
- Process hangs

**Solutions:**

1. **Check for errors:**
   ```bash
   npm run discover 2>&1 | tee error.log
   ```

2. **Verify Vite is installed:**
   ```bash
   npm ls vite
   ```

3. **Try running directly:**
   ```bash
   cd books/discover-three-js
   npx vite --port 5173
   ```

### Browser doesn't open automatically

**Solutions:**

1. **Manual open:**
   - Server shows URL in terminal (e.g., `http://localhost:5173`)
   - Copy/paste into browser

2. **Fix auto-open:**
   ```javascript
   // vite.config.js
   server: {
     open: true,  // Ensure this is set
     port: 5173
   }
   ```

3. **Check default browser:**
   - Ensure a default browser is set in OS settings

### Hot reload not working

**Symptoms:**
- Changes don't appear after saving
- Need to manually refresh

**Solutions:**

1. **Check file is being watched:**
   - Vite shows `[vite] hmr update` in terminal on save
   - If not, restart dev server

2. **Browser caching:**
   - Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Disable cache in DevTools → Network tab

3. **File outside root:**
   - Files must be within the book directory
   - Shared files need correct import paths

## Import/Module Issues

### Cannot find module '@shared'

**Symptoms:**
```
Error: Failed to resolve import "@shared/utils/index.js"
```

**Solutions:**

1. **Check Vite config:**
   ```javascript
   // books/*/vite.config.js
   resolve: {
     alias: {
       '@shared': resolve(__dirname, '../../shared')
     }
   }
   ```

2. **Restart dev server** after changing config

3. **Use relative imports instead:**
   ```javascript
   import { createOrbitControls } from '../../shared/utils/index.js';
   ```

### Unexpected token 'export'

**Symptoms:**
```
SyntaxError: Unexpected token 'export'
```

**Solutions:**

1. **Check package.json type:**
   ```json
   {
     "type": "module"  // Must be set
   }
   ```

2. **Use .js extension in imports:**
   ```javascript
   // Good
   import { foo } from './bar.js';
   
   // Bad
   import { foo } from './bar';
   ```

3. **Check script tag:**
   ```html
   <script type="module" src="/src/main.js"></script>
   ```

### Three.js examples import errors

**Symptoms:**
```
Error: Failed to resolve "three/examples/jsm/controls/OrbitControls"
```

**Solutions:**

1. **Use correct import path:**
   ```javascript
   // Correct
   import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
   
   // Wrong (missing .js)
   import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
   ```

2. **Or use shared utils:**
   ```javascript
   import { createOrbitControls } from '@shared/utils/index.js';
   ```

### Import path case sensitivity

**Symptoms:**
- Works on Mac/Windows
- Fails on Linux

**Solutions:**

1. **Match exact case:**
   ```javascript
   // If file is OrbitControls.js
   import { OrbitControls } from './OrbitControls.js';  // Correct
   import { OrbitControls } from './orbitcontrols.js';  // Wrong on Linux
   ```

2. **Use consistent naming:**
   - Always use lowercase for filenames
   - Or match file system case exactly

## Three.js Specific Issues

### Black screen / Nothing renders

**Causes & Solutions:**

1. **Missing light:**
   ```javascript
   // Add light to scene
   const light = new THREE.DirectionalLight(0xffffff, 1);
   light.position.set(5, 5, 5);
   scene.add(light);
   
   // Or use helper
   import { createStudioLighting } from '@shared/utils/index.js';
   createStudioLighting(scene);
   ```

2. **Camera pointing wrong direction:**
   ```javascript
   camera.position.set(0, 0, 5);  // Move back
   camera.lookAt(0, 0, 0);        // Look at origin
   ```

3. **Object too small/large:**
   ```javascript
   // Check object scale
   console.log(mesh.scale);
   
   // Adjust camera distance
   camera.position.z = 10;  // Move further back
   ```

4. **Material issue:**
   ```javascript
   // Use MeshStandardMaterial or MeshBasicMaterial
   const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
   
   // BasicMaterial doesn't need lights
   const basicMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
   ```

### Canvas not filling screen

**Solutions:**

1. **CSS reset:**
   ```css
   body {
     margin: 0;
     overflow: hidden;
   }
   canvas {
     display: block;
   }
   ```

2. **Update renderer on resize:**
   ```javascript
   window.addEventListener('resize', () => {
     camera.aspect = window.innerWidth / window.innerHeight;
     camera.updateProjectionMatrix();
     renderer.setSize(window.innerWidth, window.innerHeight);
   });
   ```

### OrbitControls not working

**Symptoms:**
- Mouse drag doesn't rotate camera
- No response to scroll

**Solutions:**

1. **Update controls in animation loop:**
   ```javascript
   function animate() {
     controls.update();  // Required!
     renderer.render(scene, camera);
     requestAnimationFrame(animate);
   }
   ```

2. **Check damping:**
   ```javascript
   controls.enableDamping = true;
   controls.dampingFactor = 0.05;
   ```

3. **Use shared helper:**
   ```javascript
   import { createOrbitControls } from '@shared/utils/index.js';
   const controls = createOrbitControls(camera, renderer);
   ```

### Models not loading

**Symptoms:**
```
Error: Unexpected token < in JSON
```

**Solutions:**

1. **Check file path:**
   ```javascript
   // Use relative path from HTML file, not JS file
   const model = await loadGLTF('./assets/model.glb');
   ```

2. **File in public directory:**
   ```bash
   # Put assets in public/ for easy access
   books/discover-three-js/public/models/model.glb
   
   # Access with
   const model = await loadGLTF('/models/model.glb');
   ```

3. **CORS issues:**
   - Use Vite dev server (handles CORS)
   - Or use a local server: `npx serve`

### Textures not appearing

**Solutions:**

1. **Check texture path:**
   ```javascript
   const texture = await loadTexture('../../shared/assets/textures/wood.jpg');
   ```

2. **Apply to material:**
   ```javascript
   const material = new THREE.MeshStandardMaterial({
     map: texture
   });
   ```

3. **Enable shadows for texture:**
   ```javascript
   mesh.receiveShadow = true;
   mesh.castShadow = true;
   ```

## Editor/IDE Issues

### VS Code: No IntelliSense for Three.js

**Solutions:**

1. **Install Three.js extension:**
   - Open Extensions (`Ctrl+Shift+X`)
   - Search "Three.js IntelliSense"
   - Install

2. **Check TypeScript:**
   ```bash
   npm install -D typescript @types/three
   ```

3. **Create jsconfig.json:**
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@shared/*": ["shared/*"]
       }
     }
   }
   ```

### VS Code: Import suggestions not working

**Solutions:**

1. **Enable auto imports:**
   ```json
   // .vscode/settings.json
   {
     "javascript.suggest.autoImports": true,
     "typescript.suggest.autoImports": true
   }
   ```

2. **Restart TypeScript server:**
   - Command Palette (`Ctrl+Shift+P`)
   - "TypeScript: Restart TS Server"

### Prettier not formatting

**Solutions:**

1. **Install Prettier:**
   ```bash
   npm install -D prettier
   ```

2. **Enable in settings:**
   ```json
   {
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "editor.formatOnSave": true
   }
   ```

3. **Create .prettierrc:**
   ```json
   {
     "semi": true,
     "singleQuote": true,
     "tabWidth": 2
   }
   ```

### Zed: JavaScript errors

**Solutions:**

1. **Check LSP settings:**
   ```json
   // .zed/settings.json
   {
     "languages": {
       "JavaScript": {
         "language_servers": ["typescript-language-server"]
       }
     }
   }
   ```

2. **Install TypeScript:**
   ```bash
   npm install -D typescript
   ```

## Performance Issues

### Low FPS / Laggy animations

**Solutions:**

1. **Check polygon count:**
   ```javascript
   console.log(renderer.info.memory);
   console.log(renderer.info.render);
   ```

2. **Reduce geometry complexity:**
   ```javascript
   // Lower segment count
   new THREE.SphereGeometry(1, 16, 16);  // Instead of 32, 32
   ```

3. **Use BufferGeometry:**
   ```javascript
   // Modern Three.js uses BufferGeometry by default
   // Avoid legacy Geometry class
   ```

4. **Optimize shadows:**
   ```javascript
   renderer.shadowMap.enabled = true;
   renderer.shadowMap.type = THREE.PCFSoftShadowMap;
   
   light.shadow.mapSize.width = 1024;  // Reduce if needed
   light.shadow.mapSize.height = 1024;
   ```

5. **Use Stats.js:**
   ```javascript
   import { addStats } from '@shared/utils/index.js';
   const stats = addStats();
   // Shows FPS counter
   ```

### High memory usage

**Solutions:**

1. **Dispose of resources:**
   ```javascript
   geometry.dispose();
   material.dispose();
   texture.dispose();
   ```

2. **Use shared helper:**
   ```javascript
   import { disposeObject, disposeScene } from '@shared/utils/index.js';
   disposeObject(mesh);
   ```

3. **Clear scene:**
   ```javascript
   while(scene.children.length > 0){ 
     scene.remove(scene.children[0]); 
   }
   ```

## Browser Issues

### WebGL not supported

**Solutions:**

1. **Check WebGL support:**
   ```javascript
   if (!window.WebGLRenderingContext) {
     console.error('WebGL not supported');
   }
   ```

2. **Update browser:**
   - Use latest Chrome, Firefox, Safari, or Edge

3. **Enable hardware acceleration:**
   - Chrome: Settings → Advanced → System → "Use hardware acceleration when available"

### Console errors about CORS

**Solutions:**

1. **Use Vite dev server** (handles CORS automatically)

2. **Or use local server:**
   ```bash
   npx serve
   # or
   python -m http.server 8000
   ```

3. **Don't open HTML directly:**
   - ❌ `file:///path/to/index.html`
   - ✅ `http://localhost:5173`

### Shaders not compiling

**Symptoms:**
```
THREE.WebGLProgram: shader error
```

**Solutions:**

1. **Check shader syntax:**
   ```javascript
   console.log(renderer.capabilities);
   ```

2. **Use correct attribute names:**
   ```glsl
   // Three.js built-in attributes
   attribute vec3 position;
   attribute vec3 normal;
   attribute vec2 uv;
   ```

3. **Check GLSL version:**
   ```glsl
   // Use Three.js default (WebGL 1.0)
   // Don't add #version directive unless needed
   ```

## Still Having Issues?

### Debug Steps

1. **Clear everything:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check versions:**
   ```bash
   node --version   # Should be >= 18
   npm --version    # Should be >= 9
   npm ls three     # Check Three.js version
   ```

3. **Try minimal example:**
   ```javascript
   // Test basic Three.js
   import * as THREE from 'three';
   const scene = new THREE.Scene();
   const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
   const renderer = new THREE.WebGLRenderer();
   console.log('Three.js working:', renderer.domElement);
   ```

4. **Check console:**
   - Open browser DevTools
   - Look for red errors
   - Google the exact error message

### Getting Help

1. **Three.js Forum:** https://discourse.threejs.org/
2. **Stack Overflow:** Tag questions with `three.js`
3. **Three.js Discord:** Community chat
4. **GitHub Issues:** For bug reports

### Reporting Bugs

When reporting issues, include:

1. **Environment:**
   ```bash
   node --version
   npm --version
   # Browser and version
   # OS and version
   ```

2. **Error messages:**
   - Full console output
   - Screenshots if helpful

3. **Steps to reproduce:**
   - Exact commands run
   - Files modified

4. **Minimal reproduction:**
   - Smallest code example that shows the issue

---

**Still stuck?** Try the [SETUP.md](./SETUP.md) guide from the beginning.
