import { RoomState } from '../roomState';

const OPEN_DURATION_MS = 5000;

export const activateDoorPanel = (state: RoomState, now: number): void => {
  state.doorPanel.panelActive = true;
  state.doorPanel.doorOpen = true;
  state.doorPanel.lastOpenedAt = now;
};

export const tickDoorPanel = (state: RoomState, now: number): boolean => {
  if (!state.doorPanel.doorOpen || state.doorPanel.lastOpenedAt === null) return false;
  if (now - state.doorPanel.lastOpenedAt >= OPEN_DURATION_MS) {
    state.doorPanel.doorOpen = false;
    state.doorPanel.panelActive = false;
    state.doorPanel.lastOpenedAt = null;
    return true;
  }
  return false;
};

