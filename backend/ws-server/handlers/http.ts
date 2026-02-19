import { rooms, challenges, queues, reconnectTimeouts } from '../state';

const startedAt = Date.now();

function handleHealth(): Response {
  return Response.json({
    status: 'ok',
    uptime: Math.floor((Date.now() - startedAt) / 1000)
  });
}

function handleStats(req: Request): Response {
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

  let queuedPlayers = 0;
  for (const queue of queues.values()) {
    queuedPlayers += queue.length;
  }

  return Response.json({
    activeRooms,
    endedRooms,
    challenges: challenges.size,
    queuedPlayers,
    reconnectingPlayers: reconnectTimeouts.size
  });
}

function handleAdmin(req: Request): Response {
  const adminKey = process.env['ADMIN_KEY'];
  if (!adminKey) {
    return new Response('Admin endpoint not configured', { status: 503 });
  }

  if (req.headers.get('authorization') !== `Bearer ${adminKey}`) {
    return new Response('Unauthorized', { status: 401 });
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
    queues: Object.fromEntries(
      [...queues.entries()].map(([k, v]) => [k, v.length])
    )
  });
}

export function handleHttpRequest(req: Request): Response | undefined {
  const { pathname } = new URL(req.url);

  switch (pathname) {
    case '/health':
      return handleHealth();
    case '/admin/stats':
      return handleStats(req);
    case '/admin':
      return handleAdmin(req);
    default:
      return undefined;
  }
}
