// Global mode p5.js template
// Copy this file to start a new sketch

function setup() {
  createCanvas(800, 600);
  background(240);
  
  // Initialize your sketch
  console.log('🎨 Sketch initialized');
}

function draw() {
  // Your animation code here
  // Example: follow the mouse
  ellipse(mouseX, mouseY, 50, 50);
}

// Event handlers (optional)
function mousePressed() {
  // Called when mouse is pressed
  background(240);
}

function keyPressed() {
  // Called when a key is pressed
  console.log('Key pressed:', key);
  
  // Save canvas with 's' key
  if (key === 's' || key === 'S') {
    saveCanvas('my-sketch', 'png');
  }
}

function windowResized() {
  // Called when window is resized
  // resizeCanvas(windowWidth, windowHeight);
}
