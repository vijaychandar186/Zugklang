import type { BunWS } from '../types';
import { rooms, revokeRoomTokens } from '../state';
import { send, getOpponent, isInRoom } from '../utils/socket';
import { isValidSquare, isValidPromotion } from '../utils/validate';
import { logger } from '../utils/logger';

export function handleMove(
  ws: BunWS,
  msg: { from?: string; to?: string; promotion?: string }
): void {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room || room.status === 'ended') return;
  if (!isInRoom(room, ws)) return;

  const { from, to, promotion } = msg;
  if (!isValidSquare(from) || !isValidSquare(to)) return;
  if (promotion !== undefined && !isValidPromotion(promotion)) return;

  room.moves.push(`${from}${to}${promotion ?? ''}`);
  send(getOpponent(room, ws), { type: 'opponent_move', from, to, promotion });
}

export function handleResign(ws: BunWS): void {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room || room.status === 'ended') return;

  room.status = 'ended';
  revokeRoomTokens(room);
  const isWhite = room.white.data.id === ws.data.id;
  const winner = isWhite ? 'Black' : 'White';

  const payload = {
    type: 'game_over',
    result: `${winner} wins by resignation`,
    reason: 'resign',
    winner: winner.toLowerCase()
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

  room.status = 'ended';
  revokeRoomTokens(room);
  const payload = {
    type: 'game_over',
    result: 'Draw by agreement',
    reason: 'draw_agreement'
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

  room.status = 'ended';
  revokeRoomTokens(room);
  const payload = {
    type: 'game_over',
    result: 'Game Aborted',
    reason: 'abort'
  };
  send(room.white, payload);
  send(room.black, payload);

  logger.info('game_aborted', { roomId: roomId.slice(0, 8) });
}

export function handleGameOverNotify(
  ws: BunWS,
  msg: { result?: string; reason?: string }
): void {
  const roomId = ws.data.roomId;
  if (!roomId) return;
  const room = rooms.get(roomId);
  if (!room || room.status === 'ended') return;

  room.status = 'ended';
  revokeRoomTokens(room);
  send(getOpponent(room, ws), {
    type: 'game_over',
    result: msg.result ?? 'Game over',
    reason: msg.reason ?? 'unknown'
  });

  logger.info('game_over', {
    roomId: roomId.slice(0, 8),
    result: msg.result ?? 'unknown',
    reason: msg.reason ?? 'unknown'
  });
}
