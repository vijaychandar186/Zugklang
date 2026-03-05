// OTel + Sentry MUST be first — patches internals before any other module loads
import './utils/instrumentation';
import type { SocketData } from './types';
import type { BunWS } from './types';
import { verifyWsToken } from './utils/auth';
import { ClientMessageSchema } from './utils/schemas';
import {
  rooms,
  challenges,
  connectedUserIds,
  fourPlayerLobbies
} from './state';
import { send } from './utils/socket';
import { isRateLimited } from './utils/rateLimit';
import { logger } from './utils/logger';
import { incCounter } from './utils/metrics';
import { handleHttpRequest } from './handlers/http';
import {
  handleJoinQueue,
  handleLeaveQueue,
  createRoom
} from './handlers/queue';
import {
  handleCreateChallenge,
  handleJoinChallenge,
  handleCancelChallenge
} from './handlers/challenge';
import {
  handleMove,
  handleResign,
  handleOfferDraw,
  handleAcceptDraw,
  handleDeclineDraw,
  handleAbort,
  handleGameOverNotify,
  handleOfferRematch,
  handleAcceptRematch,
  handleDeclineRematch
} from './handlers/game';
import { handleRejoinRoom, handleDisconnect } from './handlers/connection';
import {
  handleSyncDice,
  handleSyncCard,
  handleSyncTriDMove
} from './handlers/sync';
import {
  handleCreateFourPlayerLobby,
  handleJoinFourPlayerLobby,
  handleLeaveFourPlayerLobby,
  handleStartFourPlayerLobby,
  handleShuffleFourPlayerLobby,
  handleAssignFourPlayerTeam,
  handleSyncFourPlayerState,
  handleRejoinFourPlayerLobby
} from './handlers/fourPlayer';
import { GC_INTERVAL_MS, GC_ROOM_MAX_AGE_MS } from './config';
import { redis, redisSub, POD_ID, POD_URL } from './redis';
import { sendToUser, relayToRoomPod } from './utils/routing';
import { startWorkers } from './bullmq/worker';

const PORT = parseInt(process.env['PORT'] ?? '8080', 10);
const ALLOWED_ORIGINS =
  process.env['ALLOWED_ORIGINS']
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean) ?? [];
const ENFORCE_WS_ORIGIN_CHECK =
  process.env['WS_ENFORCE_ORIGIN_CHECK'] === 'true' ||
  process.env['NODE_ENV'] === 'production';

function isOriginAllowed(origin: string): boolean {
  // Fail-closed in production: if no origins are configured, deny all.
  if (ALLOWED_ORIGINS.length === 0) {
    return process.env['NODE_ENV'] !== 'production';
  }
  if (ALLOWED_ORIGINS.includes('*')) return true;
  if (ALLOWED_ORIGINS.includes(origin)) return true;

  let originHost = '';
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }

  return ALLOWED_ORIGINS.some((allowed) => {
    if (!allowed.startsWith('*.')) return false;
    const suffix = allowed.slice(2);
    return originHost === suffix || originHost.endsWith(`.${suffix}`);
  });
}

