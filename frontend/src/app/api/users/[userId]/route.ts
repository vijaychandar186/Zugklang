import { prisma } from '@/lib/db/db';
import { NextRequest } from 'next/server';
import type { TimeCategory } from '@/lib/ratings/timeCategory';
import { DEFAULT_FLAG_CODE } from '@/features/settings/flags';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const category = req.nextUrl.searchParams.get(
    'category'
  ) as TimeCategory | null;

  const variant = req.nextUrl.searchParams.get('variant') ?? 'standard';
  const [user, ratingRow] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, image: true, flagCode: true }
    }),
    category
      ? prisma.rating.findUnique({
          where: { userId_variant_category: { userId, variant, category } },
          select: { rating: true }
        })
      : prisma.rating.findFirst({
          where: { userId, variant },
          orderBy: { gameCount: 'desc' },
          select: { rating: true }
        })
  ]);

  if (!user)
    return Response.json({
      name: 'Opponent',
      image: null,
      rating: 700,
      flagCode: DEFAULT_FLAG_CODE
    });

  return Response.json({
    name: user.name ?? 'Opponent',
    image: user.image ?? null,
    rating: ratingRow?.rating ?? 700,
    flagCode: user.flagCode ?? DEFAULT_FLAG_CODE
  });
}
