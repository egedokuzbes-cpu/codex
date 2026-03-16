import * as THREE from 'three';

export const createScene = () => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b0f14);

  const ambient = new THREE.AmbientLight(0xffffff, 0.45);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 0.85);
  keyLight.position.set(8, 12, 4);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x5aa2ff, 0.35);
  fillLight.position.set(-6, 6, -6);
  scene.add(fillLight);

  return scene;
};