Bun.serve<SocketData>({
  port: PORT,
  async fetch(req, server) {
    const httpResponse = handleHttpRequest(req);
    if (httpResponse) return httpResponse;
    if (ENFORCE_WS_ORIGIN_CHECK) {
      const origin = req.headers.get('origin') ?? '';
      if (!isOriginAllowed(origin)) {
        logger.warn('ws_origin_rejected', {
          origin,
          allowedOriginsCount: ALLOWED_ORIGINS.length
        });
        return new Response('Forbidden', { status: 403 });
      }
    }
    const wsUrl = new URL(req.url, 'http://localhost');
    const token = wsUrl.searchParams.get('token');
    const userId = token ? await verifyWsToken(token) : null;
    if (!userId) {
      logger.warn('ws_auth_rejected', { hasToken: !!token });
      incCounter('ws_auth_failures_total');
      return new Response('Unauthorized', { status: 401 });
    }
    const id = crypto.randomUUID();
    const upgraded = server.upgrade(req, { data: { id, userId } });
    if (upgraded) return undefined;
    return new Response('Zugklang WebSocket Server', { status: 200 });
  },
  websocket: {
    async open(ws: BunWS) {
      let transferredState: 'waiting' | { challengeId: string } | null = null;

      if (ws.data.userId) {
        const existing = connectedUserIds.get(ws.data.userId);
        if (existing && existing !== ws) {
          // Transfer queue state and update session ID in Redis.
          if (existing.data.queueKey) {
            ws.data.queueKey = existing.data.queueKey;
            if (existing.data.variant !== undefined)
              ws.data.variant = existing.data.variant;
            else delete ws.data.variant;
            if (existing.data.rating !== undefined)
              ws.data.rating = existing.data.rating;
            else delete ws.data.rating;
            if (existing.data.queuedAt !== undefined)
              ws.data.queuedAt = existing.data.queuedAt;
            else delete ws.data.queuedAt;
            if (existing.data.displayName !== undefined)
              ws.data.displayName = existing.data.displayName;
            if (existing.data.userImage !== undefined)
              ws.data.userImage = existing.data.userImage;
            await redis.hset(
              `queue:player:${ws.data.userId}`,
              'sessionId',
              ws.data.id
            );
            transferredState = 'waiting';
          }
          if (!transferredState && existing.data.challengeId) {
            const challenge = challenges.get(existing.data.challengeId);
            if (challenge) {
              ws.data.challengeId = existing.data.challengeId;
              if (existing.data.displayName !== undefined)
                ws.data.displayName = existing.data.displayName;
              if (existing.data.userImage !== undefined)
                ws.data.userImage = existing.data.userImage;
              challenge.creator = ws;
              await redis.hset(
                `challenge:${existing.data.challengeId}`,
                'creatorSessionId',
                ws.data.id
              );
              delete existing.data.challengeId;
              transferredState = { challengeId: challenge.id };
            }
          }
          connectedUserIds.set(ws.data.userId, ws);
          existing.close(1000, 'Session superseded');
          logger.info('session_superseded', {
            userId: ws.data.userId.slice(0, 8)
          });
        } else {
          connectedUserIds.set(ws.data.userId, ws);
        }

        // Register player→pod so cross-pod routing works.
        await redis.set(`ws:user:${ws.data.userId}:pod`, POD_ID, 'EX', 86400);
        if (POD_URL) {
          await redis.set(`pod:url:${POD_ID}`, POD_URL, 'EX', 86400);
        }
      }

      logger.info('player_connected', { playerId: ws.data.id.slice(0, 8) });
      send(ws, { type: 'connected', playerId: ws.data.id });
      if (transferredState === 'waiting') {
        send(ws, { type: 'waiting' });
      } else if (transferredState && typeof transferredState === 'object') {
        send(ws, {
          type: 'challenge_created',
          challengeId: transferredState.challengeId
        });
      }
    },

    async message(ws: BunWS, raw: string | Buffer) {
      if (await isRateLimited(ws.data.id)) {
        send(ws, { type: 'error', message: 'Rate limit exceeded.' });
        ws.close(1008, 'Rate limit exceeded');
        return;
      }
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw.toString());
      } catch {
        send(ws, { type: 'error', message: 'Malformed JSON.' });
        return;
      }
      const result = ClientMessageSchema.safeParse(parsed);
      if (!result.success) {
        send(ws, { type: 'error', message: 'Invalid message.' });
        return;
      }
      const msg = result.data;

      // Game messages for rooms on other pods are relayed via Redis pub/sub.
      const gameMessageTypes = new Set([
        'move',
        'abort',
        'resign',
        'offer_draw',
        'accept_draw',
        'decline_draw',
        'game_over_notify',
        'offer_rematch',
        'accept_rematch',
        'decline_rematch',
        'latency_update'
      ]);
      if (
        ws.data.roomId &&
        !rooms.has(ws.data.roomId) &&
        gameMessageTypes.has(msg.type)
      ) {
        await relayToRoomPod(
          ws.data.roomId,
          ws.data.userId ?? '',
          ws.data.id,
          ws.data.color ?? '',
          msg
        );
        return;
      }

      switch (msg.type) {
        case 'join_queue':
          await handleJoinQueue(ws, msg);
          break;
        case 'leave_queue':
          await handleLeaveQueue(ws);
          break;
        case 'move':
          await handleMove(ws, msg);
          break;
        case 'abort':
          await handleAbort(ws);
          break;
        case 'resign':
          await handleResign(ws);
          break;
        case 'offer_draw':
          await handleOfferDraw(ws);
          break;
        case 'accept_draw':
          await handleAcceptDraw(ws);
          break;
        case 'decline_draw':
          await handleDeclineDraw(ws);
          break;
        case 'game_over_notify':
          await handleGameOverNotify(ws, msg);
          break;
        case 'rejoin_room':
          await handleRejoinRoom(ws, msg);
          break;
        case 'create_challenge':
          await handleCreateChallenge(ws, msg);
          break;
        case 'join_challenge':
          await handleJoinChallenge(ws, msg);
          break;
        case 'cancel_challenge':
          await handleCancelChallenge(ws);
          break;
        case 'offer_rematch':
          await handleOfferRematch(ws);
          break;
        case 'accept_rematch':
          await handleAcceptRematch(ws);
          break;
        case 'decline_rematch':
          await handleDeclineRematch(ws);
          break;
        case 'sync_dice':
          handleSyncDice(ws, msg);
          break;
        case 'sync_card':
          handleSyncCard(ws, msg);
          break;
        case 'sync_trid_move':
          handleSyncTriDMove(ws, msg);
          break;
        case 'create_four_player_lobby':
          handleCreateFourPlayerLobby(ws, msg);
          break;
        case 'join_four_player_lobby':
          handleJoinFourPlayerLobby(ws, msg);
          break;
        case 'leave_four_player_lobby':
          handleLeaveFourPlayerLobby(ws, msg);
          break;
        case 'start_four_player_lobby':
          handleStartFourPlayerLobby(ws, msg);
          break;
        case 'shuffle_four_player_lobby':
          handleShuffleFourPlayerLobby(ws, msg);
          break;
        case 'assign_four_player_team':
          handleAssignFourPlayerTeam(ws, msg);
          break;
        case 'sync_four_player_state':
          handleSyncFourPlayerState(ws, msg);
          break;
        case 'rejoin_four_player_lobby':
          handleRejoinFourPlayerLobby(ws, msg);
          break;
        case 'ping':
          send(ws, { type: 'pong' });
          break;
        case 'latency_update': {
          const roomId = ws.data.roomId;
          if (roomId) {
            const room = rooms.get(roomId);
            if (room?.status === 'active') {
              if (ws.data.color === 'white')
                room.whiteLatencyMs = msg.latencyMs;
              else room.blackLatencyMs = msg.latencyMs;
              const opponentUserId =
                ws.data.color === 'white' ? room.blackUserId : room.whiteUserId;
              if (opponentUserId) {
                await sendToUser(opponentUserId, {
                  type: 'opponent_latency',
                  latencyMs: msg.latencyMs
                });
              }
            }
          }
          break;
        }
      }
    },

    async close(ws: BunWS) {
      if (ws.data.userId) {
        const tracked = connectedUserIds.get(ws.data.userId);
        if (tracked === ws) {
          connectedUserIds.delete(ws.data.userId);
          await redis.del(`ws:user:${ws.data.userId}:pod`);
        }
      }
      await handleDisconnect(ws);
    }
  }
});
logger.info('server_started', { port: PORT, podId: POD_ID });

