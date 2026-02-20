import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/db';
import { ProfileView } from '@/features/profile/components/ProfileView';

export const metadata: Metadata = {
  title: 'Profile | Zugklang',
  description: 'Your chess profile, ratings, and game history.'
};

function computeStats(
  userId: string,
  games: Array<{
    result: string;
    whiteUserId: string | null;
    blackUserId: string | null;
  }>
) {
  let wins = 0,
    losses = 0,
    draws = 0;

  for (const game of games) {
    if (game.result === '*') continue;
    const isWhite = game.whiteUserId === userId;
    if (game.result === '1/2-1/2') {
      draws++;
    } else if (
      (game.result === '1-0' && isWhite) ||
      (game.result === '0-1' && !isWhite)
    ) {
      wins++;
    } else {
      losses++;
    }
  }

  return {
    wins,
    losses,
    draws,
    total: games.filter((g) => g.result !== '*').length
  };
}

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/signin');

  const userId = session.user.id;

  const [user, ratings, recentGames] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        image: true,
        createdAt: true
      }
    }),
    prisma.rating.findMany({
      where: { userId },
      orderBy: { gameCount: 'desc' },
      select: {
        variant: true,
        rating: true,
        rd: true,
        gameCount: true
      }
    }),
    prisma.game.findMany({
      where: {
        OR: [{ whiteUserId: userId }, { blackUserId: userId }]
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        id: true,
        variant: true,
        gameType: true,
        result: true,
        resultReason: true,
        moveCount: true,
        createdAt: true,
        whiteUserId: true,
        blackUserId: true,
        whiteRatingDelta: true,
        blackRatingDelta: true,
        white: { select: { name: true } },
        black: { select: { name: true } }
      }
    })
  ]);

  if (!user) redirect('/signin');

  const stats = computeStats(userId, recentGames);

  return (
    <ProfileView
      user={user}
      ratings={ratings}
      recentGames={recentGames}
      stats={stats}
      userId={userId}
    />
  );
}
