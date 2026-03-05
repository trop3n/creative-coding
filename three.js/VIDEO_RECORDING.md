# Video Recording with Three.js

Export your Three.js animations as video files (.webm, .gif, or .mp4 with ffmpeg).

## Quick Start

```javascript
import { createVideoRecorder } from '@shared/utils/index.js';

// 1. Create recorder
const recorder = createVideoRecorder(renderer, {
  width: 1920,
  height: 1080,
  framerate: 60,
  format: 'webm'
});

// 2. Start recording
recorder.start();

// 3. In animation loop
function animate() {
  renderer.render(scene, camera);
  
  if (recorder.isRecording()) {
    recorder.capture();
  }
  
  requestAnimationFrame(animate);
}

// 4. Stop recording (downloads automatically)
recorder.stop();
```

## Preset Recorders

### WebM (Recommended)
```javascript
const recorder = createVideoRecorder(renderer, {
  format: 'webm',
  width: 1920,
  height: 1080,
  framerate: 60
});
```

### GIF
```javascript
import { createGifRecorder } from '@shared/utils/index.js';

const recorder = createGifRecorder(renderer, {
  width: 800,
  height: 600,
  framerate: 15,
  quality: 10  // 1-100, lower = smaller file
});
```

### 4K (3840x2160)
```javascript
import { create4KRecorder } from '@shared/utils/index.js';

const recorder = create4KRecorder(renderer, {
  framerate: 30
});
```

### High Quality
```javascript
import { createHighQualityRecorder } from '@shared/utils/index.js';

const recorder = createHighQualityRecorder(renderer, {
  width: 1920,
  height: 1080,
  framerate: 60
});
```

## Recording Controls

### Keyboard Shortcuts

```javascript
import { 
  createVideoRecorder, 
  addRecordingKeyboardShortcuts 
} from '@shared/utils/index.js';

const recorder = createVideoRecorder(renderer);
addRecordingKeyboardShortcuts(recorder);

// R = Toggle recording
// ESC = Stop recording
```

### GUI Controls

```javascript
import { 
  createVideoRecorder, 
  addGUI,
  addRecordingControls 
} from '@shared/utils/index.js';

const recorder = createVideoRecorder(renderer);
const gui = addGUI();
addRecordingControls(gui, recorder);

// Adds GUI buttons: Start, Stop, Toggle
```

## Complete Example

```javascript
import * as THREE from 'three';
import { 
  createOrbitControls,
  createVideoRecorder,
  addRecordingKeyboardShortcuts
} from '@shared/utils/index.js';

// Setup scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1920/1080, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
  preserveDrawingBuffer: true // Required for recording
});
renderer.setSize(1920, 1080);

// Create recorder
const recorder = createVideoRecorder(renderer, {
  width: 1920,
  height: 1080,
  framerate: 60,
  format: 'webm',
  name: 'my-animation'
});

// Add keyboard shortcuts
addRecordingKeyboardShortcuts(recorder);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Update scene
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;
  
  renderer.render(scene, camera);
  
  // Capture frame if recording
  recorder.capture();
}

animate();
```

## Options

### Common Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `width` | number | 1920 | Video width in pixels |
| `height` | number | 1080 | Video height in pixels |
| `framerate` | number | 60 | Frames per second |
| `format` | string | 'webm' | Output format: 'webm', 'gif', 'ffmpeg' |
| `name` | string | 'threejs-animation' | Output filename |
| `verbose` | boolean | true | Show console logs |

### WebM Options

```javascript
createVideoRecorder(renderer, {
  format: 'webm',
  width: 1920,
  height: 1080,
  framerate: 60,
  quality: 100  // 1-100
});
```

### GIF Options

```javascript
createGifRecorder(renderer, {
  width: 800,
  height: 600,
  framerate: 15,  // GIFs work better at lower framerates
  quality: 10,    // 1-100, lower = smaller file
  name: 'my-gif'
});
```

### FFmpeg (MP4/MOV)

```javascript
createVideoRecorder(renderer, {
  format: 'ffmpeg',
  width: 1920,
  height: 1080,
  framerate: 60,
  codec: 'libx264'  // H.264 codec
});
```

**Note**: FFmpeg requires local installation:
```bash
# Ubuntu/Debian
sudo apt install ffmpeg

# macOS
brew install ffmpeg

# Windows
# Download from https://ffmpeg.org/
```

## API Reference

### `createVideoRecorder(renderer, options)`

Creates a video recorder instance.

**Returns:**
```javascript
{
  start(),           // Start recording
  stop(),            // Stop recording (downloads file)
  capture(),         // Capture current frame
  toggle(),          // Toggle recording on/off
  isRecording(),     // Returns boolean
  getFrameCount(),   // Returns number of captured frames
  reset()            // Reset recorder
}
```

