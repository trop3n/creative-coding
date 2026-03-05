import * as THREE from 'three';
import { 
  createOrbitControls, 
  createStudioLighting, 
  addStats,
  addGUI,
  createCube,
  createVideoRecorder,
  addRecordingControls,
  addRecordingKeyboardShortcuts
} from '@shared/utils/index.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ 
  antialias: true,
  preserveDrawingBuffer: true
});
renderer.setSize(1920, 1080);
renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

renderer.domElement.style.width = '100vw';
renderer.domElement.style.height = '100vh';

const controls = createOrbitControls(camera, renderer, {
  enableDamping: true,
  dampingFactor: 0.05,
  autoRotate: true,
  autoRotateSpeed: 2.0
});

const lights = createStudioLighting(scene);

const cubes = [];
const colors = [0xff6b6b, 0x4ecdc4, 0xffe66d, 0x95e1d3, 0xf38181];

for (let i = 0; i < 5; i++) {
  const cube = createCube(0.8, colors[i]);
  const angle = (i / 5) * Math.PI * 2;
  cube.position.x = Math.cos(angle) * 3;
  cube.position.z = Math.sin(angle) * 3;
  cube.position.y = 0.5;
  scene.add(cube);
  cubes.push(cube);
}

const groundGeometry = new THREE.PlaneGeometry(20, 20);
const groundMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x2d2d2d,
  roughness: 0.8,
  metalness: 0.2
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const stats = addStats();

const gui = addGUI();
const recordingFolder = gui.addFolder('📹 Recording Settings');
const recordingSettings = {
  format: 'webm',
  framerate: 60,
  quality: 100,
  duration: 10
};
recordingFolder.add(recordingSettings, 'format', ['webm', 'gif']).name('Format');
recordingFolder.add(recordingSettings, 'framerate', 15, 120, 1).name('Frame Rate');
recordingFolder.add(recordingSettings, 'quality', 1, 100, 1).name('Quality');
recordingFolder.add(recordingSettings, 'duration', 1, 60, 1).name('Duration (s)');
recordingFolder.open();

const recorder = createVideoRecorder(renderer, {
  width: 1920,
  height: 1080,
  framerate: recordingSettings.framerate,
  format: recordingSettings.format,
  quality: recordingSettings.quality,
  duration: recordingSettings.duration,
  name: 'rotating-cubes',
  verbose: true
});

addRecordingControls(gui, recorder);
addRecordingKeyboardShortcuts(recorder, { toggleKey: 'r', stopKey: 'Escape' });

const statusElement = document.getElementById('recording-status');

function animate() {
  stats.begin();

  const time = Date.now() * 0.001;

  cubes.forEach((cube, i) => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.02;
    cube.position.y = 0.5 + Math.sin(time * 2 + i) * 0.5;
  });

  controls.update();
  renderer.render(scene, camera);

  if (recorder.isRecording()) {
    recorder.capture();
    statusElement.textContent = '🔴 Recording...';
    statusElement.style.color = '#ff4444';
  } else {
    statusElement.textContent = '⏸ Not recording';
    statusElement.style.color = '#44ff44';
  }

  stats.end();
  requestAnimationFrame(animate);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.domElement.style.width = '100vw';
  renderer.domElement.style.height = '100vh';
}

window.addEventListener('resize', onWindowResize, false);

console.log('🎬 Video Recording Demo');
console.log('📹 Features:');
console.log('   • Press R to start/stop recording');
console.log('   • Press ESC to stop recording');
console.log('   • Use GUI to adjust recording settings');
console.log('   • Records at 1920x1080 resolution');
console.log('   • Output formats: WebM or GIF');

animate();
