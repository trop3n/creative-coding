# Quick Reference Guide

Fast lookup for common tasks and commands.

## 🚀 Start Development

```bash
# Install dependencies (first time only)
npm install

# Start development servers
npm run learn           # Learn JS with p5.js (port 5176)
npm run generative      # Generative Design (port 5177)
npm run getting-started # Getting Started (port 5178)
```

## 📁 Project Structure

```
p5js/
├── templates/              # Starter templates
│   ├── global-mode/       # Standard p5.js
│   └── instance-mode/     # Encapsulated p5.js
└── books/                 # Book workspaces
    ├── learn-js-with-p5js/
    ├── generative-design/
    └── getting-started-p5js/
```

## 🎨 Create a New Sketch

```bash
# Copy template
cp -r templates/global-mode books/learn-js-with-p5js/src/chapters/01-hello-p5js/04-my-sketch

# Navigate in browser
http://localhost:5176/src/chapters/01-hello-p5js/04-my-sketch/
```

## 📝 Basic Sketch Template

```javascript
function setup() {
  createCanvas(800, 600);
  background(240);
}

function draw() {
  ellipse(mouseX, mouseY, 50, 50);
}

function mousePressed() {
  background(240);
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('my-sketch', 'png');
  }
}
```

## 🎯 Common p5.js Functions

### Canvas
- `createCanvas(w, h)` - Set canvas size
- `background(color)` - Clear background
- `resizeCanvas(w, h)` - Resize canvas

### Drawing
- `ellipse(x, y, w, h)` - Draw ellipse
- `rect(x, y, w, h)` - Draw rectangle
- `line(x1, y1, x2, y2)` - Draw line
- `point(x, y)` - Draw point
- `triangle(x1, y1, x2, y2, x3, y3)` - Draw triangle

### Color
- `fill(r, g, b)` - Set fill color
- `stroke(r, g, b)` - Set stroke color
- `noFill()` - Disable fill
- `noStroke()` - Disable stroke
- `color(r, g, b)` - Create color
- `background(r, g, b)` - Set background

### Animation
- `mouseX, mouseY` - Mouse position
- `pmouseX, pmouseY` - Previous mouse position
- `frameCount` - Current frame number
- `frameRate(fps)` - Set frame rate
- `lerp(start, end, amt)` - Linear interpolation

### Interaction
- `mousePressed()` - Called on click
- `mouseReleased()` - Called on release
- `mouseMoved()` - Called on move
- `mouseDragged()` - Called on drag
- `keyPressed()` - Called on key press
- `keyReleased()` - Called on key release
- `key` - Last key pressed
- `keyCode` - Key code

### Transform
- `translate(x, y)` - Move origin
- `rotate(angle)` - Rotate
- `scale(x, y)` - Scale
- `push()` - Save transform state
- `pop()` - Restore transform state

### Math
- `random(min, max)` - Random number
- `noise(x, y, z)` - Perlin noise
- `map(val, s1, e1, s2, e2)` - Map value
- `constrain(val, min, max)` - Constrain value
- `dist(x1, y1, x2, y2)` - Distance
- `abs(n)` - Absolute value
- `sin(angle)` - Sine
- `cos(angle)` - Cosine

### Saving
- `saveCanvas(name, ext)` - Save as image
- `saveFrames(name, ext, duration, fps)` - Save frames

## 🔍 Debug Tips

```javascript
// Log to console
console.log('Value:', variable);

// Show FPS
text('FPS: ' + frameRate(), 20, 20);

// Show mouse position
text(`Mouse: (${mouseX}, ${mouseY})`, 20, 40);

// Show frame count
text(`Frame: ${frameCount}`, 20, 60);

// Draw coordinate system
stroke(255, 0, 0);
line(0, 0, 50, 0);  // X axis (red)
stroke(0, 255, 0);
line(0, 0, 0, 50);  // Y axis (green)
```

## 🎨 Color Palettes

```javascript
// Grayscale
background(240);  // Light gray
fill(50);         // Dark gray

// RGB
fill(255, 100, 150);  // Pink
stroke(100, 200, 255); // Light blue

// RGBA (with transparency)
fill(255, 100, 150, 200);  // Semi-transparent pink

// Hex
fill('#FF6496');  // Pink
background('#1A1A1A');  // Dark background

// Named colors
fill('red');
background('black');
```

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Canvas not showing | Check canvas size, background color |
| Nothing animates | Add code in `draw()` function |
| Sketch not loading | Check script path in HTML |
| Black screen | Set `background()` in `setup()` |

## 📚 Resources

- **p5.js Reference**: https://p5js.org/reference/
- **p5.js Examples**: https://p5js.org/examples/
- **Web Editor**: https://editor.p5js.org/
- **The Coding Train**: https://thecodingtrain.com/

## 🎮 Keyboard Shortcuts

- **S** - Save canvas (if implemented)
- **H** - Toggle info panel (if implemented)
- **Ctrl+C** - Stop dev server
- **F12** - Open browser DevTools

## 🎯 Learning Path

1. **Getting Started** → Absolute beginners
2. **Learn JavaScript** → JS fundamentals
3. **Generative Design** → Creative coding

---

**Quick start**: `npm install && npm run learn`
