import type { BunWS, TimeControl, Room } from '../types';
import {
  rooms,
  connectedUserIds,
  issueRejoinToken,
  revokeRoomTokens
} from '../state';
import { send, removeFromQueues } from '../utils/socket';
import { sendToUser } from '../utils/routing';
import { broadcastClock, startRoomClock, stopRoomClock } from '../utils/clock';
import { getStartingFen } from '../utils/fen';
import { buildPosition } from '../utils/chess';
import { logger } from '../utils/logger';
import { handleResign } from './game';
import { redis, POD_ID, POD_URL } from '../redis';
import {
  ELO_QUEUE_ENABLED,
  RATING_BAND_BASE,
  RATING_BAND_EXPAND_PER_SEC,
  ROOM_TTL_SEC,
  QUEUE_PLAYER_TTL_SEC
} from '../config';
import { scheduleAbortCheck } from '../bullmq/queues';

interface QueuedPlayerData {
  userId: string;
  sessionId: string;
  rating: number;
  queuedAt: number;
  podId: string;
  displayName: string;
  userImage: string;
}

interface RedisQueueEntry {
  userId: string;
  sessionId: string;
  rating: string;
  queuedAt: string;
  podId: string;
  displayName: string;
  userImage: string;
}

function ratingBand(queuedAt: number): number {
  const secsWaiting = (Date.now() - queuedAt) / 1000;
  return RATING_BAND_BASE + RATING_BAND_EXPAND_PER_SEC * secsWaiting;
}

function eloCompatible(
  myRating: number,
  myQueuedAt: number,
  theirRating: number,
  theirQueuedAt: number
): boolean {
  if (!ELO_QUEUE_ENABLED) return true;
  const bandA = ratingBand(myQueuedAt);
  const bandB = ratingBand(theirQueuedAt);
  const effectiveBand = Math.max(bandA, bandB);
  return Math.abs(myRating - theirRating) <= effectiveBand;
}

function timeControlKey(tc: TimeControl): string {
  return `${tc.mode}:${String(tc.minutes)}:${String(tc.increment)}`;
}

export async function persistRoom(room: Room): Promise<void> {
  const key = `room:${room.id}`;
  await redis.hset(key, {
    status: room.status,
    variant: room.variant,
    timeControl: JSON.stringify(room.timeControl),
    startingFen: room.startingFen,
    moves: JSON.stringify(room.moves),
    whiteUserId: room.whiteUserId ?? '',
    blackUserId: room.blackUserId ?? '',
    whiteSessionId: room.whiteSessionId,
    blackSessionId: room.blackSessionId,
    whiteRating: String(room.whiteRating ?? ''),
    blackRating: String(room.blackRating ?? ''),
    whiteDisplayName: room.whiteDisplayName ?? '',
    blackDisplayName: room.blackDisplayName ?? '',
    whiteImage: room.whiteImage ?? '',
    blackImage: room.blackImage ?? '',
    whiteTimeMs: String(room.whiteTimeMs ?? ''),
    blackTimeMs: String(room.blackTimeMs ?? ''),
    activeClock: room.activeClock ?? '',
    clockLastUpdatedAt: String(room.clockLastUpdatedAt ?? ''),
    createdAt: String(room.createdAt)
  });
  await Promise.all([
    redis.expire(key, ROOM_TTL_SEC),
    redis.set(`room:${room.id}:pod`, POD_ID, 'EX', ROOM_TTL_SEC)
  ]);
}

