import type { BunWS, Color } from '../types';
import {
  rooms,
  challenges,
  resolveRejoinToken,
  issueRejoinToken,
  fourPlayerLobbies,
  fourPlayerReconnectTimeouts
} from '../state';
import { ABANDON_TIMEOUT_MS } from '../config';
import { cancelAbandonCheck, scheduleAbandonCheck } from '../bullmq/queues';
import { send, removeFromQueues } from '../utils/socket';
import { sendToUser } from '../utils/routing';
import { broadcastClock } from '../utils/clock';
import { clearRateLimit } from '../utils/rateLimit';
import { logger } from '../utils/logger';
import { handleResign } from './game';
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

  await cancelAbandonCheck(playerId);

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

  const opponentUserId = isWhite ? room.blackUserId : room.whiteUserId;
  if (opponentUserId) {
    await sendToUser(opponentUserId, { type: 'opponent_reconnected' });
  }

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
      if (ws.data.color === 'white') room.whiteDisconnectedAt = disconnectedAt;
      else room.blackDisconnectedAt = disconnectedAt;

      const opponentUserId =
        ws.data.color === 'white' ? room.blackUserId : room.whiteUserId;
      if (opponentUserId) {
        await sendToUser(opponentUserId, {
          type: 'opponent_disconnected',
          disconnectedAt
        });
      }

      const color: Color = ws.data.color ?? 'white';
      await scheduleAbandonCheck(ws.data.id, ws.data.roomId, color);
    }
  }
  logger.info('player_disconnected', { playerId: ws.data.id.slice(0, 8) });
}
export { handleResign };
