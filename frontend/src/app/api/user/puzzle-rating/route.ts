import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/db';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

  const userId = session.user.id;

  const row = await prisma.puzzleRating.findUnique({
    where: { userId },
    select: { rating: true, rd: true, gameCount: true }
  });

  return Response.json({
    rating: row?.rating ?? 1000,
    rd: row?.rd ?? 350,
    gameCount: row?.gameCount ?? 0
  });
}
