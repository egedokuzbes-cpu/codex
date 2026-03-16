import * as THREE from 'three';

export const createMap01 = () => {
  const group = new THREE.Group();

  const floorGeometry = new THREE.PlaneGeometry(40, 40);
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1f26,
    roughness: 0.6,
    metalness: 0.2
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  group.add(floor);

  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0xe5e9ef,
    roughness: 0.8,
    metalness: 0.1
  });

  const wallThickness = 1;
  const wallHeight = 4;
  const wallLength = 40;

  const northWall = new THREE.Mesh(new THREE.BoxGeometry(wallLength, wallHeight, wallThickness), wallMaterial);
  northWall.position.set(0, wallHeight / 2, -20 + wallThickness / 2);
  group.add(northWall);

  const southWall = new THREE.Mesh(new THREE.BoxGeometry(wallLength, wallHeight, wallThickness), wallMaterial);
  southWall.position.set(0, wallHeight / 2, 20 - wallThickness / 2);
  group.add(southWall);

  const westWall = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, wallHeight, wallLength), wallMaterial);
  westWall.position.set(-20 + wallThickness / 2, wallHeight / 2, 0);
  group.add(westWall);

  const eastWall = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, wallHeight, wallLength), wallMaterial);
  eastWall.position.set(20 - wallThickness / 2, wallHeight / 2, 0);
  group.add(eastWall);

  const accentMaterial = new THREE.MeshStandardMaterial({
    color: 0x2c6fcb,
    emissive: 0x1a3f77,
    emissiveIntensity: 0.6,
    roughness: 0.3,
    metalness: 0.3
  });

  const accentStrip = new THREE.Mesh(new THREE.BoxGeometry(16, 0.1, 0.5), accentMaterial);
  accentStrip.position.set(0, 0.05, -8);
  group.add(accentStrip);

  return group;
};

