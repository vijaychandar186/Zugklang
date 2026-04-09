import type { BunWS, Color } from '../types';
import {
  rooms,
  challenges,
  resolveRejoinToken,
  issueRejoinToken,
  revokeRoomTokens,
  reconnectTimeouts,
  fourPlayerLobbies,
  fourPlayerReconnectTimeouts
} from '../state';
import { ABANDON_TIMEOUT_MS } from '../config';
import { cancelAbandonCheck, scheduleAbandonCheck } from '../bullmq/queues';
import { send, removeFromQueues } from '../utils/socket';
import { broadcastClock, stopRoomClock } from '../utils/clock';
import { clearRateLimit } from '../utils/rateLimit';
import { logger } from '../utils/logger';
import { handleResign, enqueueGameEnd } from './game';
import { leaveFourPlayerLobby } from './fourPlayer';
import { POD_ID } from '../redis';

export async function handleRejoinRoom(
  ws: BunWS,
  msg: {
    roomId: string;
    rejoinToken: string;
  }
): Promise<void> {
  const { roomId, rejoinToken } = msg;

  const tokenData = await resolveRejoinToken(rejoinToken);
  if (!tokenData) {
    send(ws, { type: 'rejoin_failed', reason: 'invalid_token' });
    return;
  }

  const { playerId, podId } = tokenData;

  if (podId !== POD_ID) {
    const { redis } = await import('../redis');
    const ownerPodUrl = await redis.get(`pod:url:${podId}`);
    send(ws, {
      type: 'rejoin_failed',
      reason: 'wrong_pod',
      ...(ownerPodUrl ? { wsPodUrl: ownerPodUrl } : {})
    });
    return;
  }

  const room = rooms.get(roomId);
  if (!room || room.status === 'ended') {
    send(ws, { type: 'rejoin_failed', reason: 'game_over' });
    return;
  }

  const isWhite = room.whiteSessionId === playerId;
  const isBlack = room.blackSessionId === playerId;
  if (!isWhite && !isBlack) {
    send(ws, { type: 'rejoin_failed', reason: 'not_in_room' });
    return;
  }

  // Cancel any local reconnect timeout
  const localTimeout = reconnectTimeouts.get(playerId);
  if (localTimeout) {
    clearTimeout(localTimeout);
    reconnectTimeouts.delete(playerId);
  }
  // Also cancel BullMQ job (no-op if none scheduled)
  void cancelAbandonCheck(playerId);

  const color: Color = isWhite ? 'white' : 'black';
  ws.data.id = playerId;
  ws.data.color = color;
  ws.data.roomId = roomId;
  if (isWhite) {
    room.white = ws;
    room.whiteDisconnectedAt = null;
  } else {
    room.black = ws;
    room.blackDisconnectedAt = null;
  }

  // Notify opponent directly via room WS reference
  const opponentWs = isWhite ? room.black : room.white;
  send(opponentWs, { type: 'opponent_reconnected' });

  const newToken = await issueRejoinToken(playerId, roomId);
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
    whiteUserId: room.whiteUserId,
    blackUserId: room.blackUserId,
    whiteDisplayName: room.whiteDisplayName,
    blackDisplayName: room.blackDisplayName,
    whiteImage: room.whiteImage,
    blackImage: room.blackImage,
    abortStartedAt: room.abortTimerStartedAt,
    opponentDisconnectedAt: isWhite
      ? room.blackDisconnectedAt
      : room.whiteDisconnectedAt
  });
  await broadcastClock(room);
  logger.info('player_rejoined', { roomId: roomId.slice(0, 8), color });
}

export async function handleDisconnect(ws: BunWS): Promise<void> {
  const fourPlayerLobbyId = ws.data.fourPlayerLobbyId;
  if (fourPlayerLobbyId) {
    const lobby = fourPlayerLobbies.get(fourPlayerLobbyId);
    if (lobby?.started) {
      const playerId = ws.data.id;
      const existing = fourPlayerReconnectTimeouts.get(playerId);
      if (existing) clearTimeout(existing);
      for (const player of lobby.players) {
        if (player.data.id !== playerId) {
          send(player, { type: 'four_player_player_disconnected', playerId });
        }
      }
      const timeout = setTimeout(() => {
        fourPlayerReconnectTimeouts.delete(playerId);
        leaveFourPlayerLobby(ws);
      }, ABANDON_TIMEOUT_MS);
      fourPlayerReconnectTimeouts.set(playerId, timeout);
    } else {
      leaveFourPlayerLobby(ws);
    }
  }

  await removeFromQueues(ws);
  clearRateLimit(ws.data.id);

  if (ws.data.challengeId) {
    challenges.delete(ws.data.challengeId);
    const { redis } = await import('../redis');
    await redis.del(`challenge:${ws.data.challengeId}`);
    delete ws.data.challengeId;
  }

  if (ws.data.roomId) {
    const room = rooms.get(ws.data.roomId);
    if (room?.status === 'active') {
      const disconnectedAt = Date.now();
      const color: Color = ws.data.color ?? 'white';
      if (color === 'white') room.whiteDisconnectedAt = disconnectedAt;
      else room.blackDisconnectedAt = disconnectedAt;

      // Notify opponent directly via room WS reference
      const opponentWs = color === 'white' ? room.black : room.white;
      send(opponentWs, { type: 'opponent_disconnected', disconnectedAt });

      const roomId = ws.data.roomId;
      const playerId = ws.data.id;

      // Local abandon timeout — cancellable on rejoin, fires synchronously in tests
      const abandonTimeout = globalThis.setTimeout(() => {
        reconnectTimeouts.delete(playerId);
        const r = rooms.get(roomId);
        if (!r || r.status !== 'active') return;
        const stillDisconnected =
          color === 'white'
            ? r.whiteDisconnectedAt !== null
            : r.blackDisconnectedAt !== null;
        if (!stillDisconnected) return;

        r.status = 'ended';
        stopRoomClock(r);
        const isWhite = color === 'white';
        const winner = isWhite ? 'Black' : 'White';
        const gameOverPayload = {
          type: 'game_over',
          result: `${winner} wins — opponent abandoned`,
          reason: 'abandoned',
          winner: winner.toLowerCase(),
          whiteUserId: r.whiteUserId,
          blackUserId: r.blackUserId
        };
        const remainingWs = isWhite ? r.black : r.white;
        send(remainingWs, gameOverPayload);
        void revokeRoomTokens(r);
        void enqueueGameEnd(
          r,
          winner.toLowerCase() as 'white' | 'black',
          'abandoned'
        );
        logger.info('player_abandoned', {
          roomId: roomId.slice(0, 8),
          playerId: playerId.slice(0, 8),
          color
        });
      }, ABANDON_TIMEOUT_MS);
      reconnectTimeouts.set(playerId, abandonTimeout);

      // Also schedule BullMQ job for multi-pod durability
      void scheduleAbandonCheck(playerId, roomId, color);
    }
  }
  logger.info('player_disconnected', { playerId: ws.data.id.slice(0, 8) });
}
export { handleResign };