### Methods

#### `start()`
Start recording. Resizes canvas to recording resolution.

```javascript
recorder.start();
```

#### `stop()`
Stop recording and download the video file.

```javascript
recorder.stop();  // Downloads 'threejs-animation.webm'
```

#### `capture()`
Capture the current frame. Call in animation loop.

```javascript
function animate() {
  renderer.render(scene, camera);
  recorder.capture();
  requestAnimationFrame(animate);
}
```

#### `toggle()`
Toggle recording on/off.

```javascript
recorder.toggle();
```

#### `isRecording()`
Check if currently recording.

```javascript
if (recorder.isRecording()) {
  console.log('Recording in progress...');
}
```

## Common Workflows

### Record on Button Press

```javascript
document.getElementById('record-btn').addEventListener('click', () => {
  if (!recorder.isRecording()) {
    recorder.start();
  } else {
    recorder.stop();
  }
});
```

### Auto-Stop After Duration

```javascript
const recorder = createVideoRecorder(renderer, {
  duration: 5,  // Auto-stop after 5 seconds
  framerate: 60
});

function animate() {
  renderer.render(scene, camera);
  
  if (recorder.isRecording()) {
    recorder.capture();
    
    // Auto-stop after 300 frames (5 seconds * 60 fps)
    if (recorder.getFrameCount() >= 300) {
      recorder.stop();
    }
  }
  
  requestAnimationFrame(animate);
}
```

### Multiple Resolutions

```javascript
// Test at low resolution
const previewRecorder = createVideoRecorder(renderer, {
  width: 640,
  height: 360,
  name: 'preview'
});

// Final export at 4K
const finalRecorder = create4KRecorder(renderer, {
  name: 'final-4k'
});
```

## Tips

### 1. Use `preserveDrawingBuffer`

```javascript
const renderer = new THREE.WebGLRenderer({ 
  preserveDrawingBuffer: true  // Required for recording
});
```

### 2. Match Framerate

```javascript
// Set renderer framerate to match recording
renderer.setAnimationLoop(() => {
  // Animation code
});

// Or use frame limiting
let lastTime = 0;
function animate(time) {
  requestAnimationFrame(animate);
  
  const delta = time - lastTime;
  if (delta < 1000 / 60) return;  // Limit to 60 FPS
  
  lastTime = time;
  // Animation code
}
```

### 3. Fixed Duration

```javascript
const DURATION = 5;  // seconds
const FRAMERATE = 60;
const TOTAL_FRAMES = DURATION * FRAMERATE;

let frameCount = 0;

function animate() {
  if (recorder.isRecording() && frameCount < TOTAL_FRAMES) {
    renderer.render(scene, camera);
    recorder.capture();
    frameCount++;
    
    if (frameCount >= TOTAL_FRAMES) {
      recorder.stop();
    }
  }
  
  requestAnimationFrame(animate);
}
```

### 4. GIF Optimization

For GIFs:
- Use lower resolution (800x600 or less)
- Use lower framerate (10-15 fps)
- Reduce quality (5-20)
- Keep duration short (< 10 seconds)

```javascript
const recorder = createGifRecorder(renderer, {
  width: 640,
  height: 480,
  framerate: 12,
  quality: 15
});
```

## Troubleshooting

### Black/Blank Video

**Problem**: Video file is black or blank

**Solution**: Ensure `preserveDrawingBuffer: true`
```javascript
const renderer = new THREE.WebGLRenderer({ 
  preserveDrawingBuffer: true
});
```

### File Won't Download

**Problem**: Recording stops but no file downloads

**Solution**: Check browser console for errors. Some formats require user interaction:
```javascript
document.addEventListener('click', () => {
  recorder.start();
}, { once: true });
```

### Low Performance

**Problem**: Recording is slow or choppy

**Solution**: 
- Reduce resolution
- Lower framerate
- Use simpler scene geometry
- Disable post-processing during recording

### Large File Size

**Problem**: Video file is too large

**Solution**:
- Use WebM instead of GIF
- Reduce resolution
- Lower framerate
- Reduce quality setting
- Shorten duration

## Examples

See the working example at:
```
books/discover-three-js/src/chapters/11-video-recording/
```

Run with:
```bash
npm run discover
# Navigate to: http://localhost:5173/src/chapters/11-video-recording/
```

## Additional Resources

- [CCapture.js Documentation](https://github.com/spite/ccapture.js)
- [WebM Format](https://www.webmproject.org/)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)

---

**Happy recording! 🎬**
