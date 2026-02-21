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

const PORT = parseInt(process.env['PORT'] ?? '8080', 10);

const ALLOWED_ORIGINS =
  process.env['ALLOWED_ORIGINS']
    ?.split(',')
    .map((s) => s.trim())
    .filter(Boolean) ?? [];

Bun.serve<SocketData>({
  port: PORT,

  async fetch(req, server) {
    // HTTP routes (health / stats / admin) — no origin check needed
    const httpResponse = handleHttpRequest(req);
    if (httpResponse) return httpResponse;

    // Origin check for WebSocket upgrades
    if (ALLOWED_ORIGINS.length > 0) {
      const origin = req.headers.get('origin') ?? '';
      if (!ALLOWED_ORIGINS.includes(origin)) {
        logger.warn('ws_origin_rejected', { origin });
        return new Response('Forbidden', { status: 403 });
      }
    }

    const wsUrl = new URL(req.url, 'http://localhost');
    const token = wsUrl.searchParams.get('token');

    // Require a valid auth token for every WS connection.
    // Anonymous connections are rejected with 401 so the frontend can
    // redirect unauthenticated users to sign in rather than silently failing.
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
      let transferredState: 'waiting' | { challengeId: string } | null = null;

      if (ws.data.userId) {
        const existing = connectedUserIds.get(ws.data.userId);
        if (existing && existing !== ws) {
          // Another socket for this user is already registered (e.g. stale from a
          // page refresh where the old TCP close hadn't arrived yet, or a new tab).
          // Transfer any pending matchmaking state to the new socket so the new
          // tab picks up where the old one left off.

          // Queue transfer: swap the old socket reference for the new one so the
          // new socket gets matched instead of losing the queue position.
          for (const queue of queues.values()) {
            const idx = queue.findIndex((w) => w.data.id === existing.data.id);
            if (idx !== -1) {
              ws.data.variant = existing.data.variant;
              ws.data.displayName = existing.data.displayName;
              ws.data.userImage = existing.data.userImage;
              queue[idx] = ws;
              transferredState = 'waiting';
              break;
            }
          }

          // Challenge transfer: redirect the pending challenge to the new socket.
          if (!transferredState && existing.data.challengeId) {
            const challenge = challenges.get(existing.data.challengeId);
            if (challenge) {
              ws.data.challengeId = existing.data.challengeId;
              ws.data.displayName = existing.data.displayName;
              ws.data.userImage = existing.data.userImage;
              challenge.creator = ws;
              // Clear from old socket so handleDisconnect doesn't delete the challenge.
              delete existing.data.challengeId;
              transferredState = { challengeId: challenge.id };
            }
          }

          // Register the NEW socket first, then close the old one — this way
          // the old socket's close handler sees the mismatch and won't delete
          // the new entry.
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

      // Restore matchmaking state on the new socket after sending 'connected'.
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
      // Only deregister if this is still the current socket for this user.
      // After a supersede, connectedUserIds already points to the new socket,
      // so the old socket's close must not remove the new registration.
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

// Clean up stale ended rooms and expired challenges every 5 minutes
setInterval(
  () => {
    const threshold = Date.now() - 30 * 60 * 1000;
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
  },
  5 * 60 * 1000
);
