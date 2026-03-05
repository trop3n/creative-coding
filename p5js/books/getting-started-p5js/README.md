# Getting Started with p5.js

Beginner-friendly introduction to p5.js.

## Quick Start

```bash
# From root directory
npm run getting-started

# Or from this directory
npm run dev
```

**URL:** http://localhost:5178

## Chapters

### Chapter 01: Hello
- **01-setup-draw** - Understanding setup() and draw()
- **02-first-animation** - Your first animation

### Chapter 02: Drawing
- **01-basic-shapes** - Rectangles, circles, and lines
- **02-color** - Adding color to shapes
- **03-custom-shapes** - Creating your own shapes

### Chapter 03: Flow
- **01-variables** - Using variables
- **02-loops** - Repeating actions with loops
- **03-functions** - Creating reusable code

## Book Focus

This book teaches:
- ✅ p5.js basics
- ✅ Drawing fundamentals
- ✅ Animation concepts
- ✅ Code flow control
- ✅ Interactive sketches

## Getting Started Tips

### Your First Sketch

```javascript
function setup() {
  createCanvas(800, 600);
  background(220);
}

function draw() {
  // This runs 60 times per second
  ellipse(mouseX, mouseY, 50, 50);
}
```

### Understanding setup() and draw()

- **`setup()`**: Runs once at the beginning
  - Set canvas size
  - Initialize variables
  - Load images/fonts

- **`draw()`**: Runs repeatedly (60 times per second)
  - Draw shapes
  - Update animations
  - Check for interactions

### Basic Shapes

```javascript
// Rectangle
rect(x, y, width, height);

// Ellipse (circle)
ellipse(x, y, width, height);

// Line
line(x1, y1, x2, y2);

// Point
point(x, y);

// Triangle
triangle(x1, y1, x2, y2, x3, y3);
```

### Adding Color

```javascript
// Fill color
fill(255, 0, 0);  // Red

// Stroke color
stroke(0, 0, 255);  // Blue

// Stroke weight
strokeWeight(2);

// No fill
noFill();

// No stroke
noStroke();
```

## Creating New Sketches

```bash
# Copy template
cp -r ../../../templates/global-mode src/chapters/01-hello/03-my-sketch

# Edit sketch
nano src/chapters/01-hello/03-my-sketch/sketch.js
```

## Tips for Beginners

1. **Start simple**: Master basics before complex sketches
2. **Read the reference**: [p5js.org/reference](https://p5js.org/reference/)
3. **Experiment freely**: Try changing values
4. **Break things**: Learn from mistakes
5. **Save often**: Export your work

## Common Beginner Mistakes

### Forgetting setup() or draw()
```javascript
// ❌ Wrong
function setup() {
  ellipse(mouseX, mouseY, 50, 50);
}

// ✅ Right
function setup() {
  createCanvas(800, 600);
}

function draw() {
  ellipse(mouseX, mouseY, 50, 50);
}
```

### Not clearing the background
```javascript
// ❌ Wrong (trails everywhere)
function draw() {
  ellipse(mouseX, mouseY, 50, 50);
}

// ✅ Right (clean canvas each frame)
function draw() {
  background(220);
  ellipse(mouseX, mouseY, 50, 50);
}
```

### Wrong coordinate order
```javascript
// ❌ Wrong (x, y swapped)
ellipse(300, 100);  // This is wrong!

// ✅ Right
ellipse(100, 300, 50, 50);  // x, y, width, height
```

## Book Information

- **Title**: Make: Getting Started with p5.js
- **Publisher**: Maker Media
- **Focus**: Beginner-friendly p5.js introduction
- **Level**: Absolute beginner
- **Prerequisites**: None

## Prerequisites

- Modern web browser
- No programming experience needed
- Willingness to learn

## Troubleshooting

See [../../TROUBLESHOOTING.md](../../TROUBLESHOOTING.md) for common issues.

## Additional Resources

- [p5.js Website](https://p5js.org/)
- [p5.js Get Started](https://p5js.org/get-started/)
- [The Coding Train](https://thecodingtrain.com/) - Excellent video tutorials
- [p5.js Web Editor](https://editor.p5js.org/) - Code online

## Learning Path

1. Complete Chapter 01 (Hello)
2. Move to Chapter 02 (Drawing)
3. Progress to Chapter 03 (Flow)
4. Create your own projects

## Next Steps

1. Start with "01-setup-draw" sketch
2. Follow along with the book
3. Experiment with code modifications
4. Build your own sketches

---

**Welcome to creative coding! 🎨**
