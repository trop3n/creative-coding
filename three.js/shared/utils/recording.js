/**
 * Video Recording Utility for Three.js
 * Uses CCapture.js from CDN for recording animations
 * 
 * Usage:
 * 1. Create recorder: const recorder = createVideoRecorder(renderer, options);
 * 2. Start recording: recorder.start();
 * 3. In animation loop: recorder.capture();
 * 4. Stop recording: recorder.stop();
 */

let CCapture = null;

/**
 * Load CCapture.js from CDN
 */
async function loadCCapture() {
  if (CCapture) return CCapture;
  
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/ccapture.js@1.1.0/build/CCapture.all.min.js';
    script.onload = () => {
      CCapture = window.CCapture;
      resolve(CCapture);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

/**
 * Create a video recorder
 * @param {THREE.WebGLRenderer} renderer - Three.js renderer
 * @param {Object} options - Recording options
 * @param {number} options.width - Video width (default: 1920)
 * @param {number} options.height - Video height (default: 1080)
 * @param {number} options.framerate - Frames per second (default: 60)
 * @param {string} options.format - Output format: 'webm', 'gif', 'ffmpeg' (default: 'webm')
 * @param {number} options.duration - Duration in seconds (optional, for auto-stop)
 * @param {string} options.name - Output filename (default: 'threejs-animation')
 * @param {boolean} options.verbose - Show console logs (default: true)
 * @returns {Object} Recorder instance with start(), capture(), stop() methods
 */
export async function createVideoRecorder(renderer, options = {}) {
  const {
    width = 1920,
    height = 1080,
    framerate = 60,
    format = 'webm',
    duration = null,
    name = 'threejs-animation',
    verbose = true,
    quality = 100
  } = options;

  await loadCCapture();

  let capturer = null;
  let isRecording = false;
  let frameCount = 0;

  const originalSize = {
    width: renderer.domElement.width,
    height: renderer.domElement.height
  };

  function log(message) {
    if (verbose) {
      console.log(`📹 ${message}`);
    }
  }

  return {
    /**
     * Start recording
     */
    start() {
      capturer = new CCapture({
        format,
        framerate,
        name,
        quality,
        verbose
      });

      // Resize renderer to recording resolution
      renderer.setSize(width, height);
      renderer.domElement.style.width = `${width}px`;
      renderer.domElement.style.height = `${height}px`;

      capturer.start();
      isRecording = true;
      frameCount = 0;

      log(`Recording started (${width}x${height} @ ${framerate}fps)`);
    },

    /**
     * Capture current frame
     */
    capture() {
      if (!isRecording || !capturer) return;

      capturer.capture(renderer.domElement);
      frameCount++;

      // Auto-stop if duration is set
      if (duration && frameCount >= duration * framerate) {
        this.stop();
      }
    },

    /**
     * Stop recording and download
     */
    stop() {
      if (!isRecording || !capturer) return;

      capturer.stop();
      capturer.save();

      log(`Recording stopped (${frameCount} frames)`);
      log('File downloading...');

      isRecording = false;

      // Restore original size
      renderer.setSize(originalSize.width, originalSize.height);
      renderer.domElement.style.width = `${originalSize.width}px`;
      renderer.domElement.style.height = `${originalSize.height}px`;
    },

    /**
     * Toggle recording
     */
    toggle() {
      if (isRecording) {
        this.stop();
      } else {
        this.start();
      }
    },

    /**
     * Check if recording
     */
    isRecording() {
      return isRecording;
    },

    /**
     * Get frame count
     */
    getFrameCount() {
      return frameCount;
    },

    /**
     * Reset recorder
     */
    reset() {
      if (isRecording) {
        this.stop();
      }
      capturer = null;
      frameCount = 0;
    }
  };
}

/**
 * Create a GIF recorder (optimized settings)
 * @param {THREE.WebGLRenderer} renderer - Three.js renderer
 * @param {Object} options - Additional options
 */
export async function createGifRecorder(renderer, options = {}) {
  return createVideoRecorder(renderer, {
    format: 'gif',
    framerate: options.framerate || 15,
    quality: options.quality || 10,
    width: options.width || 800,
    height: options.height || 600,
    ...options
  });
}

/**
 * Create a 4K (3840x2160) recorder
 * @param {THREE.WebGLRenderer} renderer - Three.js renderer
 * @param {Object} options - Additional options
 */
export async function create4KRecorder(renderer, options = {}) {
  return createVideoRecorder(renderer, {
    width: 3840,
    height: 2160,
    framerate: options.framerate || 30,
    format: options.format || 'webm',
    quality: options.quality || 100,
    ...options
  });
}

/**
 * Create a high quality recorder (1080p, 60fps, high bitrate)
 * @param {THREE.WebGLRenderer} renderer - Three.js renderer
 * @param {Object} options - Additional options
 */
export async function createHighQualityRecorder(renderer, options = {}) {
  return createVideoRecorder(renderer, {
    width: options.width || 1920,
    height: options.height || 1080,
    framerate: options.framerate || 60,
    format: options.format || 'webm',
    quality: options.quality || 100,
    ...options
  });
}

/**
 * Helper to add recording controls to GUI
 * @param {Object} gui - lil-gui instance
 * @param {Object} recorder - Recorder instance
 */
export function addRecordingControls(gui, recorder) {
  const controls = {
    isRecording: false,
    start: () => {
      recorder.start();
      controls.isRecording = true;
    },
    stop: () => {
      recorder.stop();
      controls.isRecording = false;
    },
    toggle: () => {
      recorder.toggle();
      controls.isRecording = recorder.isRecording();
    }
  };

  const folder = gui.addFolder('📹 Video Recording');
  folder.add(controls, 'start').name('▶ Start Recording');
  folder.add(controls, 'stop').name('⏹ Stop Recording');
  folder.add(controls, 'toggle').name('⏯ Toggle Recording');
  folder.add(controls, 'isRecording').name('Recording').listen().disable();

  return controls;
}

/**
 * Keyboard shortcuts for recording
 * @param {Object} recorder - Recorder instance
 * @param {Object} options - Shortcut options
 */
export function addRecordingKeyboardShortcuts(recorder, options = {}) {
  const {
    startKey = 'r',
    stopKey = 'Escape',
    toggleKey = 'r'
  } = options;

  document.addEventListener('keydown', (event) => {
    if (event.key === toggleKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      recorder.toggle();
    }
    
    if (event.key === stopKey) {
      event.preventDefault();
      if (recorder.isRecording()) {
        recorder.stop();
      }
    }
  });

  console.log(`⌨️ Recording shortcuts: ${toggleKey.toUpperCase()} = toggle, ESC = stop`);
}
