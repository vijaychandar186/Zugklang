import { auth } from '@/lib/auth/auth';
const pendingTokens = new Map<
  string,
  {
    userId: string;
    expiresAt: number;
  }
>();
const TOKEN_TTL_MS = 60000;
setInterval(
  () => {
    const now = Date.now();
    for (const [token, entry] of pendingTokens) {
      if (now > entry.expiresAt) pendingTokens.delete(token);
    }
  },
  5 * 60 * 1000
);
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response('Unauthorized', { status: 401 });
  }
  const token = crypto.randomUUID();
  pendingTokens.set(token, {
    userId: session.user.id,
    expiresAt: Date.now() + TOKEN_TTL_MS
  });
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
  const entry = pendingTokens.get(token);
  if (!entry) {
    return new Response('Invalid token', { status: 401 });
  }
  if (Date.now() > entry.expiresAt) {
    pendingTokens.delete(token);
    return new Response('Token expired', { status: 401 });
  }
  pendingTokens.delete(token);
  return Response.json({ userId: entry.userId });
}
