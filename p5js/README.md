# p5.js Learning Environment

A professional, workspace-based development environment for learning p5.js from multiple books.

## 📚 Included Books

- **Learn JavaScript with p5.js** - JavaScript fundamentals through creative coding
- **Generative Design with p5.js** - Creative coding and generative art
- **Make: Getting Started with p5.js** - Beginner-friendly introduction

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
   # Learn JavaScript with p5.js (port 5176)
   npm run learn
   
   # Generative Design (port 5177)
   npm run generative
   
   # Getting Started (port 5178)
   npm run getting-started
   ```

3. **Navigate to a sketch**: Open one of the sketch folders in your browser
   - Example: `http://localhost:5176/src/chapters/01-hello-p5js/01-first-sketch/`

## 📁 Project Structure

```
p5js/
├── templates/                  # Starter templates
│   ├── global-mode/           # Standard p5.js style
│   └── instance-mode/         # Encapsulated p5.js
│
├── books/                      # Individual book workspaces
│   ├── learn-js-with-p5js/
│   │   ├── src/
│   │   │   ├── chapters/
│   │   │   │   ├── 01-hello-p5js/
│   │   │   │   │   ├── 01-first-sketch/  ✨ Working example
│   │   │   │   │   ├── 02-drawing-shapes/
│   │   │   │   │   └── 03-color-intro/
│   │   │   │   ├── 02-javascript-basics/
│   │   │   │   └── 03-color-and-drawing/
│   │   │   └── styles/
│   │   └── README.md
│   │
│   ├── generative-design/
│   │   ├── src/
│   │   │   ├── chapters/
│   │   │   │   ├── P.01-color/
│   │   │   │   └── P.02-shape/
│   │   │   └── styles/
│   │   └── README.md
│   │
│   └── getting-started-p5js/
│       ├── src/
│       │   ├── chapters/
│       │   │   ├── 01-hello/
│       │   │   ├── 02-drawing/
│       │   │   └── 03-flow/
│       │   └── styles/
│       └── README.md
│
├── .vscode/                    # VS Code configuration
└── README.md                   # This file
```

## 🎨 Working with Sketches

### Running a Sketch

Each sketch is self-contained in its own folder with:
- `index.html` - HTML file that loads p5.js and your sketch
- `sketch.js` - Your p5.js code

**To run a sketch:**

1. Start the dev server:
   ```bash
   npm run learn
   ```

2. Navigate to the sketch in your browser:
   ```
   http://localhost:5176/src/chapters/01-hello-p5js/01-first-sketch/
   ```

### Creating a New Sketch

**Option 1: Use the template**

1. Copy the template folder:
   ```bash
   cp -r templates/global-mode books/learn-js-with-p5js/src/chapters/01-hello-p5js/04-my-sketch
   ```

2. Edit `sketch.js` with your code

3. Navigate to the sketch in your browser

**Option 2: Create manually**

1. Create a new folder:
   ```bash
   mkdir books/learn-js-with-p5js/src/chapters/01-hello-p5js/04-my-sketch
   ```

2. Create `index.html`:
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

3. Create `sketch.js`:
   ```javascript
   function setup() {
     createCanvas(800, 600);
     background(240);
   }
   
   function draw() {
     ellipse(mouseX, mouseY, 50, 50);
   }
   ```

### Sketch Templates

Two templates are provided:

**Global Mode** (`templates/global-mode/`)
- Standard p5.js style
- `setup()` and `draw()` are global functions
- Easier for beginners
- Matches most tutorials

**Instance Mode** (`templates/instance-mode/`)
- Encapsulated p5.js
- Better for multiple sketches on one page
- Better integration with other libraries
- More structured for complex projects

## 📦 Available Scripts

### Root Level
- `npm run learn` - Start Learn JS with p5.js dev server (port 5176)
- `npm run generative` - Start Generative Design dev server (port 5177)
- `npm run getting-started` - Start Getting Started dev server (port 5178)
- `npm run build:learn` - Build Learn JS for production
- `npm run build:generative` - Build Generative Design for production
- `npm run build:getting-started` - Build Getting Started for production

