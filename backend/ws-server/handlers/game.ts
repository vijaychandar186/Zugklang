import type { BunWS } from '../types';
import { rooms, revokeRoomTokens } from '../state';
import { send, getOpponent, isInRoom } from '../utils/socket';
import { applyMove } from '../utils/chess';
import { logger } from '../utils/logger';
import { createRoom } from './queue';
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
  send(getOpponent(room, ws), { type: 'opponent_move', from, to, promotion });
  if (room.moves.length === 1) {
    if (room.abortTimer !== null) clearTimeout(room.abortTimer);
    room.abortTimer = setTimeout(() => {
      const r = rooms.get(roomId!);
      if (!r || r.status === 'ended') return;
      r.abortTimer = null;
      r.status = 'ended';
      revokeRoomTokens(r);
      const payload = {
        type: 'game_over',
        result: 'Game Aborted',
        reason: 'abort',
        whiteUserId: r.white.data.userId ?? null,
        blackUserId: r.black.data.userId ?? null
      };
      send(r.white, payload);
      send(r.black, payload);
      logger.info('game_auto_aborted', {
        roomId: roomId!.slice(0, 8),
        moves: r.moves.length
      });
    }, 60000);
  } else if (room.moves.length === 2) {
    if (room.abortTimer !== null) {
      clearTimeout(room.abortTimer);
      room.abortTimer = null;
    }
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
  if (room.abortTimer !== null) {
    clearTimeout(room.abortTimer);
    room.abortTimer = null;
  }
  room.status = 'ended';
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
