import type { BunWS, CustomMode } from '../types';
import { customRooms, customQueues } from '../state';
import { send } from '../utils/socket';
import { logger } from '../utils/logger';

function maxPlayersForMode(mode: CustomMode): number {
  return mode === 'four-player' ? 4 : 2;
}

function serializeParticipants(roomId: string) {
  const room = customRooms.get(roomId);
  if (!room) return [];
  return room.participants.map((p) => ({
    playerId: p.data.id,
    userId: p.data.userId ?? null,
    displayName: p.data.displayName ?? null,
    userImage: p.data.userImage ?? null
  }));
}

function broadcastRoomUpdate(roomId: string): void {
  const room = customRooms.get(roomId);
  if (!room) return;
  const payload = {
    type: 'custom_room_update',
    roomId: room.id,
    mode: room.mode,
    hostId: room.hostId,
    players: serializeParticipants(roomId),
    maxPlayers: room.maxPlayers
  };
  for (const participant of room.participants) send(participant, payload);
}

export function handleLeaveCustomQueue(ws: BunWS): void {
  const mode = ws.data.customQueueMode;
  if (!mode) return;
  const queue = customQueues.get(mode) ?? [];
  const idx = queue.findIndex((p) => p.data.id === ws.data.id);
  if (idx !== -1) queue.splice(idx, 1);
  customQueues.set(mode, queue);
  delete ws.data.customQueueMode;
}

export function handleJoinCustomQueue(
  ws: BunWS,
  msg: {
    mode: 'dice-chess' | 'card-chess';
    displayName?: string;
    userImage?: string | null;
  }
): void {
  if (msg.displayName !== undefined) ws.data.displayName = msg.displayName;
  if (msg.userImage !== undefined) ws.data.userImage = msg.userImage;

  if (ws.data.customRoomId) {
    send(ws, { type: 'custom_error', message: 'Already in a room.' });
    return;
  }

  const queue = customQueues.get(msg.mode) ?? [];

  if (queue.some((p) => p.data.id === ws.data.id)) return;

  if (queue.length > 0) {
    const opponent = queue.shift()!;
    customQueues.set(msg.mode, queue);
    delete opponent.data.customQueueMode;

    const roomId = crypto.randomUUID();
    const room = {
      id: roomId,
      mode: msg.mode as CustomMode,
      hostId: opponent.data.id,
      participants: [opponent, ws],
      maxPlayers: 2,
      createdAt: Date.now()
    };
    customRooms.set(roomId, room);
    opponent.data.customRoomId = roomId;
    ws.data.customRoomId = roomId;

    const players = [
      {
        playerId: opponent.data.id,
        userId: opponent.data.userId ?? null,
        displayName: opponent.data.displayName ?? null,
        userImage: opponent.data.userImage ?? null
      },
      {
        playerId: ws.data.id,
        userId: ws.data.userId ?? null,
        displayName: ws.data.displayName ?? null,
        userImage: ws.data.userImage ?? null
      }
    ];

    const payload = {
      type: 'custom_room_created',
      roomId,
      mode: msg.mode,
      hostId: opponent.data.id,
      players,
      maxPlayers: 2
    };

    send(opponent, payload);
    send(ws, payload);
    logger.info('custom_queue_matched', {
      roomId: roomId.slice(0, 8),
      mode: msg.mode
    });
  } else {
    queue.push(ws);
    customQueues.set(msg.mode, queue);
    ws.data.customQueueMode = msg.mode;
    send(ws, { type: 'custom_queue_joined', mode: msg.mode });
    logger.info('custom_queue_waiting', {
      mode: msg.mode,
      queueSize: queue.length
    });
  }
}

export function handleCreateCustomRoom(
  ws: BunWS,
  msg: {
    mode: CustomMode;
    displayName?: string;
    userImage?: string | null;
  }
): void {
  handleLeaveCustomQueue(ws);
  if (msg.displayName !== undefined) ws.data.displayName = msg.displayName;
  if (msg.userImage !== undefined) ws.data.userImage = msg.userImage;
  const roomId = crypto.randomUUID();
  const room = {
    id: roomId,
    mode: msg.mode,
    hostId: ws.data.id,
    participants: [ws],
    maxPlayers: maxPlayersForMode(msg.mode),
    createdAt: Date.now()
  } as const;
  customRooms.set(roomId, { ...room });
  ws.data.customRoomId = roomId;
  send(ws, {
    type: 'custom_room_created',
    roomId,
    mode: room.mode,
    hostId: room.hostId,
    players: serializeParticipants(roomId),
    maxPlayers: room.maxPlayers
  });
  logger.info('custom_room_created', {
    roomId: roomId.slice(0, 8),
    mode: room.mode,
    hostId: room.hostId.slice(0, 8)
  });
}

export function handleJoinCustomRoom(
  ws: BunWS,
  msg: {
    roomId: string;
    displayName?: string;
    userImage?: string | null;
  }
): void {
  handleLeaveCustomQueue(ws);
  if (msg.displayName !== undefined) ws.data.displayName = msg.displayName;
  if (msg.userImage !== undefined) ws.data.userImage = msg.userImage;
  const room = customRooms.get(msg.roomId);
  if (!room) {
    send(ws, { type: 'custom_error', message: 'Room not found.' });
    return;
  }
  if (room.participants.some((p) => p.data.id === ws.data.id)) {
    send(ws, { type: 'custom_joined', roomId: room.id, mode: room.mode });
    return;
  }
  if (room.participants.length >= room.maxPlayers) {
    send(ws, { type: 'custom_error', message: 'Room is full.' });
    return;
  }
  room.participants.push(ws);
  ws.data.customRoomId = room.id;
  send(ws, { type: 'custom_joined', roomId: room.id, mode: room.mode });
  broadcastRoomUpdate(room.id);
  const host = room.participants.find((p) => p.data.id === room.hostId);
  if (host) {
    send(host, {
      type: 'custom_sync_request',
      roomId: room.id,
      requesterId: ws.data.id
    });
  }
}

export function handleLeaveCustomRoom(ws: BunWS): void {
  const roomId = ws.data.customRoomId;
  if (!roomId) return;
  delete ws.data.customRoomId;
  const room = customRooms.get(roomId);
  if (!room) return;
  room.participants = room.participants.filter((p) => p.data.id !== ws.data.id);
  if (room.participants.length === 0) {
    customRooms.delete(roomId);
    return;
  }
  if (room.hostId === ws.data.id) {
    room.hostId = room.participants[0]!.data.id;
  }
  broadcastRoomUpdate(roomId);
}

export function handleCustomState(
  ws: BunWS,
  msg: {
    roomId: string;
    state: unknown;
  }
): void {
  const room = customRooms.get(msg.roomId);
  if (!room) return;
  if (!room.participants.some((p) => p.data.id === ws.data.id)) return;
  for (const participant of room.participants) {
    if (participant.data.id === ws.data.id) continue;
    send(participant, {
      type: 'custom_state',
      roomId: room.id,
      fromPlayerId: ws.data.id,
      state: msg.state
    });
  }
}

export function handleCustomDisconnect(ws: BunWS): void {
  handleLeaveCustomQueue(ws);
  const roomIds = [...customRooms.keys()];
  for (const roomId of roomIds) {
    const room = customRooms.get(roomId);
    if (!room) continue;
    if (!room.participants.some((p) => p.data.id === ws.data.id)) continue;
    handleLeaveCustomRoom(ws);
  }
}
