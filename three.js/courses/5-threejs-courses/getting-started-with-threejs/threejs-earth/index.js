import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarfield from "./src/getStarfield.js";
console.log(`THREE REVISION: %c${THREE.REVISION}`, "color: #FFFF00");
window.THREE = THREE;
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * Math.PI / 180;
scene.add(earthGroup);
new OrbitControls(camera, renderer.domElement);

const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, 12);
const material = new THREE.MeshStandardMaterial({
    map: loader.load("./textures/00_earthmap1k.jpg"),
    flatShading: true,
});
const earthMesh = new THREE.Mesh(geometry, material);
scene.add(earthMesh);

const stars = getStarfield();
scene.add(stars);

const hemiLight = new THREE.HemisphereLight();
scene.add(hemiLight);
function animate() {
    requestAnimationFrame(animate)

    earthMesh.rotation.x += 0.001;
    earthMesh.rotation.y += 0.002;
    renderer.render(scene, camera);
}

animate();