export async function createRoom(
  white: BunWS,
  black: BunWS,
  variant: string,
  timeControl: TimeControl
): Promise<void> {
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
    whiteUserId: white.data.userId ?? null,
    blackUserId: black.data.userId ?? null,
    whiteSessionId: white.data.id,
    blackSessionId: black.data.id,
    whiteRating: white.data.rating ?? null,
    blackRating: black.data.rating ?? null,
    variant,
    timeControl,
    startingFen,
    moves: [],
    position: buildPosition(variant, startingFen),
    drawOfferedBy: null,
    rematchOfferedBy: null,
    status: 'active',
    createdAt: Date.now(),
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
    clockInterval: null,
    moveTimesWhiteMs: [],
    moveTimesBlackMs: []
  };
  rooms.set(roomId, room);

  await persistRoom(room);

  room.abortTimerStartedAt = Date.now();
  await scheduleAbortCheck(roomId, 1);

  const [whiteToken, blackToken] = await Promise.all([
    issueRejoinToken(white.data.id, roomId),
    issueRejoinToken(black.data.id, roomId)
  ]);

  const {
    whiteUserId,
    blackUserId,
    whiteDisplayName,
    blackDisplayName,
    whiteImage,
    blackImage,
    abortTimerStartedAt
  } = room;

  const baseMatched = {
    type: 'matched',
    roomId,
    variant,
    timeControl,
    startingFen,
    whiteUserId,
    blackUserId,
    whiteDisplayName,
    blackDisplayName,
    whiteImage,
    blackImage,
    abortStartedAt: abortTimerStartedAt,
    ...(POD_URL ? { wsPodUrl: POD_URL } : {})
  };

  await Promise.all([
    white.data.userId
      ? sendToUser(white.data.userId, {
          ...baseMatched,
          color: 'white',
          rejoinToken: whiteToken
        })
      : Promise.resolve(),
    black.data.userId
      ? sendToUser(black.data.userId, {
          ...baseMatched,
          color: 'black',
          rejoinToken: blackToken
        })
      : Promise.resolve()
  ]);

  await broadcastClock(room);
  startRoomClock(room, (timedOutColor) => {
    const r = rooms.get(roomId);
    if (!r || r.status === 'ended') return;
    r.status = 'ended';
    stopRoomClock(r);
    void revokeRoomTokens(r);
    const winner = timedOutColor === 'white' ? 'Black' : 'White';
    const payload = {
      type: 'game_over',
      result: `${winner} wins on time`,
      reason: 'timeout',
      winner: winner.toLowerCase(),
      whiteUserId: r.whiteUserId,
      blackUserId: r.blackUserId
    };
    if (r.whiteUserId) void sendToUser(r.whiteUserId, payload);
    if (r.blackUserId) void sendToUser(r.blackUserId, payload);
    logger.info('game_timeout', { roomId: roomId.slice(0, 8), timedOutColor });
  });
  logger.info('room_created', {
    roomId: roomId.slice(0, 8),
    white: white.data.id.slice(0, 8),
    black: black.data.id.slice(0, 8),
    variant
  });
}

async function matchPlayers(
  playerA: BunWS,
  playerAData: QueuedPlayerData,
  playerB: BunWS,
  playerBData: QueuedPlayerData,
  variant: string,
  timeControl: TimeControl
): Promise<void> {
  if (
    playerAData.userId &&
    playerBData.userId &&
    playerAData.userId === playerBData.userId
  ) {
    logger.warn('same_user_match_blocked', {
      userId: playerAData.userId.slice(0, 8)
    });
    const queueKey = `queue:${variant}:${timeControlKey(timeControl)}`;
    await Promise.all([
      redis.zadd(queueKey, playerAData.queuedAt, playerAData.userId),
      redis.zadd(queueKey, playerBData.queuedAt, playerBData.userId)
    ]);
    send(playerA, { type: 'waiting' });
    send(playerB, { type: 'waiting' });
    return;
  }
  const [white, black] =
    Math.random() < 0.5 ? [playerA, playerB] : [playerB, playerA];
  await createRoom(white, black, variant, timeControl);
}

