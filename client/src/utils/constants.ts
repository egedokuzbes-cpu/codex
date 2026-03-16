export const SERVER_URL =
  (import.meta.env.VITE_SERVER_URL as string | undefined) || window.location.origin;

export const NETWORK_RATE = 15;

export const WORLD_BOUNDS = {
  minX: -18,
  maxX: 18,
  minZ: -18,
  maxZ: 18,
  minY: 0,
  maxY: 6
};

export const PLAYER_SPEED = 5;
export const PLAYER_RUN_SPEED = 7.5;
export const JUMP_VELOCITY = 7;
export const GRAVITY = 18;

