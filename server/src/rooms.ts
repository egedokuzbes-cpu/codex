import { createRoomState, RoomState } from './roomState';
import { createPlayerState, PlayerInfo, PlayerRole, PlayerState, Vec3 } from './players';

export interface Room {
  code: string;
  players: Map<string, PlayerState>;
  started: boolean;
  state: RoomState;
}

const rooms = new Map<string, Room>();

const ROLE_ORDER: PlayerRole[] = ['operator', 'controller'];

const SPAWNS: Record<PlayerRole, Vec3> = {
  operator: { x: -3, y: 0, z: 0 },
  controller: { x: 3, y: 0, z: 0 }
};

const generateRoomCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

const getNextRole = (room: Room): PlayerRole => {
  const used = new Set(Array.from(room.players.values()).map((player) => player.role));
  for (const role of ROLE_ORDER) {
    if (!used.has(role)) return role;
  }
  return 'operator';
};

export const createRoom = (socketId: string): { room: Room; player: PlayerState } => {
  let code = generateRoomCode();
  while (rooms.has(code)) code = generateRoomCode();

  const room: Room = {
    code,
    players: new Map<string, PlayerState>(),
    started: false,
    state: createRoomState()
  };

  const role = 'operator';
  const player = createPlayerState(socketId, role, SPAWNS[role]);
  room.players.set(socketId, player);
  rooms.set(code, room);

  return { room, player };
};

export const joinRoom = (code: string, socketId: string): { room: Room; player: PlayerState } | null => {
  const room = rooms.get(code);
  if (!room || room.players.size >= 2) return null;

  const role = getNextRole(room);
  const player = createPlayerState(socketId, role, SPAWNS[role]);
  room.players.set(socketId, player);

  return { room, player };
};

export const leaveRoom = (socketId: string): { room: Room | null; roomCode: string | null } => {
  for (const [code, room] of rooms.entries()) {
    if (room.players.has(socketId)) {
      room.players.delete(socketId);
      if (room.players.size === 0) {
        rooms.delete(code);
      }
      return { room, roomCode: code };
    }
  }
  return { room: null, roomCode: null };
};

export const getRoomBySocket = (socketId: string): { room: Room | null; roomCode: string | null } => {
  for (const [code, room] of rooms.entries()) {
    if (room.players.has(socketId)) return { room, roomCode: code };
  }
  return { room: null, roomCode: null };
};

export const getRoomSnapshot = (room: Room) => {
  const players: PlayerInfo[] = Array.from(room.players.values()).map((player) => ({
    id: player.id,
    role: player.role
  }));

  return {
    code: room.code,
    players,
    started: room.started,
    objectiveIndex: room.state.objectiveIndex,
    completed: room.state.completed
  };
};

export const updatePlayerState = (
  room: Room,
  socketId: string,
  partial: Partial<PlayerState>
): PlayerState | null => {
  const existing = room.players.get(socketId);
  if (!existing) return null;

  const updated: PlayerState = {
    ...existing,
    ...partial,
    position: partial.position ?? existing.position,
    rotation: partial.rotation ?? existing.rotation
  };

  room.players.set(socketId, updated);
  return updated;
};

export const getSpawnForRole = (role: PlayerRole): Vec3 => ({ ...SPAWNS[role] });

