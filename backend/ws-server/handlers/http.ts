import { rooms, challenges, connectedUserIds, reconnectTimeouts } from '../state';
import { redis } from '../redis';
import { renderMetrics, setGauge } from '../utils/metrics';

async function scanKeys(pattern: string): Promise<string[]> {
  const keys: string[] = [];
  let cursor = '0';
  try {
    do {
      const [nextCursor, batch] = await redis.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100
      );
      cursor = nextCursor;
      keys.push(...batch);
    } while (cursor !== '0');
  } catch {
    return [];
  }
  return keys;
}

const startedAt = Date.now();

function handleHealth(): Response {
  return Response.json({
    status: 'ok',
    uptime: Math.floor((Date.now() - startedAt) / 1000)
  });
}

async function handleStatsAsync(req: Request): Promise<Response> {
  const adminKey = process.env['ADMIN_KEY'];
  if (!adminKey) {
    return new Response('Admin endpoint not configured', { status: 503 });
  }
  if (req.headers.get('authorization') !== `Bearer ${adminKey}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  let activeRooms = 0;
  let endedRooms = 0;
  for (const room of rooms.values()) {
    if (room.status === 'active') activeRooms++;
    else endedRooms++;
  }
  const queueKeys = await scanKeys('queue:*:*:*:*');
  let queuedPlayers = 0;
  for (const key of queueKeys) {
    try {
      queuedPlayers += await redis.zcard(key);
    } catch {
      void 0;
    }
  }
  return Response.json({
    activeRooms,
    endedRooms,
    challenges: challenges.size,
    queuedPlayers,
    reconnectingPlayers: reconnectTimeouts.size
  });
}

async function handleAdminAsync(req: Request): Promise<Response> {
  const adminKey = process.env['ADMIN_KEY'];
  if (!adminKey) {
    return new Response('Admin endpoint not configured', { status: 503 });
  }
  if (req.headers.get('authorization') !== `Bearer ${adminKey}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  const queueKeys = await scanKeys('queue:*:*:*:*');
  const queuesObj: Record<string, number> = {};
  for (const key of queueKeys) {
    try {
      queuesObj[key] = await redis.zcard(key);
    } catch {
      queuesObj[key] = 0;
    }
  }
  return Response.json({
    rooms: [...rooms.values()].map((r) => ({
      id: r.id,
      variant: r.variant,
      status: r.status,
      moves: r.moves.length,
      createdAt: r.createdAt
    })),
    challenges: [...challenges.values()].map((c) => ({
      id: c.id,
      variant: c.variant,
      creatorColor: c.creatorColor,
      createdAt: c.createdAt
    })),
    queues: queuesObj
  });
}

async function handleMetrics(): Promise<Response> {
  let activeRooms = 0;
  let endedRooms = 0;
  for (const room of rooms.values()) {
    if (room.status === 'active') activeRooms++;
    else endedRooms++;
  }
  const queueKeys = await scanKeys('queue:*:*:*:*');
  let queuedPlayers = 0;
  for (const key of queueKeys) {
    try {
      queuedPlayers += await redis.zcard(key);
    } catch {
      void 0;
    }
  }
  setGauge('ws_connected_players', connectedUserIds.size);
  setGauge('ws_active_rooms', activeRooms);
  setGauge('ws_ended_rooms', endedRooms);
  setGauge('ws_open_challenges', challenges.size);
  setGauge('ws_queued_players', queuedPlayers);
  return new Response(renderMetrics(), {
    headers: { 'Content-Type': 'text/plain; version=0.0.4' }
  });
}

export function handleHttpRequest(
  req: Request
): Response | Promise<Response> | undefined {
  const { pathname } = new URL(req.url);
  switch (pathname) {
    case '/health':
      return handleHealth();
    case '/metrics':
      return handleMetrics();
    case '/admin/stats':
      return handleStatsAsync(req);
    case '/admin':
      return handleAdminAsync(req);
    default:
      return undefined;
  }
}
