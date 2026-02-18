import type { BunWS, TimeControl, Room } from '../types';
import { queues, rooms, issueRejoinToken } from '../state';
import { send, removeFromQueues } from '../utils/socket';
import { getStartingFen } from '../utils/fen';
import { logger } from '../utils/logger';
import { handleResign } from './game';

function timeControlKey(tc: TimeControl): string {
  return `${tc.mode}:${String(tc.minutes)}:${String(tc.increment)}`;
}

export function createRoom(
  white: BunWS,
  black: BunWS,
  variant: string,
  timeControl: TimeControl
): void {
  const roomId = crypto.randomUUID();
  const startingFen = getStartingFen(variant);

  white.data.color = 'white';
  white.data.roomId = roomId;
  black.data.color = 'black';
  black.data.roomId = roomId;

  const room: Room = {
    id: roomId,
    white,
    black,
    variant,
    timeControl,
    startingFen,
    moves: [],
    drawOfferedBy: null,
    status: 'active',
    createdAt: Date.now()
  };

  rooms.set(roomId, room);

  const whiteToken = issueRejoinToken(white.data.id);
  const blackToken = issueRejoinToken(black.data.id);

  send(white, {
    type: 'matched',
    roomId,
    color: 'white',
    variant,
    timeControl,
    startingFen,
    rejoinToken: whiteToken
  });
  send(black, {
    type: 'matched',
    roomId,
    color: 'black',
    variant,
    timeControl,
    startingFen,
    rejoinToken: blackToken
  });

  logger.info('room_created', {
    roomId: roomId.slice(0, 8),
    white: white.data.id.slice(0, 8),
    black: black.data.id.slice(0, 8),
    variant
  });
}

function matchPlayers(
  playerA: BunWS,
  playerB: BunWS,
  variant: string,
  timeControl: TimeControl
): void {
  const [white, black] =
    Math.random() < 0.5 ? [playerA, playerB] : [playerB, playerA];
  createRoom(white, black, variant, timeControl);
}

export function handleJoinQueue(
  ws: BunWS,
  msg: { variant?: string; timeControl?: TimeControl }
): void {
  const variant = msg.variant ?? 'standard';
  const timeControl: TimeControl = msg.timeControl ?? {
    mode: 'unlimited',
    minutes: 0,
    increment: 0
  };

  removeFromQueues(ws);

  if (ws.data.roomId) {
    const room = rooms.get(ws.data.roomId);
    if (room?.status === 'active') handleResign(ws);
    delete ws.data.roomId;
  }

  ws.data.variant = variant;

  const queueKey = `${variant}:${timeControlKey(timeControl)}`;

  let queue = queues.get(queueKey);
  if (!queue) {
    queue = [];
    queues.set(queueKey, queue);
  }

  const opponent = queue.shift();
  if (opponent) {
    matchPlayers(ws, opponent, variant, timeControl);
  } else {
    queue.push(ws);
    send(ws, { type: 'waiting' });
  }
}

export function handleLeaveQueue(ws: BunWS): void {
  removeFromQueues(ws);
  send(ws, { type: 'queue_left' });
}
