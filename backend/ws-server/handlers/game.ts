import type { BunWS, Room } from '../types';
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
import { ABORT_TIMEOUT_MS, ANTI_CHEAT_URL } from '../config';

function bothPlayersMovedAtLeastOnce(moves: string[]): boolean {
  return moves.length >= 2;
}

/**
 * Fire-and-forget POST to the anti-cheat server with completed game data.
 * Skips silently when ANTI_CHEAT_URL is unset or the game is too short.
 */
function postGameToAntiCheat(
  room: Room,
  winner: 'white' | 'black' | 'draw'
): void {
  if (!ANTI_CHEAT_URL) return;
  if (!room.white.data.userId && !room.black.data.userId) return;
  if (room.moveTimesWhiteMs.length < 2) return;

  const payload = {
    game_id: room.id,
    variant: room.variant,
    time_control_minutes: room.timeControl.minutes,
    time_control_increment: room.timeControl.increment,
    moves: room.moves,
    move_times_white_ms: room.moveTimesWhiteMs,
    move_times_black_ms: room.moveTimesBlackMs,
    white_user_id: room.white.data.userId ?? null,
    black_user_id: room.black.data.userId ?? null,
    white_rating: room.white.data.rating ?? null,
    black_rating: room.black.data.rating ?? null,
    result: winner,
    played_at: new Date().toISOString()
  };

  fetch(`${ANTI_CHEAT_URL}/game`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch((err: unknown) => {
    logger.warn('anti_cheat_post_failed', { error: String(err) });
  });
}

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
  const movedColor = ws.data.color!;
  const { from, to, promotion } = msg;
  const legal = applyMove(room.position, from, to, promotion);
  if (!legal) {
    send(ws, { type: 'error', message: 'Illegal move.' });
    return;
  }
  const uci = `${from}${to}${promotion ?? ''}`;
  room.moves.push(uci);

  // Record how long this player spent on the move (timed and unlimited games).
  const now = Date.now();
  const moveStart = room.clockLastUpdatedAt ?? room.createdAt;
  const elapsedMs = Math.max(0, now - moveStart);
  if (movedColor === 'white') {
    room.moveTimesWhiteMs.push(elapsedMs);
  } else {
    room.moveTimesBlackMs.push(elapsedMs);
  }
  if (room.activeClock !== null) {
    settleActiveClock(room, now);
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
      postGameToAntiCheat(room, winner.toLowerCase() as 'white' | 'black');
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
  const positionSync = { type: 'position_sync', moves: [...room.moves] };
  send(room.white, positionSync);
  send(room.black, positionSync);
  if (room.activeClock !== null) {
    if (movedColor === 'white' && room.whiteTimeMs !== null) {
      room.whiteTimeMs += room.timeControl.increment * 1000;
    } else if (movedColor === 'black' && room.blackTimeMs !== null) {
      room.blackTimeMs += room.timeControl.increment * 1000;
    }
    room.activeClock = movedColor === 'white' ? 'black' : 'white';
    room.clockLastUpdatedAt = now;
    broadcastClock(room);
  } else {
    // Track move timestamp for unlimited games (used by anti-cheat).
    room.clockLastUpdatedAt = now;
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
  postGameToAntiCheat(room, winner.toLowerCase() as 'white' | 'black');
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
  postGameToAntiCheat(room, 'draw');
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
  // Abort is only valid before both players have made at least one move.
  if (bothPlayersMovedAtLeastOnce(room.moves)) {
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
  // Derive winner from result string.
  // Handles chess notation ("1-0", "0-1") and natural language ("White wins…").
  const resultLower = msg.result.toLowerCase();
  const winner: 'white' | 'black' | 'draw' =
    msg.result === '1-0' || resultLower.startsWith('white')
      ? 'white'
      : msg.result === '0-1' || resultLower.startsWith('black')
        ? 'black'
        : 'draw';
  postGameToAntiCheat(room, winner);
  send(getOpponent(room, ws), gameOverPayload);
  send(ws, gameOverPayload);
  logger.info('game_over', {
    roomId: roomId.slice(0, 8),
    result: msg.result,
    reason: msg.reason
  });
}
