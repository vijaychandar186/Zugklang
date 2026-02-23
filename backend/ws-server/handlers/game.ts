import type { BunWS } from '../types';
import { rooms, revokeRoomTokens } from '../state';
import { send, getOpponent, isInRoom } from '../utils/socket';
import { applyMove } from '../utils/chess';
import {
  broadcastClock,
  projectClock,
  settleActiveClock,
  stopRoomClock
} from '../utils/clock';
import { logger } from '../utils/logger';
import { createRoom } from './queue';
import { ABORT_TIMEOUT_MS } from '../config';
export function handleMove(
  ws: BunWS,
  msg: {
    from: string;
    to: string;
    promotion?: string | undefined;
  }
): void {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room || room.status === 'ended') return;
  if (!isInRoom(room, ws)) return;
  if (room.position.turn !== ws.data.color) {
    send(ws, { type: 'error', message: 'Not your turn.' });
    return;
  }
  const { from, to, promotion } = msg;
  const legal = applyMove(room.position, from, to, promotion);
  if (!legal) {
    send(ws, { type: 'error', message: 'Illegal move.' });
    return;
  }
  room.moves.push(`${from}${to}${promotion ?? ''}`);
  if (room.activeClock !== null) {
    settleActiveClock(room);
    const snapshot = projectClock(room);
    const timedOut =
      (snapshot.activeClock === 'white' && snapshot.whiteTimeMs === 0) ||
      (snapshot.activeClock === 'black' && snapshot.blackTimeMs === 0);
    if (timedOut) {
      room.status = 'ended';
      stopRoomClock(room);
      revokeRoomTokens(room);
      const timedOutColor = snapshot.activeClock!;
      const winner = timedOutColor === 'white' ? 'Black' : 'White';
      const payload = {
        type: 'game_over',
        result: `${winner} wins on time`,
        reason: 'timeout',
        winner: winner.toLowerCase(),
        whiteUserId: room.white.data.userId ?? null,
        blackUserId: room.black.data.userId ?? null
      };
      send(room.white, payload);
      send(room.black, payload);
      logger.info('game_timeout', {
        roomId: roomId.slice(0, 8),
        timedOutColor
      });
      return;
    }
  }
  send(getOpponent(room, ws), { type: 'opponent_move', from, to, promotion });
  if (room.activeClock !== null) {
    const movedColor = ws.data.color!;
    if (movedColor === 'white' && room.whiteTimeMs !== null) {
      room.whiteTimeMs += room.timeControl.increment * 1000;
    } else if (movedColor === 'black' && room.blackTimeMs !== null) {
      room.blackTimeMs += room.timeControl.increment * 1000;
    }
    room.activeClock = movedColor === 'white' ? 'black' : 'white';
    room.clockLastUpdatedAt = Date.now();
    broadcastClock(room);
  }
  if (room.moves.length === 1) {
    if (room.abortTimer !== null) clearTimeout(room.abortTimer);
    const abortNow = Date.now();
    room.abortTimerStartedAt = abortNow;
    room.abortTimer = setTimeout(() => {
      const r = rooms.get(roomId!);
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
        roomId: roomId!.slice(0, 8),
        moves: r.moves.length
      });
    }, ABORT_TIMEOUT_MS);
    send(room.white, { type: 'abort_window', startedAt: abortNow });
    send(room.black, { type: 'abort_window', startedAt: abortNow });
  } else if (room.moves.length === 2) {
    if (room.abortTimer !== null) {
      clearTimeout(room.abortTimer);
      room.abortTimer = null;
    }
    room.abortTimerStartedAt = null;
  }
}
export function handleResign(ws: BunWS): void {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room || room.status === 'ended') return;
  if (room.abortTimer !== null) {
    clearTimeout(room.abortTimer);
    room.abortTimer = null;
  }
  room.status = 'ended';
  stopRoomClock(room);
  revokeRoomTokens(room);
  const isWhite = room.white.data.id === ws.data.id;
  const winner = isWhite ? 'Black' : 'White';
  const payload = {
    type: 'game_over',
    result: `${winner} wins by resignation`,
    reason: 'resign',
    winner: winner.toLowerCase(),
    whiteUserId: room.white.data.userId ?? null,
    blackUserId: room.black.data.userId ?? null
  };
  send(room.white, payload);
  send(room.black, payload);
  logger.info('game_resign', {
    roomId: roomId.slice(0, 8),
    resignedColor: isWhite ? 'white' : 'black'
  });
}
export function handleOfferDraw(ws: BunWS): void {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room || room.status === 'ended') return;
  room.drawOfferedBy = ws.data.color ?? null;
  send(getOpponent(room, ws), { type: 'draw_offered' });
}
export function handleAcceptDraw(ws: BunWS): void {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room || room.status === 'ended' || !room.drawOfferedBy) return;
  if (room.drawOfferedBy === ws.data.color) return;
  if (room.abortTimer !== null) {
    clearTimeout(room.abortTimer);
    room.abortTimer = null;
  }
  room.status = 'ended';
  stopRoomClock(room);
  revokeRoomTokens(room);
  const payload = {
    type: 'game_over',
    result: 'Draw by agreement',
    reason: 'draw_agreement',
    whiteUserId: room.white.data.userId ?? null,
    blackUserId: room.black.data.userId ?? null
  };
  send(room.white, payload);
  send(room.black, payload);
  logger.info('game_draw', { roomId: roomId.slice(0, 8) });
}
export function handleDeclineDraw(ws: BunWS): void {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room) return;
  room.drawOfferedBy = null;
  send(getOpponent(room, ws), { type: 'draw_declined' });
}
export function handleAbort(ws: BunWS): void {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room || room.status === 'ended') return;
  // Abort is only valid during the opening window before each side has moved.
  if (room.moves.length >= 2) {
    handleResign(ws);
    return;
  }
  if (room.abortTimer !== null) {
    clearTimeout(room.abortTimer);
    room.abortTimer = null;
  }
  room.status = 'ended';
  stopRoomClock(room);
  revokeRoomTokens(room);
  const payload = {
    type: 'game_over',
    result: 'Game Aborted',
    reason: 'abort',
    whiteUserId: room.white.data.userId ?? null,
    blackUserId: room.black.data.userId ?? null
  };
  send(room.white, payload);
  send(room.black, payload);
  logger.info('game_aborted', { roomId: roomId.slice(0, 8) });
}
export function handleOfferRematch(ws: BunWS): void {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room || room.status !== 'ended') return;
  if (!isInRoom(room, ws)) return;
  const opponent = getOpponent(room, ws);
  if (opponent.data.roomId !== roomId) return;
  room.rematchOfferedBy = ws.data.id;
  send(opponent, { type: 'rematch_offered' });
}
export function handleAcceptRematch(ws: BunWS): void {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room || room.status !== 'ended') return;
  if (!room.rematchOfferedBy || room.rematchOfferedBy === ws.data.id) return;
  const [newWhite, newBlack] =
    room.white.data.id === ws.data.id
      ? [room.white, room.black]
      : [room.black, room.white];
  createRoom(newWhite, newBlack, room.variant, room.timeControl);
}
export function handleDeclineRematch(ws: BunWS): void {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room || room.status !== 'ended') return;
  room.rematchOfferedBy = null;
  send(getOpponent(room, ws), { type: 'rematch_declined' });
}
export function handleGameOverNotify(
  ws: BunWS,
  msg: {
    result: string;
    reason: string;
  }
): void {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room || room.status === 'ended') return;
  if (room.abortTimer !== null) {
    clearTimeout(room.abortTimer);
    room.abortTimer = null;
  }
  room.status = 'ended';
  stopRoomClock(room);
  revokeRoomTokens(room);
  const gameOverPayload = {
    type: 'game_over',
    result: msg.result,
    reason: msg.reason,
    whiteUserId: room.white.data.userId ?? null,
    blackUserId: room.black.data.userId ?? null
  };
  send(getOpponent(room, ws), gameOverPayload);
  send(ws, gameOverPayload);
  logger.info('game_over', {
    roomId: roomId.slice(0, 8),
    result: msg.result,
    reason: msg.reason
  });
}
