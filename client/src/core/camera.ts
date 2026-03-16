import * as THREE from 'three';

export class CameraRig {
  camera: THREE.PerspectiveCamera;
  private offset: THREE.Vector3;
  private target = new THREE.Vector3();

  constructor() {
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
    this.offset = new THREE.Vector3(0, 3.5, 6.5);
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  update(targetPosition: THREE.Vector3, targetYaw: number, dt: number) {
    this.target.copy(targetPosition);
    this.target.y += 1.4;

    const rotatedOffset = this.offset.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), targetYaw + Math.PI);
    const desired = targetPosition.clone().add(rotatedOffset);

    const smooth = 1 - Math.exp(-dt * 6);
    this.camera.position.lerp(desired, smooth);
    this.camera.lookAt(this.target);
  }
}