// Start BullMQ workers in-process. They handle post-game jobs (anti-cheat,
// game records) with retries, running as async I/O alongside the WS server.
startWorkers();

// ---------------------------------------------------------------------------
// Subscribe to Redis pub/sub channels:
//   1. analysis:done       – anti-cheat results forwarded to the relevant player
//   2. ws:pod:{POD_ID}:in  – inter-pod messages (direct delivery + game relay)
// ---------------------------------------------------------------------------
redisSub.subscribe('analysis:done', `ws:pod:${POD_ID}:in`, (err, count) => {
  if (err) logger.error('redis_subscribe_error', { error: String(err) });
  else logger.info('redis_subscribed', { channels: count });
});

redisSub.on('message', (channel: string, rawMsg: string) => {
  if (channel === 'analysis:done') {
    try {
      const { username, pred, tc } = JSON.parse(rawMsg) as {
        username: string;
        pred: number;
        tc: number;
      };
      const ws = connectedUserIds.get(username);
      if (ws) ws.send(JSON.stringify({ type: 'analysis_done', pred, tc }));
    } catch {
      logger.warn('redis_message_parse_error', { rawMsg });
    }
    return;
  }

  if (channel === `ws:pod:${POD_ID}:in`) {
    void handlePodMessage(rawMsg);
  }
});

type PodMessage =
  | { type: 'direct'; userId: string; payload: object }
  | {
      type: 'relay';
      roomId: string;
      fromUserId: string;
      fromSessionId: string;
      fromColor: 'white' | 'black';
      payload: Record<string, unknown>;
    }
  | {
      type: 'pod_matched';
      opponentUserId: string;
      initiatorData: {
        userId: string;
        sessionId: string;
        displayName: string;
        userImage: string;
        rating: number;
      };
      variant: string;
      timeControl: import('./types').TimeControl;
    }
  | {
      type: 'pod_challenge_accepted';
      challengeId: string;
      joinerUserId: string;
      joinerSessionId: string;
      joinerDisplayName: string;
      joinerUserImage: string;
    };

