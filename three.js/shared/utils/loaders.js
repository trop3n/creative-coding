import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

const gltfLoader = new GLTFLoader();
const objLoader = new OBJLoader();
const fbxLoader = new FBXLoader();
const rgbeLoader = new RGBELoader();
const textureLoader = new THREE.TextureLoader();

export function loadGLTF(path, onProgress) {
  return new Promise((resolve, reject) => {
    gltfLoader.load(
      path,
      (gltf) => resolve(gltf),
      onProgress,
      (error) => reject(error)
    );
  });
}

export function loadOBJ(path, onProgress) {
  return new Promise((resolve, reject) => {
    objLoader.load(
      path,
      (obj) => resolve(obj),
      onProgress,
      (error) => reject(error)
    );
  });
}

export function loadFBX(path, onProgress) {
  return new Promise((resolve, reject) => {
    fbxLoader.load(
      path,
      (fbx) => resolve(fbx),
      onProgress,
      (error) => reject(error)
    );
  });
}

export function loadTexture(path, options = {}) {
  return new Promise((resolve, reject) => {
    textureLoader.load(
      path,
      (texture) => {
        if (options.wrapS) texture.wrapS = options.wrapS;
        if (options.wrapT) texture.wrapT = options.wrapT;
        if (options.repeat) texture.repeat.set(options.repeat.x, options.repeat.y);
        if (options.encoding) texture.encoding = options.encoding;
        if (options.flipY !== undefined) texture.flipY = options.flipY;
        resolve(texture);
      },
      undefined,
      (error) => reject(error)
    );
  });
}

export function loadHDR(path) {
  return new Promise((resolve, reject) => {
    rgbeLoader.load(
      path,
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        resolve(texture);
      },
      undefined,
      (error) => reject(error)
    );
  });
}

export async function loadMultipleTextures(texturePaths) {
  const promises = texturePaths.map((path) => loadTexture(path));
  return Promise.all(promises);
}

export function setEnvironmentMap(scene, hdrTexture) {
  scene.environment = hdrTexture;
  if (hdrTexture) {
    scene.background = hdrTexture;
  }
}
