// Chapter 01: First Sketch
// A simple animated example demonstrating p5.js basics

let x = 0;
let y = 0;
let targetX = 0;
let targetY = 0;

function setup() {
  createCanvas(800, 600);
  background(20);
  frameRate(60);
  
  // Initialize target position
  targetX = width / 2;
  targetY = height / 2;
  
  console.log('🎨 Welcome to p5.js!');
  console.log('📁 Book: Learn JavaScript with p5.js');
  console.log('📖 Chapter 01: Hello p5.js');
  console.log('🎯 Sketch: First Sketch');
}

function draw() {
  // Semi-transparent background for trail effect
  background(20, 10);
  
  // Smooth mouse following with easing
  targetX = mouseX;
  targetY = mouseY;
  x = lerp(x, targetX, 0.1);
  y = lerp(y, targetY, 0.1);
  
  // Draw outer circle
  noStroke();
  fill(255, 100, 150, 200);
  ellipse(x, y, 80, 80);
  
  // Draw middle circle
  fill(100, 200, 255, 200);
  ellipse(x, y, 50, 50);
  
  // Draw inner circle
  fill(255, 255, 100, 200);
  ellipse(x, y, 20, 20);
  
  // Draw info text
  fill(255);
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);
  text(`Mouse: (${mouseX}, ${mouseY})`, 20, height - 80);
  text(`Smoothed: (${Math.round(x)}, ${Math.round(y)})`, 20, height - 60);
  text(`Frame: ${frameCount}`, 20, height - 40);
  text(`FPS: ${Math.round(frameRate())}`, 20, height - 20);
  
  // Draw decorative circles in corners
  drawCornerCircles();
}

function drawCornerCircles() {
  // Top-left corner
  fill(255, 100, 150, 100);
  ellipse(0, 0, 100, 100);
  
  // Top-right corner
  fill(100, 200, 255, 100);
  ellipse(width, 0, 100, 100);
  
  // Bottom-left corner
  fill(255, 255, 100, 100);
  ellipse(0, height, 100, 100);
  
  // Bottom-right corner
  fill(100, 255, 150, 100);
  ellipse(width, height, 100, 100);
}

function mousePressed() {
  // Clear the canvas
  background(20);
  console.log('Canvas cleared');
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('first-sketch', 'png');
    console.log('Canvas saved as first-sketch.png');
  }
  
  if (key === 'h' || key === 'H') {
    const info = document.getElementById('info');
    if (info) {
      info.style.display = info.style.display === 'none' ? 'block' : 'none';
    }
  }
}

function windowResized() {
  // Uncomment to make canvas responsive
  // resizeCanvas(windowWidth, windowHeight);
  // background(20);
}
