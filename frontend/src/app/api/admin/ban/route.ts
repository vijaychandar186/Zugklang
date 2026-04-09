import { prisma } from '@/lib/db/db';
import { redis } from '@/lib/redis';
import { NextRequest } from 'next/server';

const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET ?? '';

function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get('authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  return !!INTERNAL_API_SECRET && token === INTERNAL_API_SECRET;
}

/**
 * POST /api/admin/ban
 * Body: { userId: string, banned: boolean }
 * Header: Authorization: Bearer <INTERNAL_API_SECRET>
 *
 * Sets or clears the ban flag on a user in the frontend DB and in Redis.
 * The WS server reads Redis banned:{userId} to block queue/challenge entry.
 */
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as {
    userId?: string;
    banned?: boolean;
  } | null;

  if (!body?.userId || typeof body.banned !== 'boolean') {
    return Response.json(
      { error: 'Body must contain { userId: string, banned: boolean }' },
      { status: 400 }
    );
  }

  const { userId, banned } = body;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true }
  });

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      banned,
      bannedAt: banned ? new Date() : null
    }
  });

  if (banned) {
    await redis.set(`banned:${userId}`, '1');
  } else {
    await redis.del(`banned:${userId}`);
  }

  return Response.json({
    ok: true,
    userId,
    banned,
    name: user.name
  });
}

/**
 * GET /api/admin/ban?userId=...
 * Returns the current ban status of a user.
 */
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) {
    return Response.json({ error: 'Missing userId query param' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, banned: true, bannedAt: true }
  });

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }

  return Response.json(user);
}