export async function handleJoinQueue(
  ws: BunWS,
  msg: {
    variant: string;
    timeControl: TimeControl;
    displayName?: string | undefined;
    userImage?: string | null | undefined;
    rating?: number | undefined;
  }
): Promise<void> {
  const { variant, timeControl } = msg;
  if (msg.displayName !== undefined) ws.data.displayName = msg.displayName;
  if (msg.userImage !== undefined) ws.data.userImage = msg.userImage;
  ws.data.rating = msg.rating ?? 700;
  ws.data.queuedAt = Date.now();

  await removeFromQueues(ws);

  if (ws.data.roomId) {
    const room = rooms.get(ws.data.roomId);
    if (room?.status === 'active') await handleResign(ws);
    delete ws.data.roomId;
  }

  ws.data.variant = variant;
  const queueKey = `queue:${variant}:${timeControlKey(timeControl)}`;
  ws.data.queueKey = queueKey;

  const myUserId = ws.data.userId;
  if (!myUserId) {
    send(ws, { type: 'error', message: 'Not authenticated.' });
    return;
  }

  const myData: QueuedPlayerData = {
    userId: myUserId,
    sessionId: ws.data.id,
    rating: ws.data.rating,
    queuedAt: ws.data.queuedAt,
    podId: POD_ID,
    displayName: ws.data.displayName ?? '',
    userImage: ws.data.userImage ?? ''
  };

  await redis.hset(
    `queue:player:${myUserId}`,
    myData as unknown as Record<string, string>
  );
  await redis.expire(`queue:player:${myUserId}`, QUEUE_PLAYER_TTL_SEC);

  const candidates = await redis.zrange(queueKey, 0, -1);
  let matched = false;

  for (const candidateUserId of candidates) {
    if (candidateUserId === myUserId) continue;

    const raw = (await redis.hgetall(
      `queue:player:${candidateUserId}`
    )) as unknown as RedisQueueEntry | null;
    if (!raw || !raw.userId) continue;

    const candidateData: QueuedPlayerData = {
      userId: raw.userId,
      sessionId: raw.sessionId,
      rating: Number(raw.rating),
      queuedAt: Number(raw.queuedAt),
      podId: raw.podId,
      displayName: raw.displayName,
      userImage: raw.userImage
    };

    if (candidateData.userId === myUserId) continue;
    if (
      !eloCompatible(
        myData.rating,
        myData.queuedAt,
        candidateData.rating,
        candidateData.queuedAt
      )
    ) {
      continue;
    }

    const claimed = await redis.zrem(queueKey, candidateUserId);
    if (claimed === 0) continue;

    await redis.del(`queue:player:${candidateUserId}`);

    if (candidateData.podId === POD_ID) {
      const opponentWs = connectedUserIds.get(candidateUserId);
      const opponentReady =
        opponentWs &&
        opponentWs.readyState === WebSocket.OPEN &&
        opponentWs.data.queueKey === queueKey &&
        !opponentWs.data.roomId;
      if (!opponentReady) {
        logger.warn('queue_candidate_stale_local', {
          candidateUserId: candidateUserId.slice(0, 8),
          queueKey
        });
        continue;
      }
      delete ws.data.queueKey;
      await matchPlayers(
        ws,
        myData,
        opponentWs,
        candidateData,
        variant,
        timeControl
      );
    } else {
      delete ws.data.queueKey;
      await redis.publish(
        `ws:pod:${candidateData.podId}:in`,
        JSON.stringify({
          type: 'pod_matched',
          initiatorUserId: myUserId,
          initiatorPodId: POD_ID,
          opponentUserId: candidateUserId,
          variant,
          timeControl,
          initiatorData: myData,
          opponentData: candidateData
        })
      );
      send(ws, { type: 'waiting' });
    }

    matched = true;
    break;
  }

  if (!matched) {
    await redis.zadd(queueKey, ws.data.queuedAt, myUserId);
    send(ws, { type: 'waiting' });
  }
}

export async function handleLeaveQueue(ws: BunWS): Promise<void> {
  await removeFromQueues(ws);
  send(ws, { type: 'queue_left' });
}
