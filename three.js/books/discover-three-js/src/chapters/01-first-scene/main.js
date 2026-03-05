import * as THREE from 'three';
import { createOrbitControls, createStudioLighting, addStats, createCube, createPlane } from '@shared/utils/index.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(3, 3, 3);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const controls = createOrbitControls(camera, renderer, {
  enableDamping: true,
  dampingFactor: 0.05,
  minDistance: 2,
  maxDistance: 10
});

const lights = createStudioLighting(scene);

const cube = createCube(1, 0x00ff88);
cube.position.y = 0.5;
scene.add(cube);

const plane = createPlane(10, 10, 0x333333);
plane.position.y = 0;
scene.add(plane);

const stats = addStats();

const gui = null;

function animate() {
  stats.begin();

  const time = Date.now() * 0.001;
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  cube.position.y = 0.5 + Math.sin(time) * 0.2;

  controls.update();
  renderer.render(scene, camera);

  stats.end();
  requestAnimationFrame(animate);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

document.addEventListener('keydown', (event) => {
  if (event.key === 'h' || event.key === 'H') {
    const info = document.getElementById('info');
    info.style.display = info.style.display === 'none' ? 'block' : 'none';
  }
});

console.log('🚀 Discover Three.js - Chapter 01: First Scene');
console.log('📚 Book: Discover Three.js');
console.log('🎮 Controls: Mouse drag to rotate, scroll to zoom');

animate();
