import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function createOrbitControls(camera, renderer, options = {}) {
  const controls = new OrbitControls(camera, renderer.domElement);

  controls.enableDamping = options.enableDamping !== undefined ? options.enableDamping : true;
  controls.dampingFactor = options.dampingFactor || 0.05;
  controls.screenSpacePanning = options.screenSpacePanning !== undefined ? options.screenSpacePanning : false;
  controls.minDistance = options.minDistance || 1;
  controls.maxDistance = options.maxDistance || 500;
  controls.maxPolarAngle = options.maxPolarAngle !== undefined ? options.maxPolarAngle : Math.PI;

  if (options.target) {
    controls.target.set(options.target.x, options.target.y, options.target.z);
  }

  if (options.autoRotate !== undefined) {
    controls.autoRotate = options.autoRotate;
    controls.autoRotateSpeed = options.autoRotateSpeed || 2.0;
  }

  return controls;
}

export function createFlyControls(camera, renderer) {
  const { FlyControls } = require('three/examples/jsm/controls/FlyControls.js');
  const controls = new FlyControls(camera, renderer.domElement);
  controls.movementSpeed = 1;
  controls.rollSpeed = Math.PI / 24;
  return controls;
}

export function createFirstPersonControls(camera, renderer) {
  const { FirstPersonControls } = require('three/examples/jsm/controls/FirstPersonControls.js');
  const controls = new FirstPersonControls(camera, renderer.domElement);
  controls.movementSpeed = 1;
  controls.lookSpeed = 0.1;
  return controls;
}
