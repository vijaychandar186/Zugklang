import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/db';
import { PageContainer } from '@/components/layout/PageContainer';
import { Navbar } from '@/components/layout/Navbar';
import { HistoryView } from '@/features/games/components/HistoryView';

export const metadata: Metadata = {
  title: 'History | Zugklang',
  description: 'Your complete chess game and training history.'
};

export default async function GamesPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect('/signin');

  const userId = session.user.id;
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? '1', 10));
  const pageSize = 25;
  const skip = (page - 1) * pageSize;

  const [
    games,
    totalCount,
    puzzleAttempts,
    puzzleRush,
    memorySessions,
    visionSessions
  ] = await Promise.all([
    prisma.game.findMany({
      where: {
        OR: [{ whiteUserId: userId }, { blackUserId: userId }]
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: pageSize,
      select: {
        id: true,
        variant: true,
        gameType: true,
        result: true,
        resultReason: true,
        moveCount: true,
        moves: true,
        createdAt: true,
        whiteUserId: true,
        blackUserId: true,
        whiteRatingDelta: true,
        blackRatingDelta: true,
        white: { select: { name: true } },
        black: { select: { name: true } }
      }
    }),
    prisma.game.count({
      where: {
        OR: [{ whiteUserId: userId }, { blackUserId: userId }]
      }
    }),
    prisma.puzzleAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 500,
      select: {
        id: true,
        puzzleId: true,
        difficulty: true,
        rating: true,
        solved: true,
        usedHint: true,
        createdAt: true
      }
    }),
    prisma.puzzleRushScore.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 500,
      select: {
        id: true,
        mode: true,
        difficulty: true,
        score: true,
        mistakes: true,
        timeLimitSeconds: true,
        maxMistakes: true,
        createdAt: true
      }
    }),
    prisma.memorySession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 500,
      select: {
        id: true,
        mode: true,
        pieceCount: true,
        memorizeTimeSeconds: true,
        correctPieces: true,
        totalPieces: true,
        accuracy: true,
        progressiveLevel: true,
        createdAt: true
      }
    }),
    prisma.visionSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 500,
      select: {
        id: true,
        trainingMode: true,
        colorMode: true,
        timeLimitSeconds: true,
        score: true,
        totalAttempts: true,
        accuracy: true,
        avgResponseTimeMs: true,
        createdAt: true
      }
    })
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <PageContainer scrollable={true}>
      <Navbar />
      <HistoryView
        games={games}
        gamesTotalCount={totalCount}
        page={page}
        totalPages={totalPages}
        userId={userId}
        puzzleAttempts={puzzleAttempts}
        puzzleRush={puzzleRush}
        memorySessions={memorySessions}
        visionSessions={visionSessions}
      />
    </PageContainer>
  );
}
