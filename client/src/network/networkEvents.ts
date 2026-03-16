export const Events = {
  ROOM_CREATE: 'room:create',
  ROOM_CREATED: 'room:created',
  ROOM_JOIN: 'room:join',
  ROOM_JOINED: 'room:joined',
  ROOM_UPDATE: 'room:update',
  GAME_START: 'game:start',
  PLAYER_SPAWN: 'player:spawn',
  PLAYER_MOVE: 'player:move',
  PLAYER_UPDATE: 'player:update',
  PLAYER_DISCONNECTED: 'player:disconnected',
  PLAYER_INTERACT: 'player:interact',
  OBJECT_PICKUP: 'object:pickup',
  OBJECT_DROP: 'object:drop',
  DOOR_UPDATE: 'door:update',
  PANEL_UPDATE: 'panel:update',
  PUZZLE_UPDATE: 'puzzle:update',
  OBJECTIVE_UPDATE: 'objective:update',
  GAME_COMPLETE: 'game:complete'
} as const;

export type EventKey = keyof typeof Events;
export type EventName = (typeof Events)[EventKey];

