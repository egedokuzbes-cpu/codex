import { RoomState } from '../roomState';

export const pickupCube = (state: RoomState, playerId: string): boolean => {
  if (state.energyCube.placed || state.energyCube.heldBy) return false;
  state.energyCube.heldBy = playerId;
  return true;
};

export const dropCube = (state: RoomState, playerId: string): void => {
  if (state.energyCube.heldBy === playerId) {
    state.energyCube.heldBy = null;
  }
};

export const placeCube = (state: RoomState, playerId: string): boolean => {
  if (state.energyCube.heldBy !== playerId) return false;
  state.energyCube.heldBy = null;
  state.energyCube.placed = true;
  return true;
};

