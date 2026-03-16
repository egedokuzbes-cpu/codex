import { Vec3 } from '../players';

const BOUNDS = {
  minX: -18,
  maxX: 18,
  minZ: -18,
  maxZ: 18,
  minY: 0,
  maxY: 6
};

export const isMoveValid = (position: Vec3): boolean => {
  return (
    position.x >= BOUNDS.minX &&
    position.x <= BOUNDS.maxX &&
    position.z >= BOUNDS.minZ &&
    position.z <= BOUNDS.maxZ &&
    position.y >= BOUNDS.minY &&
    position.y <= BOUNDS.maxY
  );
};

