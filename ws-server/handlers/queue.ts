import type { BunWS, TimeControl, Room } from '../types';
import { queues, rooms, issueRejoinToken, revokeRoomTokens } from '../state';
import { send, removeFromQueues } from '../utils/socket';
import { getStartingFen } from '../utils/fen';
import { buildPosition } from '../utils/chess';
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
    position: buildPosition(variant, startingFen),
    drawOfferedBy: null,
    rematchOfferedBy: null,
    status: 'active',
    createdAt: Date.now(),
    abortTimer: null
  };

  rooms.set(roomId, room);

  // Auto-abort if white hasn't moved within 1 minute
  room.abortTimer = setTimeout(() => {
    const r = rooms.get(roomId);
    if (!r || r.status === 'ended') return;
    r.abortTimer = null;
    r.status = 'ended';
    revokeRoomTokens(r);
    const payload = {
      type: 'game_over',
      result: 'Game Aborted',
      reason: 'abort'
    };
    send(r.white, payload);
    send(r.black, payload);
    logger.info('game_auto_aborted', {
      roomId: roomId.slice(0, 8),
      moves: r.moves.length
    });
  }, 60_000);

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
  msg: { variant: string; timeControl: TimeControl }
): void {
  const { variant, timeControl } = msg;

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
