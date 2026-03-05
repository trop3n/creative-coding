import * as THREE from 'three';

export function createStudioLighting(scene) {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
  mainLight.position.set(10, 10, 10);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 2048;
  mainLight.shadow.mapSize.height = 2048;
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
  fillLight.position.set(-10, 5, -10);
  scene.add(fillLight);

  const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
  backLight.position.set(0, -5, -10);
  scene.add(backLight);

  return { ambientLight, mainLight, fillLight, backLight };
}

export function createOutdoorLighting(scene) {
  const ambientLight = new THREE.AmbientLight(0x87ceeb, 0.6);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
  sunLight.position.set(50, 100, 50);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 500;
  scene.add(sunLight);

  const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x8b4513, 0.3);
  scene.add(hemisphereLight);

  return { ambientLight, sunLight, hemisphereLight };
}

export function createDramaticLighting(scene) {
  const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
  scene.add(ambientLight);

  const spotLight1 = new THREE.SpotLight(0xff0000, 2.0);
  spotLight1.position.set(-10, 10, 0);
  spotLight1.angle = Math.PI / 6;
  spotLight1.penumbra = 0.3;
  spotLight1.castShadow = true;
  scene.add(spotLight1);

  const spotLight2 = new THREE.SpotLight(0x0000ff, 2.0);
  spotLight2.position.set(10, 10, 0);
  spotLight2.angle = Math.PI / 6;
  spotLight2.penumbra = 0.3;
  spotLight2.castShadow = true;
  scene.add(spotLight2);

  const spotLight3 = new THREE.SpotLight(0x00ff00, 1.5);
  spotLight3.position.set(0, -5, 10);
  spotLight3.angle = Math.PI / 4;
  spotLight3.penumbra = 0.5;
  scene.add(spotLight3);

  return { ambientLight, spotLight1, spotLight2, spotLight3 };
}

export function createPointLight(scene, color = 0xffffff, intensity = 1.0, position = { x: 0, y: 5, z: 0 }) {
  const pointLight = new THREE.PointLight(color, intensity, 100);
  pointLight.position.set(position.x, position.y, position.z);
  pointLight.castShadow = true;
  scene.add(pointLight);

  const sphereGeometry = new THREE.SphereGeometry(0.1, 16, 16);
  const sphereMaterial = new THREE.MeshBasicMaterial({ color: color });
  const lightHelper = new THREE.Mesh(sphereGeometry, sphereMaterial);
  lightHelper.position.copy(pointLight.position);
  scene.add(lightHelper);

  return { pointLight, lightHelper };
}
