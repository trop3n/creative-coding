import * as THREE from 'three';
import Stats from 'stats.js';
import { GUI } from 'lil-gui';

export function addStats() {
  const stats = new Stats();
  stats.showPanel(0);
  stats.dom.style.position = 'absolute';
  stats.dom.style.top = '0px';
  stats.dom.style.left = '0px';
  document.body.appendChild(stats.dom);

  return {
    begin: () => stats.begin(),
    end: () => stats.end(),
    dom: stats.dom
  };
}

export function addGUI() {
  const gui = new GUI();
  return gui;
}

export function addAxesHelper(scene, size = 5) {
  const axesHelper = new THREE.AxesHelper(size);
  scene.add(axesHelper);
  return axesHelper;
}

export function addGridHelper(scene, size = 10, divisions = 10) {
  const gridHelper = new THREE.GridHelper(size, divisions);
  scene.add(gridHelper);
  return gridHelper;
}

export function addCameraHelper(scene, camera) {
  const cameraHelper = new THREE.CameraHelper(camera);
  scene.add(cameraHelper);
  return cameraHelper;
}

export function addDirectionalLightHelper(scene, light, size = 1) {
  const helper = new THREE.DirectionalLightHelper(light, size);
  scene.add(helper);
  return helper;
}

export function addSpotLightHelper(scene, light) {
  const helper = new THREE.SpotLightHelper(light);
  scene.add(helper);
  return helper;
}

export function createCube(size = 1, color = 0x00ff00) {
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshStandardMaterial({ color: color });
  const cube = new THREE.Mesh(geometry, material);
  cube.castShadow = true;
  cube.receiveShadow = true;
  return cube;
}

export function createSphere(radius = 0.5, color = 0x0000ff) {
  const geometry = new THREE.SphereGeometry(radius, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: color });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  return sphere;
}

export function createPlane(width = 10, height = 10, color = 0xcccccc) {
  const geometry = new THREE.PlaneGeometry(width, height);
  const material = new THREE.MeshStandardMaterial({ 
    color: color,
    side: THREE.DoubleSide 
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -Math.PI / 2;
  plane.receiveShadow = true;
  return plane;
}

export function disposeObject(object) {
  if (object.geometry) {
    object.geometry.dispose();
  }
  if (object.material) {
    if (Array.isArray(object.material)) {
      object.material.forEach(material => material.dispose());
    } else {
      object.material.dispose();
    }
  }
}

export function disposeScene(scene) {
  scene.traverse((object) => {
    if (object.isMesh) {
      disposeObject(object);
    }
  });
}
