export type PlayerRole = 'operator' | 'controller';

export type Vec3 = { x: number; y: number; z: number };

export interface PlayerState {
  id: string;
  role: PlayerRole;
  position: Vec3;
  rotation: Vec3;
  isMoving: boolean;
  isJumping: boolean;
}

export interface PlayerInfo {
  id: string;
  role: PlayerRole;
}

export const createPlayerState = (id: string, role: PlayerRole, spawn: Vec3): PlayerState => ({
  id,
  role,
  position: { ...spawn },
  rotation: { x: 0, y: 0, z: 0 },
  isMoving: false,
  isJumping: false
});

