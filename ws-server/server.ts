import type { SocketData } from './types';
import type { BunWS } from './types';
import { ClientMessageSchema } from './utils/schemas';
import { rooms, challenges } from './state';
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

  fetch(req, server) {
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

    const id = crypto.randomUUID();
    const upgraded = server.upgrade(req, { data: { id } });
    if (upgraded) return undefined;
    return new Response('Zugklang WebSocket Server', { status: 200 });
  },

  websocket: {
    open(ws: BunWS) {
      logger.info('player_connected', { playerId: ws.data.id.slice(0, 8) });
      send(ws, { type: 'connected', playerId: ws.data.id });
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
