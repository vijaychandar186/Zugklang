import { rooms, challenges } from '../state';
import { redis } from '../redis';

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
  const queueKeys = await redis.keys('queue:*:*:*:*');
  let queuedPlayers = 0;
  for (const key of queueKeys) {
    queuedPlayers += await redis.zcard(key);
  }
  return Response.json({
    activeRooms,
    endedRooms,
    challenges: challenges.size,
    queuedPlayers
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
  const queueKeys = await redis.keys('queue:*:*:*:*');
  const queuesObj: Record<string, number> = {};
  for (const key of queueKeys) {
    queuesObj[key] = await redis.zcard(key);
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

export function handleHttpRequest(
  req: Request
): Response | Promise<Response> | undefined {
  const { pathname } = new URL(req.url);
  switch (pathname) {
    case '/health':
      return handleHealth();
    case '/admin/stats':
      return handleStatsAsync(req);
    case '/admin':
      return handleAdminAsync(req);
    default:
      return undefined;
  }
}