/** Dispatch a message received on this pod's inbound pub/sub channel. */
async function handlePodMessage(rawMsg: string): Promise<void> {
  let data: PodMessage;
  try {
    data = JSON.parse(rawMsg) as PodMessage;
  } catch {
    logger.warn('pod_message_parse_error', { rawMsg });
    return;
  }

  switch (data.type) {
    case 'direct': {
      // Forward a JSON payload to a locally-connected user.
      const { userId, payload } = data;
      const ws = connectedUserIds.get(userId);
      if (ws) {
        try {
          ws.send(JSON.stringify(payload));
        } catch {
          void 0;
        }
      }
      break;
    }

    case 'relay': {
      // Cross-pod player sent a game message; process it here (we own the room).
      const { roomId, fromUserId, fromSessionId, fromColor, payload } = data;
      const room = rooms.get(roomId);
      if (!room || room.status === 'ended') break;

      const fakeWs = {
        data: {
          id: fromSessionId,
          userId: fromUserId,
          color: fromColor,
          roomId
        },
        send(msg: string) {
          void sendToUser(fromUserId, JSON.parse(msg) as object);
        },
        close() {}
      } as unknown as BunWS;

      switch (payload['type']) {
        case 'move':
          await handleMove(fakeWs, payload as Parameters<typeof handleMove>[1]);
          break;
        case 'resign':
          await handleResign(fakeWs);
          break;
        case 'abort':
          await handleAbort(fakeWs);
          break;
        case 'offer_draw':
          await handleOfferDraw(fakeWs);
          break;
        case 'accept_draw':
          await handleAcceptDraw(fakeWs);
          break;
        case 'decline_draw':
          await handleDeclineDraw(fakeWs);
          break;
        case 'game_over_notify':
          await handleGameOverNotify(
            fakeWs,
            payload as Parameters<typeof handleGameOverNotify>[1]
          );
          break;
        case 'offer_rematch':
          await handleOfferRematch(fakeWs);
          break;
        case 'accept_rematch':
          await handleAcceptRematch(fakeWs);
          break;
        case 'decline_rematch':
          await handleDeclineRematch(fakeWs);
          break;
      }
      break;
    }

    case 'pod_matched': {
      // Another pod found a match involving one of our locally-connected players.
      const { opponentUserId, initiatorData, variant, timeControl } = data;
      const opponentWs = connectedUserIds.get(opponentUserId);
      if (!opponentWs) break;

      const initiatorIsWhite = Math.random() < 0.5;
      const initiatorPlaceholder = {
        data: {
          id: initiatorData.sessionId,
          userId: initiatorData.userId,
          displayName: initiatorData.displayName,
          userImage: initiatorData.userImage,
          rating: initiatorData.rating
        },
        send() {},
        close() {}
      } as unknown as BunWS;

      const [white, black] = initiatorIsWhite
        ? [initiatorPlaceholder, opponentWs]
        : [opponentWs, initiatorPlaceholder];
      await createRoom(white, black, variant, timeControl);
      break;
    }

    case 'pod_challenge_accepted': {
      // A player on another pod accepted a challenge whose creator is here.
      const {
        challengeId,
        joinerUserId,
        joinerSessionId,
        joinerDisplayName,
        joinerUserImage
      } = data;
      const challenge = challenges.get(challengeId);
      if (!challenge) break;
      challenges.delete(challengeId);
      delete challenge.creator.data.challengeId;

      const joinerPlaceholder = {
        data: {
          id: joinerSessionId,
          userId: joinerUserId,
          displayName: joinerDisplayName,
          userImage: joinerUserImage
        },
        send() {},
        close() {}
      } as unknown as BunWS;

      let white: BunWS, black: BunWS;
      if (challenge.creatorColor === 'white') {
        [white, black] = [challenge.creator, joinerPlaceholder];
      } else if (challenge.creatorColor === 'black') {
        [white, black] = [joinerPlaceholder, challenge.creator];
      } else {
        [white, black] =
          Math.random() < 0.5
            ? [challenge.creator, joinerPlaceholder]
            : [joinerPlaceholder, challenge.creator];
      }
      await createRoom(white, black, challenge.variant, challenge.timeControl);
      break;
    }
  }
}

// ---------------------------------------------------------------------------
// Garbage collection
// ---------------------------------------------------------------------------
setInterval(() => {
  const threshold = Date.now() - GC_ROOM_MAX_AGE_MS;
  let roomsCleaned = 0;
  let challengesCleaned = 0;
  let lobbiesCleaned = 0;
  for (const [id, room] of rooms) {
    if (room.status === 'ended' && room.createdAt < threshold) {
      rooms.delete(id);
      roomsCleaned++;
    }
  }
  for (const [id, challenge] of challenges) {
    if (challenge.createdAt < threshold) {
      challenges.delete(id);
      challengesCleaned++;
    }
  }
  for (const [id, lobby] of fourPlayerLobbies) {
    if (lobby.createdAt < threshold) {
      fourPlayerLobbies.delete(id);
      lobbiesCleaned++;
    }
  }
  if (roomsCleaned > 0 || challengesCleaned > 0 || lobbiesCleaned > 0) {
    logger.info('gc_ran', { roomsCleaned, challengesCleaned, lobbiesCleaned });
  }
}, GC_INTERVAL_MS);
