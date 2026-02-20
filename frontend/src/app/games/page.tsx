import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/db/db';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Game History | Zugklang',
  description: 'Your complete chess game history.'
};

const VARIANT_LABELS: Record<string, string> = {
  standard: 'Standard',
  fischerRandom: '960',
  atomic: 'Atomic',
  racingKings: 'Racing Kings',
  horde: 'Horde',
  threeCheck: '3-Check',
  antichess: 'Antichess',
  kingOfTheHill: 'KOTH',
  crazyhouse: 'Crazyhouse'
};

function buildPgn(moves: string[]): string {
  return moves
    .map((move, i) => {
      if (i % 2 === 0) return `${Math.floor(i / 2) + 1}. ${move}`;
      return move;
    })
    .join(' ');
}

function ResultBadge({
  result,
  isWhite
}: {
  result: string;
  isWhite: boolean;
}) {
  if (result === '*')
    return (
      <Badge variant='secondary' className='text-xs'>
        Aborted
      </Badge>
    );
  if (result === '1/2-1/2')
    return (
      <Badge
        variant='outline'
        className='border-yellow-500 text-xs text-yellow-500'
      >
        Draw
      </Badge>
    );
  const won = (result === '1-0' && isWhite) || (result === '0-1' && !isWhite);
  return (
    <Badge
      variant='outline'
      className={`text-xs ${won ? 'border-green-500 text-green-500' : 'border-red-500 text-red-500'}`}
    >
      {won ? 'Win' : 'Loss'}
    </Badge>
  );
}

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

  const [games, totalCount] = await Promise.all([
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
    })
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className='flex w-full flex-col gap-6 px-4 py-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Game History</h1>
          <p className='text-muted-foreground text-sm'>
            {totalCount} {totalCount === 1 ? 'game' : 'games'} played
          </p>
        </div>
        <Link href='/profile'>
          <Button variant='outline' size='sm'>
            Back to Profile
          </Button>
        </Link>
      </div>

      {games.length === 0 ? (
        <Card>
          <CardContent className='py-12 text-center'>
            <p className='text-muted-foreground'>
              No games played yet. Start playing to build your history!
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-base'>
              Page {page} of {totalPages}
            </CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='text-muted-foreground border-b text-xs'>
                    <th className='px-4 py-2 text-left'>Date</th>
                    <th className='px-4 py-2 text-left'>Variant</th>
                    <th className='px-4 py-2 text-left'>Type</th>
                    <th className='px-4 py-2 text-left'>Color</th>
                    <th className='px-4 py-2 text-left'>Opponent</th>
                    <th className='px-4 py-2 text-left'>Result</th>
                    <th className='px-4 py-2 text-left'>Moves</th>
                    <th className='px-4 py-2 text-right'>Rating</th>
                    <th className='px-4 py-2 text-right'>Review</th>
                  </tr>
                </thead>
                <tbody className='divide-y'>
                  {games.map((game) => {
                    const isWhite = game.whiteUserId === userId;
                    const opponent = isWhite ? game.black : game.white;
                    const ratingDelta = isWhite
                      ? game.whiteRatingDelta
                      : game.blackRatingDelta;
                    const date = new Intl.DateTimeFormat('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    }).format(game.createdAt);

                    const pgn = buildPgn(game.moves);
                    const reviewHref = `/tools/game-review?pgn=${encodeURIComponent(pgn)}`;

                    return (
                      <tr key={game.id} className='hover:bg-muted/50'>
                        <td className='text-muted-foreground px-4 py-2 text-xs'>
                          {date}
                        </td>
                        <td className='px-4 py-2'>
                          {VARIANT_LABELS[game.variant] ?? game.variant}
                        </td>
                        <td className='text-muted-foreground px-4 py-2 text-xs capitalize'>
                          {game.gameType}
                        </td>
                        <td className='px-4 py-2 capitalize'>
                          {isWhite ? 'White' : 'Black'}
                        </td>
                        <td className='px-4 py-2'>
                          {game.gameType === 'computer'
                            ? 'Stockfish'
                            : game.gameType === 'local'
                              ? 'Local'
                              : (opponent?.name ?? 'Opponent')}
                        </td>
                        <td className='px-4 py-2'>
                          <ResultBadge result={game.result} isWhite={isWhite} />
                        </td>
                        <td className='text-muted-foreground px-4 py-2'>
                          {game.moveCount}
                        </td>
                        <td className='px-4 py-2 text-right font-mono text-xs'>
                          {ratingDelta !== null && ratingDelta !== undefined ? (
                            <span
                              className={
                                ratingDelta >= 0
                                  ? 'text-green-500'
                                  : 'text-red-500'
                              }
                            >
                              {ratingDelta >= 0 ? '+' : ''}
                              {ratingDelta}
                            </span>
                          ) : (
                            <span className='text-muted-foreground'>—</span>
                          )}
                        </td>
                        <td className='px-4 py-2 text-right'>
                          {game.moves.length > 0 && (
                            <Link href={reviewHref}>
                              <Button variant='outline' size='sm'>
                                Review
                              </Button>
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {totalPages > 1 && (
        <div className='flex items-center justify-center gap-2'>
          {page > 1 && (
            <Link href={`/games?page=${page - 1}`}>
              <Button variant='outline' size='sm'>
                Previous
              </Button>
            </Link>
          )}
          <span className='text-muted-foreground text-sm'>
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/games?page=${page + 1}`}>
              <Button variant='outline' size='sm'>
                Next
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
