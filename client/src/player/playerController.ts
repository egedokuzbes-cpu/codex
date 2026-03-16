import * as THREE from 'three';
import { Input } from '../core/input';
import { clamp } from '../utils/math';
import { GRAVITY, JUMP_VELOCITY, PLAYER_RUN_SPEED, PLAYER_SPEED, WORLD_BOUNDS } from '../utils/constants';

export class PlayerController {
  private velocity = new THREE.Vector3();
  private grounded = true;
  private yaw = 0;

  update(dt: number, input: Input, position: THREE.Vector3) {
    const axis = input.getMovementAxis();
    const isMoving = Math.abs(axis.x) > 0.01 || Math.abs(axis.z) > 0.01;

    if (input.isDown('Space') && this.grounded) {
      this.velocity.y = JUMP_VELOCITY;
      this.grounded = false;
    }

    const speed = input.isDown('ShiftLeft') ? PLAYER_RUN_SPEED : PLAYER_SPEED;

    this.velocity.y -= GRAVITY * dt;
    position.y += this.velocity.y * dt;

    if (position.y <= WORLD_BOUNDS.minY) {
      position.y = WORLD_BOUNDS.minY;
      this.velocity.y = 0;
      this.grounded = true;
    }

    if (isMoving) {
      const dir = new THREE.Vector3(axis.x, 0, axis.z).normalize();
      position.addScaledVector(dir, speed * dt);
      this.yaw = Math.atan2(dir.x, dir.z);
    }

    position.x = clamp(position.x, WORLD_BOUNDS.minX, WORLD_BOUNDS.maxX);
    position.z = clamp(position.z, WORLD_BOUNDS.minZ, WORLD_BOUNDS.maxZ);

    return { position, yaw: this.yaw, isMoving, isJumping: !this.grounded };
  }
}

