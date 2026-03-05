# Setup Guide

Complete instructions for setting up your p5.js learning environment.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Sketches](#running-sketches)
- [Creating New Sketches](#creating-new-sketches)
- [Using Templates](#using-templates)
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

3. **Git** (optional, for version control)
   ```bash
   # Check version
   git --version
   ```

### Recommended Software

- **VS Code** - Recommended editor
- **Chrome/Firefox** - Modern browser with dev tools

## Installation

### Step 1: Navigate to Project

```bash
cd /path/to/p5js
```

### Step 2: Install Dependencies

```bash
npm install
```

This will:
- Install all workspace dependencies
- Set up p5.js for all three books
- Install Vite for development servers

**Expected output:**
```
added 150 packages in 10s

10 packages are looking for funding
  run `npm fund` for details
```

### Step 3: Verify Installation

```bash
# Check that workspaces are recognized
npm ls --depth=0

# Should show:
# p5js-learning@1.0.0
# ├── generative-design@1.0.0
# ├── getting-started-p5js@1.0.0
# └── learn-js-with-p5js@1.0.0
```

### Step 4: Test a Dev Server

```bash
npm run learn
```

Expected:
- Dev server starts on port 5176
- Browser opens automatically
- You see the main page with navigation instructions

Press `Ctrl+C` to stop the server.

## Running Sketches

### Starting Development Servers

**From root directory:**
```bash
# Learn JavaScript with p5.js (port 5176)
npm run learn

# Generative Design (port 5177)
npm run generative

# Getting Started with p5.js (port 5178)
npm run getting-started
```

**From book directory:**
```bash
cd books/learn-js-with-p5js
npm run dev
```

### Navigating to Sketches

Each book has multiple sketches organized by chapter:

```
books/learn-js-with-p5js/src/chapters/
├── 01-hello-p5js/
│   ├── 01-first-sketch/      ✨ Working example
│   ├── 02-drawing-shapes/
│   └── 03-color-intro/
├── 02-javascript-basics/
└── 03-color-and-drawing/
```

**To view a sketch:**

1. Start the dev server:
   ```bash
   npm run learn
   ```

2. Navigate in browser:
   ```
   http://localhost:5176/src/chapters/01-hello-p5js/01-first-sketch/
   ```

3. The sketch loads automatically

### Port Allocation

| Book | Port | URL |
|------|------|-----|
| Learn JavaScript with p5.js | 5176 | http://localhost:5176 |
| Generative Design | 5177 | http://localhost:5177 |
| Getting Started with p5.js | 5178 | http://localhost:5178 |

## Creating New Sketches

### Method 1: Copy Template

```bash
# Navigate to book
cd books/learn-js-with-p5js/src/chapters/01-hello-p5js

# Copy template
cp -r ../../../templates/global-mode 04-my-sketch

# Edit sketch
nano 04-my-sketch/sketch.js
```

### Method 2: Create Manually

1. **Create folder:**
   ```bash
   mkdir books/learn-js-with-p5js/src/chapters/01-hello-p5js/04-my-sketch
   ```

2. **Create `index.html`:**
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>My Sketch</title>
       <script src="https://cdn.jsdelivr.net/npm/p5@1.9.0/lib/p5.min.js"></script>
       <link rel="stylesheet" href="../../../styles/main.css">
   </head>
   <body>
       <script src="sketch.js"></script>
   </body>
   </html>
   ```

3. **Create `sketch.js`:**
   ```javascript
   function setup() {
     createCanvas(800, 600);
     background(240);
     console.log('🎨 My Sketch initialized');
   }
   
   function draw() {
     ellipse(mouseX, mouseY, 50, 50);
   }
   
   function mousePressed() {
     background(240);
   }
   ```

4. **Navigate to sketch:**
   ```
   http://localhost:5176/src/chapters/01-hello-p5js/04-my-sketch/
   ```

## Using Templates

Two templates are provided in the `templates/` folder:

### Global Mode Template

**Location:** `templates/global-mode/`

**When to use:**
- Learning p5.js basics
- Following most tutorials
- Simple sketches
- Beginner-friendly

**Structure:**
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

### Instance Mode Template

**Location:** `templates/instance-mode/`

**When to use:**
- Multiple sketches on one page
- Integrating with other libraries
- More complex projects
- Better code organization

**Structure:**
```javascript
const sketch = (p) => {
  p.setup = () => {
    const canvas = p.createCanvas(800, 600);
    canvas.parent('sketch-container');
    p.background(240);
  };

  p.draw = () => {
    p.ellipse(p.mouseX, p.mouseY, 50, 50);
  };

  p.mousePressed = () => {
    p.background(240);
  };
};

new p5(sketch);
```

**Key differences:**
- All p5.js functions are prefixed with `p.`
- Encapsulated in a function
- Better for complex projects

## Development Workflow

### Basic Workflow

1. **Start dev server:**
   ```bash
   npm run learn
   ```

2. **Open a sketch** in browser

3. **Edit sketch.js** in your editor

4. **Save the file**

5. **Browser auto-reloads** with changes

6. **Experiment** with p5.js functions

7. **Save your work** using `saveCanvas()` (if implemented)

### Hot Module Replacement

The dev server automatically reloads when you save changes:
- Edit `sketch.js`
- Save the file (Ctrl+S / Cmd+S)
- Browser reloads instantly
- No manual refresh needed

### Debugging

**Console logging:**
```javascript
function draw() {
  console.log('Mouse:', mouseX, mouseY);
  console.log('Frame:', frameCount);
}
```

**Visual debugging:**
```javascript
function draw() {
  // Show FPS
  fill(255);
  noStroke();
  text('FPS: ' + Math.round(frameRate()), 20, 20);
  
  // Show mouse position
  text(`Mouse: (${mouseX}, ${mouseY})`, 20, 40);
  
  // Draw coordinate axes
  stroke(255, 0, 0);
  line(0, 0, 50, 0);  // X axis
  stroke(0, 255, 0);
  line(0, 0, 0, 50);  // Y axis
}
```

**Browser DevTools:**
- Press `F12` to open
- Check Console for errors
- Use debugger statements

## Editor Setup

### VS Code

1. **Open project:**
   ```bash
   code /path/to/p5js
   ```

2. **Install recommended extensions:**
   - ESLint
   - Prettier
   - p5.vscode (p5.js snippets)

3. **Features:**
   - Auto-format on save
   - p5.js IntelliSense
   - Debug configurations

### Other Editors

Any editor works fine:
- Atom
- Sublime Text
- Vim/Neovim
- Emacs
- Notepad++

Just edit the `sketch.js` files and save.

## Next Steps

### 1. Explore the Working Example

```bash
npm run learn
```

Navigate to `src/chapters/01-hello-p5js/01-first-sketch/` and:
- Move your mouse around
- Watch the animated circles
- Click to clear
- Press 'S' to save

### 2. Modify the Example

Edit `sketch.js` in the working example:
- Change colors
- Adjust sizes
- Add new shapes
- Modify animation

### 3. Create Your Own Sketch

Use the template to create a new sketch:
```bash
cp -r templates/global-mode books/learn-js-with-p5js/src/chapters/01-hello-p5js/04-my-sketch
```

### 4. Follow a Book

Start with one of the books:
- **Getting Started** - Absolute beginners
- **Learn JavaScript** - JS fundamentals
- **Generative Design** - Creative coding

### 5. Practice Daily

Create small sketches regularly:
- Recreate examples from books
- Experiment with new functions
- Build on previous sketches
- Share your work

## Common Tasks

### Add a New Chapter

```bash
# Create chapter folder
mkdir books/learn-js-with-p5js/src/chapters/04-animations

# Create sketches
mkdir books/learn-js-with-p5js/src/chapters/04-animations/01-bouncing-ball
mkdir books/learn-js-with-p5js/src/chapters/04-animations/02-easing
```

### Export Sketches

```javascript
// Add to your sketch
function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('my-sketch', 'png');
  }
}
```

### Use External Libraries

```html
<!-- Add to index.html -->
<script src="https://cdn.jsdelivr.net/npm/p5@1.9.0/lib/addons/p5.sound.min.js"></script>
```

## Getting Help

- **Troubleshooting**: See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **p5.js Reference**: https://p5js.org/reference/
- **p5.js Forum**: https://discourse.processing.org/
- **Examples**: https://p5js.org/examples/

---

**Setup complete!** Run `npm run learn` to start learning.
