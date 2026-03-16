import fs from 'fs';
import http from 'http';
import path from 'path';
import express, { Request, Response } from 'express';
import { Server } from 'socket.io';
import { Events } from './events';
import { createRoom, getRoomBySocket, getRoomSnapshot, joinRoom, leaveRoom, updatePlayerState } from './rooms';
import { isMoveValid } from './validation/movementValidation';

const DEFAULT_PORT = 3001;

const getCorsOrigin = () => {
  const raw = process.env.CLIENT_ORIGIN;
  if (!raw) return '*';
  const list = raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return list.length > 0 ? list : '*';
};

export const createGameServer = (port = DEFAULT_PORT) => {
  const app = express();
  const server = http.createServer(app);
  const corsOrigin = getCorsOrigin();
  const clientDist = path.resolve(__dirname, '..', '..', 'client', 'dist');
  const hasClientBuild = fs.existsSync(path.join(clientDist, 'index.html'));

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ ok: true });
  });

  if (hasClientBuild) {
    app.use(express.static(clientDist));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  }

  const io = new Server(server, {
    cors: {
      origin: corsOrigin,
      methods: ['GET', 'POST'],
      credentials: false
    }
  });

  io.on('connection', (socket) => {
    socket.on(Events.ROOM_CREATE, () => {
      const { room, player } = createRoom(socket.id);
      socket.join(room.code);
      socket.emit(Events.ROOM_CREATED, { room: getRoomSnapshot(room), player });
      io.to(room.code).emit(Events.ROOM_UPDATE, getRoomSnapshot(room));
    });

    socket.on(Events.ROOM_JOIN, (code: string) => {
      const result = joinRoom(code, socket.id);
      if (!result) {
        socket.emit(Events.ROOM_JOINED, { ok: false, reason: 'ROOM_NOT_FOUND_OR_FULL' });
        return;
      }

      const { room, player } = result;
      socket.join(room.code);
      socket.emit(Events.ROOM_JOINED, { ok: true, room: getRoomSnapshot(room), player });
      io.to(room.code).emit(Events.ROOM_UPDATE, getRoomSnapshot(room));
    });

    socket.on(Events.GAME_START, () => {
      const { room, roomCode } = getRoomBySocket(socket.id);
      if (!room || !roomCode) return;
      if (room.players.size < 2 || room.started) return;

      room.started = true;
      io.to(roomCode).emit(Events.ROOM_UPDATE, getRoomSnapshot(room));

      for (const player of room.players.values()) {
        io.to(roomCode).emit(Events.PLAYER_SPAWN, player);
      }
    });

    socket.on(Events.PLAYER_MOVE, (payload) => {
      const { room, roomCode } = getRoomBySocket(socket.id);
      if (!room || !roomCode) return;
      if (!payload || !payload.position || !payload.rotation) return;

      if (!isMoveValid(payload.position)) return;

      const updated = updatePlayerState(room, socket.id, {
        position: payload.position,
        rotation: payload.rotation,
        isMoving: Boolean(payload.isMoving),
        isJumping: Boolean(payload.isJumping)
      });

      if (!updated) return;

      socket.to(roomCode).emit(Events.PLAYER_UPDATE, updated);
    });

    socket.on('disconnect', () => {
      const { room, roomCode } = leaveRoom(socket.id);
      if (!roomCode) return;

      socket.to(roomCode).emit(Events.PLAYER_DISCONNECTED, { id: socket.id });
      if (room) {
        io.to(roomCode).emit(Events.ROOM_UPDATE, getRoomSnapshot(room));
      }
    });
  });

  server.listen(port, () => {
    console.log(`[server] listening on ${port}`);
  });

  return io;
};
