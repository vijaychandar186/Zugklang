import { auth } from '@/lib/auth/auth';
import { redis } from '@/lib/redis';

const TOKEN_TTL_SEC = 60;

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }
  const token = crypto.randomUUID();
  // NX ensures each token slot is only written once; EX auto-expires after 60s.
  await redis.set(`ws:pending:${token}`, session.user.id, 'EX', TOKEN_TTL_SEC, 'NX');
  return Response.json({ token });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    token?: string;
  } | null;
  const token = body?.token;
  if (!token) {
    return new Response('Missing token', { status: 400 });
  }
  // GETDEL is atomic: fetches and deletes in one round-trip (one-time use).
  const userId = await redis.getdel(`ws:pending:${token}`);
  if (!userId) {
    return new Response('Invalid or expired token', { status: 401 });
  }
  return Response.json({ userId });
}
