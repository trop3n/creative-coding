# Generative Design with p5.js

Creative coding and generative art techniques.

## Quick Start

```bash
# From root directory
npm run generative

# Or from this directory
npm run dev
```

**URL:** http://localhost:5177

## Sections

### P.01: Color
- **P.01-01-color-palette** - Color palette generation
- **P.01-02-color-rules** - Color harmony and rules
- **P.01-03-component-colors** - Component-based coloring

### P.02: Shape
- **P.02-01-shape-basics** - Basic shape creation
- **P.02-02-transformations** - Shape transformations
- **P.02-03-custom-shapes** - Custom shape design

## Book Focus

This book emphasizes:
- ✅ Generative art techniques
- ✅ Algorithmic design
- ✅ Randomness and noise
- ✅ Pattern generation
- ✅ Creative coding workflows

## Generative Art Basics

### Randomness
```javascript
function draw() {
  let x = random(width);
  let y = random(height);
  let size = random(10, 50);
  ellipse(x, y, size, size);
}
```

### Noise (Perlin)
```javascript
let offset = 0;

function draw() {
  let x = noise(offset) * width;
  ellipse(x, height/2, 50, 50);
  offset += 0.01;
}
```

### Patterns
```javascript
function setup() {
  createCanvas(800, 600);
  noLoop();
}

function draw() {
  for (let x = 0; x < width; x += 20) {
    for (let y = 0; y < height; y += 20) {
      ellipse(x, y, 10, 10);
    }
  }
}
```

## Creating New Sketches

```bash
# Copy template
cp -r ../../../templates/global-mode src/chapters/P.01-color/P.01-04-my-sketch

# Edit sketch
nano src/chapters/P.01-color/P.01-04-my-sketch/sketch.js
```

## Tips

- **Embrace randomness**: Use `random()` and `noise()`
- **Iterate**: Build complexity from simple rules
- **Save variations**: Export interesting results
- **Experiment**: Try different parameters

## Book Information

- **Title**: Generative Design with p5.js
- **Focus**: Generative art and creative coding
- **Level**: Intermediate
- **Prerequisites**: Basic p5.js knowledge

## Useful Functions for Generative Art

### Random
- `random(min, max)` - Random number
- `randomSeed(seed)` - Set random seed for reproducibility

### Noise
- `noise(x, y, z)` - Perlin noise
- `noiseDetail(octaves, falloff)` - Noise detail
- `noiseSeed(seed)` - Set noise seed

### Math
- `map(value, s1, e1, s2, e2)` - Map values
- `constrain(value, min, max)` - Constrain values
- `lerp(start, end, amt)` - Linear interpolation

### Drawing
- `beginShape()` / `endShape()` - Custom shapes
- `vertex(x, y)` - Shape vertices
- `curveVertex(x, y)` - Curve vertices

## Prerequisites

- Modern web browser
- Basic p5.js knowledge
- Understanding of JavaScript fundamentals

## Troubleshooting

See [../../TROUBLESHOOTING.md](../../TROUBLESHOOTING.md) for common issues.

## Additional Resources

- [Generative Design Website](http://www.generative-gestaltung.de/)
- [p5.js Examples](https://p5js.org/examples/)
- [Creative Coding Reddit](https://www.reddit.com/r/creativecoding/)

## Next Steps

1. Start with P.01 color sketches
2. Progress through shape sections
3. Create your own generative art
4. Share your work

---

**Happy creating! 🎨**
