import type { BunWS, Color } from '../types';
import {
  rooms,
  challenges,
  reconnectTimeouts,
  rejoinTokens,
  issueRejoinToken,
  revokeRoomTokens,
  fourPlayerLobbies,
  fourPlayerReconnectTimeouts
} from '../state';
import { send, removeFromQueues, getOpponent } from '../utils/socket';
import { broadcastClock, stopRoomClock } from '../utils/clock';
import { clearRateLimit } from '../utils/rateLimit';
import { logger } from '../utils/logger';
import { handleResign } from './game';
import { ABANDON_TIMEOUT_MS } from '../config';
import { leaveFourPlayerLobby } from './fourPlayer';
export function handleRejoinRoom(
  ws: BunWS,
  msg: {
    roomId: string;
    rejoinToken: string;
  }
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
  rejoinTokens.delete(rejoinToken);
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
  if (isWhite) room.whiteDisconnectedAt = null;
  else room.blackDisconnectedAt = null;
  const opponent = isWhite ? room.black : room.white;
  send(opponent, { type: 'opponent_reconnected' });
  const newToken = issueRejoinToken(playerId);
  send(ws, {
    type: 'rejoined',
    roomId,
    color,
    variant: room.variant,
    timeControl: room.timeControl,
    startingFen: room.startingFen,
    moves: room.moves,
    rejoinToken: newToken,
    opponentLatencyMs: isWhite ? room.blackLatencyMs : room.whiteLatencyMs,
    whiteUserId: room.white.data.userId ?? null,
    blackUserId: room.black.data.userId ?? null,
    whiteDisplayName: room.whiteDisplayName,
    blackDisplayName: room.blackDisplayName,
    whiteImage: room.whiteImage,
    blackImage: room.blackImage,
    abortStartedAt: room.abortTimerStartedAt,
    opponentDisconnectedAt: isWhite
      ? room.blackDisconnectedAt
      : room.whiteDisconnectedAt
  });
  broadcastClock(room);
  logger.info('player_rejoined', { roomId: roomId.slice(0, 8), color });
}
export function handleDisconnect(ws: BunWS): void {
  // Handle 4-player lobby: give a grace period to reconnect if the game has started
  const fourPlayerLobbyId = ws.data.fourPlayerLobbyId;
  if (fourPlayerLobbyId) {
    const lobby = fourPlayerLobbies.get(fourPlayerLobbyId);
    if (lobby?.started) {
      const playerId = ws.data.id;
      // Cancel any existing reconnect timeout for this player
      const existing = fourPlayerReconnectTimeouts.get(playerId);
      if (existing) clearTimeout(existing);
      // Notify other connected players that this player disconnected
      for (const player of lobby.players) {
        if (player.data.id !== playerId) {
          send(player, { type: 'four_player_player_disconnected', playerId });
        }
      }
      // Set abandon timeout — if they don't rejoin in time, remove them
      const timeout = setTimeout(() => {
        fourPlayerReconnectTimeouts.delete(playerId);
        leaveFourPlayerLobby(ws);
      }, ABANDON_TIMEOUT_MS);
      fourPlayerReconnectTimeouts.set(playerId, timeout);
    } else {
      leaveFourPlayerLobby(ws);
    }
  }
  removeFromQueues(ws);
  clearRateLimit(ws.data.id);
  if (ws.data.challengeId) {
    challenges.delete(ws.data.challengeId);
    delete ws.data.challengeId;
  }
  if (ws.data.roomId) {
    const room = rooms.get(ws.data.roomId);
    if (room?.status === 'active') {
      if (room.abortTimer !== null) {
        clearTimeout(room.abortTimer);
        room.abortTimer = null;
      }
      const disconnectedAt = Date.now();
      if (ws.data.color === 'white') room.whiteDisconnectedAt = disconnectedAt;
      else room.blackDisconnectedAt = disconnectedAt;
      send(getOpponent(room, ws), {
        type: 'opponent_disconnected',
        disconnectedAt
      });
      const playerId = ws.data.id;
      const roomId = ws.data.roomId;
      const color: Color = ws.data.color ?? 'white';
      const timeout = setTimeout(() => {
        reconnectTimeouts.delete(playerId);
        const r = rooms.get(roomId);
        if (r?.status === 'active') {
          r.status = 'ended';
          stopRoomClock(r);
          revokeRoomTokens(r);
          const isWhite = color === 'white';
          const winner = isWhite ? 'Black' : 'White';
          const remaining = isWhite ? r.black : r.white;
          send(remaining, {
            type: 'game_over',
            result: `${winner} wins — opponent abandoned`,
            reason: 'abandoned',
            whiteUserId: r.white.data.userId ?? null,
            blackUserId: r.black.data.userId ?? null
          });
          logger.info('player_abandoned', {
            roomId: roomId.slice(0, 8),
            color,
            winner
          });
        }
      }, ABANDON_TIMEOUT_MS);
      reconnectTimeouts.set(playerId, timeout);
    }
  }
  logger.info('player_disconnected', { playerId: ws.data.id.slice(0, 8) });
}
export { handleResign };
