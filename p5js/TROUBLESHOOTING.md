# Troubleshooting Guide

Common issues and their solutions.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Development Server Issues](#development-server-issues)
- [Sketch Issues](#sketch-issues)
- [p5.js Specific Issues](#p5js-specific-issues)
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

2. **Check Node version:**
   ```bash
   node --version  # Should be >= 18.0.0
   
   # If too old, upgrade:
   nvm install 18
   nvm use 18
   ```

### Dependencies not found

**Symptoms:**
```
Error: Cannot find module 'p5'
```

**Solutions:**

1. **Verify workspaces are installed:**
   ```bash
   npm ls p5
   ```

2. **Reinstall from root:**
   ```bash
   cd /path/to/p5js  # Go to root
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
   sudo chown -R $(whoami) /path/to/p5js
   ```

## Development Server Issues

### Port already in use

**Symptoms:**
```
Error: Port 5176 is already in use
```

**Solutions:**

1. **Kill process on port:**
   ```bash
   # Linux/Mac
   lsof -ti:5176 | xargs kill -9
   
   # Or use fuser
   fuser -k 5176/tcp
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
   lsof -i :5176
   ```

### Dev server won't start

**Symptoms:**
- No output after `npm run learn`
- Process hangs

**Solutions:**

1. **Check for errors:**
   ```bash
   npm run learn 2>&1 | tee error.log
   ```

2. **Verify Vite is installed:**
   ```bash
   npm ls vite
   ```

3. **Try running directly:**
   ```bash
   cd books/learn-js-with-p5js
   npx vite --port 5176
   ```

### Browser doesn't open automatically

**Solutions:**

1. **Manual open:**
   - Server shows URL in terminal (e.g., `http://localhost:5176`)
   - Copy/paste into browser

2. **Fix auto-open:**
   ```javascript
   // vite.config.js
   server: {
     open: true,  // Ensure this is set
     port: 5176
   }
   ```

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

## Sketch Issues

### Canvas not showing

**Symptoms:**
- Blank page
- No canvas visible

**Solutions:**

1. **Check `setup()` function:**
   ```javascript
   function setup() {
     createCanvas(800, 600);  // Must have this
     background(240);         // Set a visible background
   }
   ```

2. **Check canvas color:**
   ```javascript
   // If background is black and shapes are black, you won't see anything
   background(20);      // Dark background
   fill(255);           // Light shapes
   ```

3. **Check browser console:**
   - Press `F12` to open DevTools
   - Look for JavaScript errors

### Sketch not loading

**Symptoms:**
```
404 Not Found
```

**Solutions:**

1. **Check file path:**
   - Path in browser should match folder structure
   - Example: `http://localhost:5176/src/chapters/01-hello-p5js/01-first-sketch/`

2. **Check script tag:**
   ```html
   <script src="sketch.js"></script>
   ```

3. **Check p5.js is loaded:**
   ```html
   <script src="https://cdn.jsdelivr.net/npm/p5@1.9.0/lib/p5.min.js"></script>
   ```

### Nothing animates

**Symptoms:**
- Static image
- No movement

**Solutions:**

1. **Add code to `draw()`:**
   ```javascript
   function draw() {
     // This runs 60 times per second
     ellipse(mouseX, mouseY, 50, 50);
   }
   ```

2. **Check frame rate:**
   ```javascript
   function setup() {
     frameRate(60);  // Set to 60 FPS
   }
   ```

3. **Clear background in draw():**
   ```javascript
   function draw() {
     background(240, 10);  // Semi-transparent for trails
     // Or
     background(240);      // Solid for no trails
   }
   ```

### Shapes not appearing

**Symptoms:**
- Code runs but shapes are invisible

**Solutions:**

1. **Check colors:**
   ```javascript
   background(20);  // Dark background
   fill(255);       // Light fill
   ellipse(x, y, 50, 50);
   ```

2. **Check stroke/fill:**
   ```javascript
   fill(255, 100, 150);  // Set fill color
   stroke(0);            // Set stroke color
   strokeWeight(2);      // Set stroke thickness
   ```

3. **Check coordinates:**
   ```javascript
   // Make sure shapes are within canvas
   console.log('x:', x, 'y:', y);
   ```

## p5.js Specific Issues

### `setup` or `draw` not defined

**Symptoms:**
```
Uncaught ReferenceError: setup is not defined
```

**Solutions:**

1. **Check function names:**
   ```javascript
   // Correct
   function setup() { ... }
   function draw() { ... }
   
   // Wrong
   function Setup() { ... }  // Capital S
   function DRAW() { ... }   // All caps
   ```

2. **Check script order:**
   ```html
   <!-- p5.js must load first -->
   <script src="https://cdn.jsdelivr.net/npm/p5@1.9.0/lib/p5.min.js"></script>
   <!-- Then your sketch -->
   <script src="sketch.js"></script>
   ```

### Instance mode issues

**Symptoms:**
- Functions not working
- `p5 is not defined`

**Solutions:**

1. **Use `p.` prefix:**
   ```javascript
   const sketch = (p) => {
     p.setup = () => {
       p.createCanvas(800, 600);  // Use p.
     };
     
     p.draw = () => {
       p.ellipse(p.mouseX, p.mouseY, 50, 50);  // Use p.
     };
   };
   ```

2. **Create instance:**
   ```javascript
   new p5(sketch);  // Don't forget this
   ```

### Mouse/keyboard not responding

**Symptoms:**
- Event handlers not called

**Solutions:**

1. **Define event handlers:**
   ```javascript
   function mousePressed() {
     console.log('Mouse pressed');
   }
   
   function keyPressed() {
     console.log('Key pressed:', key);
   }
   ```

2. **Check canvas focus:**
   - Click on canvas first
   - Canvas must have focus for keyboard events

### `saveCanvas` not working

**Symptoms:**
- File not saving

**Solutions:**

1. **Call in event handler:**
   ```javascript
   function keyPressed() {
     if (key === 's' || key === 'S') {
       saveCanvas('my-sketch', 'png');
     }
   }
   ```

2. **Check browser permissions:**
   - Allow downloads
   - Check download folder

## Performance Issues

### Low FPS / Laggy animation

**Solutions:**

1. **Reduce drawing complexity:**
   ```javascript
   // Lower detail
   ellipse(x, y, 50, 50);  // Instead of complex shapes
   
   // Fewer objects
   for (let i = 0; i < 100; i++) {  // Instead of 1000
     ellipse(x[i], y[i], 10, 10);
   }
   ```

2. **Optimize draw loop:**
   ```javascript
   function draw() {
     background(240);  // Clear once
     // Draw everything
   }
   ```

3. **Use noLoop() for static sketches:**
   ```javascript
   function setup() {
     createCanvas(800, 600);
     // Draw once
     noLoop();
   }
   ```

### High memory usage

**Solutions:**

1. **Clear old drawings:**
   ```javascript
   function draw() {
     background(240);  // Clear each frame
   }
   ```

2. **Limit object count:**
   ```javascript
   if (particles.length > 1000) {
     particles.shift();  // Remove oldest
   }
   ```

## Browser Issues

### Canvas not supported

**Solutions:**

1. **Use modern browser:**
   - Chrome, Firefox, Safari, Edge (latest versions)

2. **Check WebGL support:**
   ```javascript
   function setup() {
     createCanvas(800, 600);  // 2D
     // or
     createCanvas(800, 600, WEBGL);  // 3D
   }
   ```

### Console errors

**Common errors:**

1. **`p5 is not defined`:**
   - p5.js library not loaded
   - Check script tag order

2. **`createCanvas is not defined`:**
   - p5.js library not loaded
   - Called outside setup/draw (instance mode)

3. **`Unexpected token`:**
   - JavaScript syntax error
   - Check for missing braces, parentheses

### CORS errors

**Symptoms:**
```
Access to script at 'file:///' from origin 'null' has been blocked by CORS policy
```

**Solutions:**

1. **Use dev server:**
   ```bash
   npm run learn
   ```

2. **Don't open HTML directly:**
   - ❌ `file:///path/to/sketch.html`
   - ✅ `http://localhost:5176/...`

## Still Having Issues?

### Debug Steps

1. **Check console:**
   - Press `F12`
   - Look for red errors
   - Read error messages carefully

2. **Simplify the sketch:**
   ```javascript
   function setup() {
     createCanvas(800, 600);
     background(240);
   }
   
   function draw() {
     ellipse(mouseX, mouseY, 50, 50);
   }
   ```

3. **Check versions:**
   ```bash
   node --version
   npm --version
   npm ls p5
   ```

4. **Restart everything:**
   ```bash
   # Stop dev server (Ctrl+C)
   rm -rf node_modules
   npm install
   npm run learn
   ```

### Getting Help

1. **p5.js Forum:** https://discourse.processing.org/
2. **Stack Overflow:** Tag questions with `p5.js`
3. **p5.js Discord:** Community chat
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
