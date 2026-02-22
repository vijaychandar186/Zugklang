import { prisma } from '@/lib/db/db';
import { NextRequest } from 'next/server';
import type { TimeCategory } from '@/lib/ratings/timeCategory';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const category = req.nextUrl.searchParams.get(
    'category'
  ) as TimeCategory | null;

  const [user, ratingRow] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, image: true }
    }),
    category
      ? prisma.rating.findUnique({
          where: { userId_category: { userId, category } },
          select: { rating: true }
        })
      : prisma.rating.findFirst({
          where: { userId },
          orderBy: { gameCount: 'desc' },
          select: { rating: true }
        })
  ]);

  if (!user)
    return Response.json({ name: 'Opponent', image: null, rating: 700 });

  return Response.json({
    name: user.name ?? 'Opponent',
    image: user.image ?? null,
    rating: ratingRow?.rating ?? 700
  });
}
