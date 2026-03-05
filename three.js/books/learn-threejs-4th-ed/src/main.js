import * as THREE from 'three';
import { createOrbitControls, addStats } from '@shared/utils/index.js';

console.log('📖 Welcome to Learn Three.js - Fourth Edition!');
console.log('📁 Navigate to src/chapters/ to explore different chapters');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(3, 3, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const controls = createOrbitControls(camera, renderer);

const stats = addStats();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff6600, wireframe: true });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function animate() {
  stats.begin();
  
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
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

animate();
