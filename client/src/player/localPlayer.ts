import * as THREE from 'three';
import { Input } from '../core/input';
import { PlayerController } from './playerController';
import type { PlayerRole, PlayerState } from './playerState';

const ROLE_COLORS: Record<PlayerRole, number> = {
  operator: 0xf59f28,
  controller: 0x4ea6ff
};

export class LocalPlayer {
  mesh: THREE.Mesh;
  state: PlayerState;
  private controller = new PlayerController();

  constructor(id: string, role: PlayerRole, spawn: THREE.Vector3) {
    const geometry = new THREE.CapsuleGeometry(0.45, 1.1, 4, 8);
    const material = new THREE.MeshStandardMaterial({
      color: ROLE_COLORS[role],
      roughness: 0.35,
      metalness: 0.15
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.copy(spawn);
    this.mesh.castShadow = false;

    this.state = {
      id,
      role,
      position: spawn.clone(),
      rotation: new THREE.Euler(0, 0, 0),
      isMoving: false,
      isJumping: false
    };
  }

  update(dt: number, input: Input) {
    const result = this.controller.update(dt, input, this.mesh.position);
    this.mesh.rotation.y = result.yaw;

    this.state.position.copy(this.mesh.position);
    this.state.rotation.set(0, result.yaw, 0);
    this.state.isMoving = result.isMoving;
    this.state.isJumping = result.isJumping;

    return this.state;
  }
}

