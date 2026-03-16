import * as THREE from 'three';
import { lerp } from '../utils/math';
import type { PlayerRole } from './playerState';

const ROLE_COLORS: Record<PlayerRole, number> = {
  operator: 0xf59f28,
  controller: 0x4ea6ff
};

export class RemotePlayer {
  mesh: THREE.Mesh;
  private targetPosition = new THREE.Vector3();
  private targetYaw = 0;

  constructor(role: PlayerRole, spawn: THREE.Vector3) {
    const geometry = new THREE.CapsuleGeometry(0.45, 1.1, 4, 8);
    const material = new THREE.MeshStandardMaterial({
      color: ROLE_COLORS[role],
      roughness: 0.4,
      metalness: 0.12
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(spawn);
    this.targetPosition.copy(spawn);
  }

  applyNetworkState(position: THREE.Vector3, yaw: number) {
    this.targetPosition.copy(position);
    this.targetYaw = yaw;
  }

  update(dt: number) {
    const t = 1 - Math.exp(-dt * 10);
    this.mesh.position.lerp(this.targetPosition, t);
    this.mesh.rotation.y = lerp(this.mesh.rotation.y, this.targetYaw, t);
  }
}

