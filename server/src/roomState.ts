export interface DoorPanelState {
  doorOpen: boolean;
  panelActive: boolean;
  lastOpenedAt: number | null;
}

export interface PressurePlateState {
  plateAActive: boolean;
  plateBActive: boolean;
  solved: boolean;
}

export interface EnergyCubeState {
  heldBy: string | null;
  placed: boolean;
}

export interface RoomState {
  objectiveIndex: number;
  doorPanel: DoorPanelState;
  pressurePlates: PressurePlateState;
  energyCube: EnergyCubeState;
  completed: boolean;
}

export const createRoomState = (): RoomState => ({
  objectiveIndex: 0,
  doorPanel: {
    doorOpen: false,
    panelActive: false,
    lastOpenedAt: null
  },
  pressurePlates: {
    plateAActive: false,
    plateBActive: false,
    solved: false
  },
  energyCube: {
    heldBy: null,
    placed: false
  },
  completed: false
});

