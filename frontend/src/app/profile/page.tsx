import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/db';
import { PageContainer } from '@/components/layout/PageContainer';
import { Navbar } from '@/components/layout/Navbar';
import { ProfileView } from '@/features/profile/components/ProfileView';
export const metadata: Metadata = {
  title: 'Profile | Zugklang',
  description: 'Your chess profile, ratings, and game history.'
};
export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/signin');
  const userId = session.user.id;
  const [user, ratings, puzzleRating, recentGames, passportFlags] =
    await Promise.all([
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
          category: true,
          rating: true,
          rd: true,
          gameCount: true
        }
      }),
      prisma.puzzleRating.findUnique({
        where: { userId },
        select: { rating: true, rd: true, gameCount: true }
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
      }),
      prisma.passportFlag.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: { flagCode: true }
      })
    ]);
  if (!user) redirect('/signin');
  return (
    <PageContainer scrollable={true}>
      <Navbar />
      <ProfileView
        user={user}
        ratings={ratings}
        puzzleRating={puzzleRating}
        recentGames={recentGames}
        userId={userId}
        passportFlags={passportFlags}
      />
    </PageContainer>
  );
}
