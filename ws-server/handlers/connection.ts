import type { BunWS, Color } from '../types';
import {
  rooms,
  challenges,
  reconnectTimeouts,
  rejoinTokens,
  issueRejoinToken,
  revokeRoomTokens
} from '../state';
import { send, removeFromQueues, getOpponent } from '../utils/socket';
import { clearRateLimit } from '../utils/rateLimit';
import { logger } from '../utils/logger';
import { handleResign } from './game';

export function handleRejoinRoom(
  ws: BunWS,
  msg: { roomId: string; rejoinToken: string }
): void {
  const { roomId, rejoinToken } = msg;

  const playerId = rejoinTokens.get(rejoinToken);
  if (!playerId) {
    send(ws, { type: 'rejoin_failed', reason: 'invalid_token' });
    return;
  }

  const room = rooms.get(roomId);
  if (!room || room.status === 'ended') {
    send(ws, { type: 'rejoin_failed', reason: 'game_over' });
    return;
  }

  const isWhite = room.white.data.id === playerId;
  const isBlack = room.black.data.id === playerId;
  if (!isWhite && !isBlack) {
    send(ws, { type: 'rejoin_failed', reason: 'not_in_room' });
    return;
  }

  // Consume the token immediately — prevents replay
  rejoinTokens.delete(rejoinToken);

  // Adopt the canonical player ID so room slot checks and reconnect-timeout
  // lookups remain consistent across multiple refresh cycles.
  ws.data.id = playerId;

  const timer = reconnectTimeouts.get(playerId);
  if (timer) {
    clearTimeout(timer);
    reconnectTimeouts.delete(playerId);
  }

  const color: Color = isWhite ? 'white' : 'black';
  ws.data.color = color;
  ws.data.roomId = roomId;
  if (isWhite) room.white = ws;
  else room.black = ws;

  const opponent = isWhite ? room.black : room.white;
  send(opponent, { type: 'opponent_reconnected' });

  // Issue a fresh token for the next potential disconnect
  const newToken = issueRejoinToken(playerId);

  send(ws, {
    type: 'rejoined',
    roomId,
    color,
    variant: room.variant,
    timeControl: room.timeControl,
    startingFen: room.startingFen,
    moves: room.moves,
    rejoinToken: newToken
  });

  logger.info('player_rejoined', { roomId: roomId.slice(0, 8), color });
}

export function handleDisconnect(ws: BunWS): void {
  removeFromQueues(ws);
  clearRateLimit(ws.data.id);

  if (ws.data.challengeId) {
    challenges.delete(ws.data.challengeId);
    delete ws.data.challengeId;
  }

  if (ws.data.roomId) {
    const room = rooms.get(ws.data.roomId);
    if (room?.status === 'active') {
      // Clear auto-abort timer immediately — the reconnect window takes over;
      // if the player doesn't return in time, the result is "abandoned" (win),
      // not "aborted".
      if (room.abortTimer !== null) {
        clearTimeout(room.abortTimer);
        room.abortTimer = null;
      }

      send(getOpponent(room, ws), { type: 'opponent_disconnected' });

      const playerId = ws.data.id;
      const roomId = ws.data.roomId;
      const color: Color = ws.data.color ?? 'white';
      const timeout = setTimeout(() => {
        reconnectTimeouts.delete(playerId);
        const r = rooms.get(roomId);
        if (r?.status === 'active') {
          r.status = 'ended';
          revokeRoomTokens(r);
          const isWhite = color === 'white';
          const winner = isWhite ? 'Black' : 'White';
          const remaining = isWhite ? r.black : r.white;
          send(remaining, {
            type: 'game_over',
            result: `${winner} wins — opponent abandoned`,
            reason: 'abandoned'
          });
          logger.info('player_abandoned', {
            roomId: roomId.slice(0, 8),
            color,
            winner
          });
        }
      }, 30_000);
      reconnectTimeouts.set(playerId, timeout);
    }
  }

  logger.info('player_disconnected', { playerId: ws.data.id.slice(0, 8) });
}

export { handleResign };