### Per Book
Navigate to a book directory and run:
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎯 Features

✅ **Workspace-based** - Isolated dependencies per book  
✅ **Self-contained sketches** - Each sketch is independent  
✅ **Hot Module Replacement** - Instant preview as you code  
✅ **Template system** - Quick sketch creation  
✅ **Both p5.js modes** - Global and instance mode templates  
✅ **Editor support** - VS Code configuration  
✅ **Well-organized** - Clear chapter structure  

## 📖 Learning Path

### Recommended Order
1. **Getting Started with p5.js** (Chapters 1-3) - Best for absolute beginners
2. **Learn JavaScript with p5.js** (Chapters 1-3) - JavaScript fundamentals
3. **Generative Design** (P.01-P.02) - Creative coding focus

### Chapter Guide

**Learn JavaScript with p5.js:**
- Ch 01: Hello p5.js ✨ *Working example included*
- Ch 02: JavaScript Basics
- Ch 03: Color and Drawing

**Generative Design:**
- P.01: Color
- P.02: Shape

**Getting Started with p5.js:**
- Ch 01: Hello
- Ch 02: Drawing
- Ch 03: Flow

## 🛠️ p5.js Basics

### Global Mode Template

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

```javascript
const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(800, 600);
    p.background(240);
  };

  p.draw = () => {
    p.ellipse(p.mouseX, p.mouseY, 50, 50);
  };
};

new p5(sketch);
```

## 🎨 Useful p5.js Functions

### Drawing
- `createCanvas(w, h)` - Set canvas size
- `background(color)` - Clear background
- `ellipse(x, y, w, h)` - Draw ellipse
- `rect(x, y, w, h)` - Draw rectangle
- `line(x1, y1, x2, y2)` - Draw line

### Color
- `fill(r, g, b)` - Set fill color
- `stroke(r, g, b)` - Set stroke color
- `noFill()` - Disable fill
- `noStroke()` - Disable stroke

### Animation
- `mouseX, mouseY` - Mouse position
- `frameCount` - Current frame number
- `frameRate()` - Get/set frame rate
- `lerp(start, end, amt)` - Linear interpolation

### Interaction
- `mousePressed()` - Called on mouse click
- `keyPressed()` - Called on key press
- `key` - Last key pressed
- `keyCode` - Key code of last key

### Saving
- `saveCanvas(name, ext)` - Save canvas as image
- `saveFrames()` - Save animation frames

## 🐛 Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues and solutions.

## 📝 Tips

- **Save your work**: Press `S` to save canvas (if implemented in sketch)
- **Clear canvas**: Click mouse (if implemented in sketch)
- **Hot reload**: Edit sketch.js and save - browser reloads automatically
- **Console logging**: Use `console.log()` for debugging
- **Reference**: [p5.js Reference](https://p5js.org/reference/)

## 📚 Resources

- [p5.js Website](https://p5js.org/)
- [p5.js Reference](https://p5js.org/reference/)
- [p5.js Examples](https://p5js.org/examples/)
- [p5.js Web Editor](https://editor.p5js.org/)
- [The Coding Train](https://thecodingtrain.com/)

## 🎓 Recommended Workflow

1. **Start dev server**: `npm run learn`
2. **Open a sketch**: Navigate to a sketch folder
3. **Edit code**: Modify `sketch.js`
4. **See results**: Browser auto-reloads
5. **Experiment**: Try different p5.js functions
6. **Save**: Use `saveCanvas()` to export your work

## 🤝 Adding a New Book

1. Create new workspace:
   ```bash
   mkdir -p books/new-book/src/{chapters,styles}
   ```

2. Create `package.json` (copy from existing book, change port)

3. Add to root `package.json` scripts:
   ```json
   "new-book": "npm run dev -w books/new-book"
   ```

4. Run `npm install`

---

**Happy coding! 🎨**

Start with `npm install`, then `npm run learn` to see the working example.
