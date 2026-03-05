// Instance mode p5.js template
// Use this when you need multiple sketches on one page or better encapsulation

const sketch = (p) => {
  p.setup = () => {
    const canvas = p.createCanvas(800, 600);
    canvas.parent('sketch-container');
    p.background(240);
    
    console.log('🎨 Sketch initialized (instance mode)');
  };

  p.draw = () => {
    // Your animation code here
    // Example: follow the mouse
    p.ellipse(p.mouseX, p.mouseY, 50, 50);
  };

  p.mousePressed = () => {
    // Called when mouse is pressed
    p.background(240);
  };

  p.keyPressed = () => {
    // Called when a key is pressed
    console.log('Key pressed:', p.key);
    
    // Save canvas with 's' key
    if (p.key === 's' || p.key === 'S') {
      p.saveCanvas('my-sketch', 'png');
    }
  };

  p.windowResized = () => {
    // Called when window is resized
    // p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

// Create p5 instance
new p5(sketch);
