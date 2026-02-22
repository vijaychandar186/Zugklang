import type { SocketData } from './types';
import type { BunWS } from './types';
import { verifyWsToken } from './utils/auth';
import { ClientMessageSchema } from './utils/schemas';
import { rooms, queues, challenges, connectedUserIds } from './state';
import { send } from './utils/socket';
import { isRateLimited } from './utils/rateLimit';
import { logger } from './utils/logger';
import { handleHttpRequest } from './handlers/http';
import { handleJoinQueue, handleLeaveQueue } from './handlers/queue';
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
import { handleSyncDice, handleSyncCard } from './handlers/sync';
import { GC_INTERVAL_MS, GC_ROOM_MAX_AGE_MS } from './config';
const PORT = parseInt(process.env['PORT'] ?? '8080', 10);
const ALLOWED_ORIGINS =
  process.env['ALLOWED_ORIGINS']
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean) ?? [];
Bun.serve<SocketData>({
  port: PORT,
  async fetch(req, server) {
    const httpResponse = handleHttpRequest(req);
    if (httpResponse) return httpResponse;
    if (ALLOWED_ORIGINS.length > 0) {
      const origin = req.headers.get('origin') ?? '';
      if (!ALLOWED_ORIGINS.includes(origin)) {
        logger.warn('ws_origin_rejected', { origin });
        return new Response('Forbidden', { status: 403 });
      }
    }
    const wsUrl = new URL(req.url, 'http://localhost');
    const token = wsUrl.searchParams.get('token');
    const userId = token ? await verifyWsToken(token) : null;
    if (!userId) {
      logger.warn('ws_auth_rejected', { hasToken: !!token });
      return new Response('Unauthorized', { status: 401 });
    }
    const id = crypto.randomUUID();
    const upgraded = server.upgrade(req, { data: { id, userId } });
    if (upgraded) return undefined;
    return new Response('Zugklang WebSocket Server', { status: 200 });
  },
  websocket: {
    open(ws: BunWS) {
      let transferredState:
        | 'waiting'
        | {
            challengeId: string;
          }
        | null = null;
      if (ws.data.userId) {
        const existing = connectedUserIds.get(ws.data.userId);
        if (existing && existing !== ws) {
          for (const queue of queues.values()) {
            const idx = queue.findIndex((w) => w.data.id === existing.data.id);
            if (idx !== -1) {
              if (existing.data.variant !== undefined)
                ws.data.variant = existing.data.variant;
              else delete ws.data.variant;
              if (existing.data.displayName !== undefined)
                ws.data.displayName = existing.data.displayName;
              else delete ws.data.displayName;
              if (existing.data.userImage !== undefined)
                ws.data.userImage = existing.data.userImage;
              else delete ws.data.userImage;
              queue[idx] = ws;
              transferredState = 'waiting';
              break;
            }
          }
          if (!transferredState && existing.data.challengeId) {
            const challenge = challenges.get(existing.data.challengeId);
            if (challenge) {
              ws.data.challengeId = existing.data.challengeId;
              if (existing.data.displayName !== undefined)
                ws.data.displayName = existing.data.displayName;
              else delete ws.data.displayName;
              if (existing.data.userImage !== undefined)
                ws.data.userImage = existing.data.userImage;
              else delete ws.data.userImage;
              challenge.creator = ws;
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
    message(ws: BunWS, raw: string | Buffer) {
      if (isRateLimited(ws.data.id)) {
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
      switch (msg.type) {
        case 'join_queue':
          handleJoinQueue(ws, msg);
          break;
        case 'leave_queue':
          handleLeaveQueue(ws);
          break;
        case 'move':
          handleMove(ws, msg);
          break;
        case 'abort':
          handleAbort(ws);
          break;
        case 'resign':
          handleResign(ws);
          break;
        case 'offer_draw':
          handleOfferDraw(ws);
          break;
        case 'accept_draw':
          handleAcceptDraw(ws);
          break;
        case 'decline_draw':
          handleDeclineDraw(ws);
          break;
        case 'game_over_notify':
          handleGameOverNotify(ws, msg);
          break;
        case 'rejoin_room':
          handleRejoinRoom(ws, msg);
          break;
        case 'create_challenge':
          handleCreateChallenge(ws, msg);
          break;
        case 'join_challenge':
          handleJoinChallenge(ws, msg);
          break;
        case 'cancel_challenge':
          handleCancelChallenge(ws);
          break;
        case 'offer_rematch':
          handleOfferRematch(ws);
          break;
        case 'accept_rematch':
          handleAcceptRematch(ws);
          break;
        case 'decline_rematch':
          handleDeclineRematch(ws);
          break;
        case 'sync_dice':
          handleSyncDice(ws, msg);
          break;
        case 'sync_card':
          handleSyncCard(ws, msg);
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
              const opponent =
                room.white.data.id === ws.data.id ? room.black : room.white;
              send(opponent, {
                type: 'opponent_latency',
                latencyMs: msg.latencyMs
              });
            }
          }
          break;
        }
      }
    },
    close(ws: BunWS) {
      if (ws.data.userId) {
        const tracked = connectedUserIds.get(ws.data.userId);
        if (tracked === ws) {
          connectedUserIds.delete(ws.data.userId);
        }
      }
      handleDisconnect(ws);
    }
  }
});
logger.info('server_started', { port: PORT });
setInterval(() => {
  const threshold = Date.now() - GC_ROOM_MAX_AGE_MS;
  let roomsCleaned = 0;
  let challengesCleaned = 0;
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
  if (roomsCleaned > 0 || challengesCleaned > 0) {
    logger.info('gc_ran', { roomsCleaned, challengesCleaned });
  }
}, GC_INTERVAL_MS);
