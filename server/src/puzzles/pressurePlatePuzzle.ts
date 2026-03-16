import { RoomState } from '../roomState';

export const setPlateActive = (state: RoomState, plateId: 'A' | 'B', active: boolean): void => {
  if (plateId === 'A') state.pressurePlates.plateAActive = active;
  if (plateId === 'B') state.pressurePlates.plateBActive = active;

  if (state.pressurePlates.plateAActive && state.pressurePlates.plateBActive) {
    state.pressurePlates.solved = true;
  }
};

