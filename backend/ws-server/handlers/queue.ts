import type { BunWS, TimeControl, Room } from '../types';
import { queues, rooms, issueRejoinToken, revokeRoomTokens } from '../state';
import { send, removeFromQueues } from '../utils/socket';
import { broadcastClock, startRoomClock, stopRoomClock } from '../utils/clock';
import { getStartingFen } from '../utils/fen';
import { buildPosition } from '../utils/chess';
import { logger } from '../utils/logger';
import { handleResign } from './game';
import { ABORT_TIMEOUT_MS } from '../config';
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
    abortTimer: null,
    abortTimerStartedAt: null,
    whiteDisconnectedAt: null,
    blackDisconnectedAt: null,
    whiteLatencyMs: null,
    blackLatencyMs: null,
    whiteDisplayName: white.data.displayName ?? null,
    blackDisplayName: black.data.displayName ?? null,
    whiteImage: white.data.userImage ?? null,
    blackImage: black.data.userImage ?? null,
    whiteTimeMs:
      timeControl.mode === 'unlimited' ? null : timeControl.minutes * 60 * 1000,
    blackTimeMs:
      timeControl.mode === 'unlimited' ? null : timeControl.minutes * 60 * 1000,
    activeClock: timeControl.mode === 'unlimited' ? null : 'white',
    clockLastUpdatedAt: timeControl.mode === 'unlimited' ? null : Date.now(),
    clockInterval: null
  };
  rooms.set(roomId, room);
  room.abortTimerStartedAt = Date.now();
  room.abortTimer = setTimeout(() => {
    const r = rooms.get(roomId);
    if (!r || r.status === 'ended') return;
    r.abortTimer = null;
    r.abortTimerStartedAt = null;
    r.status = 'ended';
    stopRoomClock(r);
    revokeRoomTokens(r);
    const abandonedColor = r.position.turn;
    const winner = abandonedColor === 'white' ? 'Black' : 'White';
    const payload = {
      type: 'game_over',
      result: `${winner} wins — opponent abandoned`,
      reason: 'abandoned',
      winner: winner.toLowerCase(),
      whiteUserId: r.white.data.userId ?? null,
      blackUserId: r.black.data.userId ?? null
    };
    send(r.white, payload);
    send(r.black, payload);
    logger.info('game_auto_aborted', {
      roomId: roomId.slice(0, 8),
      moves: r.moves.length
    });
  }, ABORT_TIMEOUT_MS);
  const whiteToken = issueRejoinToken(white.data.id);
  const blackToken = issueRejoinToken(black.data.id);
  const whiteUserId = white.data.userId ?? null;
  const blackUserId = black.data.userId ?? null;
  const {
    whiteDisplayName,
    blackDisplayName,
    whiteImage,
    blackImage,
    abortTimerStartedAt
  } = room;
  send(white, {
    type: 'matched',
    roomId,
    color: 'white',
    variant,
    timeControl,
    startingFen,
    rejoinToken: whiteToken,
    whiteUserId,
    blackUserId,
    whiteDisplayName,
    blackDisplayName,
    whiteImage,
    blackImage,
    abortStartedAt: abortTimerStartedAt
  });
  send(black, {
    type: 'matched',
    roomId,
    color: 'black',
    variant,
    timeControl,
    startingFen,
    rejoinToken: blackToken,
    whiteUserId,
    blackUserId,
    whiteDisplayName,
    blackDisplayName,
    whiteImage,
    blackImage,
    abortStartedAt: abortTimerStartedAt
  });
  // Anchor both clients on the exact same initial clock snapshot immediately.
  broadcastClock(room);
  startRoomClock(room, (timedOutColor) => {
    const r = rooms.get(roomId);
    if (!r || r.status === 'ended') return;
    r.status = 'ended';
    if (r.abortTimer !== null) {
      clearTimeout(r.abortTimer);
      r.abortTimer = null;
    }
    stopRoomClock(r);
    revokeRoomTokens(r);
    const winner = timedOutColor === 'white' ? 'Black' : 'White';
    const payload = {
      type: 'game_over',
      result: `${winner} wins on time`,
      reason: 'timeout',
      winner: winner.toLowerCase(),
      whiteUserId: r.white.data.userId ?? null,
      blackUserId: r.black.data.userId ?? null
    };
    send(r.white, payload);
    send(r.black, payload);
    logger.info('game_timeout', {
      roomId: roomId.slice(0, 8),
      timedOutColor
    });
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
  if (
    playerA.data.userId &&
    playerB.data.userId &&
    playerA.data.userId === playerB.data.userId
  ) {
    logger.warn('same_user_match_blocked', {
      userId: playerA.data.userId.slice(0, 8)
    });
    const queueKey = `${variant}:${timeControlKey(timeControl)}`;
    const queue = queues.get(queueKey) ?? [];
    queues.set(queueKey, queue);
    if (!queue.includes(playerA)) queue.push(playerA);
    if (!queue.includes(playerB)) queue.push(playerB);
    send(playerA, { type: 'waiting' });
    send(playerB, { type: 'waiting' });
    return;
  }
  const [white, black] =
    Math.random() < 0.5 ? [playerA, playerB] : [playerB, playerA];
  createRoom(white, black, variant, timeControl);
}
export function handleJoinQueue(
  ws: BunWS,
  msg: {
    variant: string;
    timeControl: TimeControl;
    displayName?: string | undefined;
    userImage?: string | null | undefined;
  }
): void {
  const { variant, timeControl } = msg;
  if (msg.displayName !== undefined) ws.data.displayName = msg.displayName;
  if (msg.userImage !== undefined) ws.data.userImage = msg.userImage;
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
  let opponentIdx = -1;
  for (let i = 0; i < queue.length; i++) {
    const candidate = queue[i];
    if (!candidate) continue;
    if (
      ws.data.userId &&
      candidate.data.userId &&
      ws.data.userId === candidate.data.userId
    ) {
      continue;
    }
    opponentIdx = i;
    break;
  }
  if (opponentIdx >= 0) {
    const opponent = queue.splice(opponentIdx, 1)[0]!;
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
