import type * as THREE from 'three';

export type PlayerRole = 'operator' | 'controller';

export interface PlayerState {
  id: string;
  role: PlayerRole;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  isMoving: boolean;
  isJumping: boolean;
}

