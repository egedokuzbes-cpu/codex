import { io, Socket } from 'socket.io-client';
import { Events } from './networkEvents';
import { SERVER_URL } from '../utils/constants';

export type PlayerRole = 'operator' | 'controller';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface PlayerState {
  id: string;
  role: PlayerRole;
  position: Vec3;
  rotation: Vec3;
  isMoving: boolean;
  isJumping: boolean;
}

export interface RoomSnapshot {
  code: string;
  players: Array<{ id: string; role: PlayerRole }>;
  started: boolean;
  objectiveIndex: number;
  completed: boolean;
}

type RoomCreatedPayload = { room: RoomSnapshot; player: PlayerState };
type RoomJoinedPayload = { ok: true; room: RoomSnapshot; player: PlayerState } | { ok: false; reason: string };

export class NetworkClient {
  private socket: Socket;

  private onRoomCreatedHandlers: Array<(payload: RoomCreatedPayload) => void> = [];
  private onRoomJoinedHandlers: Array<(payload: RoomJoinedPayload) => void> = [];
  private onRoomUpdateHandlers: Array<(payload: RoomSnapshot) => void> = [];
  private onPlayerSpawnHandlers: Array<(payload: PlayerState) => void> = [];
  private onPlayerUpdateHandlers: Array<(payload: PlayerState) => void> = [];
  private onPlayerDisconnectedHandlers: Array<(payload: { id: string }) => void> = [];
  private onConnectHandlers: Array<() => void> = [];
  private onDisconnectHandlers: Array<() => void> = [];

  constructor() {
    this.socket = io(SERVER_URL, { transports: ['websocket'] });

    this.socket.on('connect', () => this.onConnectHandlers.forEach((cb) => cb()));
    this.socket.on('disconnect', () => this.onDisconnectHandlers.forEach((cb) => cb()));

    this.socket.on(Events.ROOM_CREATED, (payload: RoomCreatedPayload) => {
      this.onRoomCreatedHandlers.forEach((cb) => cb(payload));
    });

    this.socket.on(Events.ROOM_JOINED, (payload: RoomJoinedPayload) => {
      this.onRoomJoinedHandlers.forEach((cb) => cb(payload));
    });

    this.socket.on(Events.ROOM_UPDATE, (payload: RoomSnapshot) => {
      this.onRoomUpdateHandlers.forEach((cb) => cb(payload));
    });

    this.socket.on(Events.PLAYER_SPAWN, (payload: PlayerState) => {
      this.onPlayerSpawnHandlers.forEach((cb) => cb(payload));
    });

    this.socket.on(Events.PLAYER_UPDATE, (payload: PlayerState) => {
      this.onPlayerUpdateHandlers.forEach((cb) => cb(payload));
    });

    this.socket.on(Events.PLAYER_DISCONNECTED, (payload: { id: string }) => {
      this.onPlayerDisconnectedHandlers.forEach((cb) => cb(payload));
    });
  }

  get id() {
    return this.socket.id;
  }

  onRoomCreated(handler: (payload: RoomCreatedPayload) => void) {
    this.onRoomCreatedHandlers.push(handler);
  }

  onRoomJoined(handler: (payload: RoomJoinedPayload) => void) {
    this.onRoomJoinedHandlers.push(handler);
  }

  onRoomUpdate(handler: (payload: RoomSnapshot) => void) {
    this.onRoomUpdateHandlers.push(handler);
  }

  onPlayerSpawn(handler: (payload: PlayerState) => void) {
    this.onPlayerSpawnHandlers.push(handler);
  }

  onPlayerUpdate(handler: (payload: PlayerState) => void) {
    this.onPlayerUpdateHandlers.push(handler);
  }

  onPlayerDisconnected(handler: (payload: { id: string }) => void) {
    this.onPlayerDisconnectedHandlers.push(handler);
  }

  onConnect(handler: () => void) {
    this.onConnectHandlers.push(handler);
  }

  onDisconnect(handler: () => void) {
    this.onDisconnectHandlers.push(handler);
  }

  createRoom() {
    this.socket.emit(Events.ROOM_CREATE);
  }

  joinRoom(code: string) {
    this.socket.emit(Events.ROOM_JOIN, code.trim().toUpperCase());
  }

  startGame() {
    this.socket.emit(Events.GAME_START);
  }

  sendPlayerMove(payload: Omit<PlayerState, 'id' | 'role'>) {
    this.socket.emit(Events.PLAYER_MOVE, payload);
  }
}

