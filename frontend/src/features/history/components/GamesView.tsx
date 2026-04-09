import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { formatVariantLabel } from '@/lib/chess/variantLabels';
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
interface GameRow {
  id: string;
  variant: string;
  gameType: string;
  result: string;
  resultReason: string;
  moveCount: number;
  moves: string[];
  createdAt: Date;
  whiteUserId: string | null;
  blackUserId: string | null;
  white: {
    name: string | null;
  } | null;
  black: {
    name: string | null;
  } | null;
  whiteRatingDelta: number | null;
  blackRatingDelta: number | null;
}
interface GamesViewProps {
  games: GameRow[];
  totalCount: number;
  page: number;
  totalPages: number;
  userId: string;
}
export function GamesView({
  games,
  totalCount,
  page,
  totalPages,
  userId
}: GamesViewProps) {
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
            <Table>
              <TableHeader>
                <TableRow className='text-muted-foreground text-xs'>
                  <TableHead className='px-4 py-2'>Date</TableHead>
                  <TableHead className='px-4 py-2'>Variant</TableHead>
                  <TableHead className='px-4 py-2'>Type</TableHead>
                  <TableHead className='px-4 py-2'>Color</TableHead>
                  <TableHead className='px-4 py-2'>Opponent</TableHead>
                  <TableHead className='px-4 py-2'>Result</TableHead>
                  <TableHead className='px-4 py-2'>Moves</TableHead>
                  <TableHead className='px-4 py-2 text-right'>Rating</TableHead>
                  <TableHead className='px-4 py-2 text-right'>Review</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
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
                    <TableRow key={game.id}>
                      <TableCell className='text-muted-foreground px-4 py-2 text-xs'>
                        {date}
                      </TableCell>
                      <TableCell className='px-4 py-2'>
                        {formatVariantLabel(game.variant)}
                      </TableCell>
                      <TableCell className='text-muted-foreground px-4 py-2 text-xs capitalize'>
                        {game.gameType}
                      </TableCell>
                      <TableCell className='px-4 py-2 capitalize'>
                        {isWhite ? 'White' : 'Black'}
                      </TableCell>
                      <TableCell className='px-4 py-2'>
                        {game.gameType === 'computer'
                          ? 'Stockfish'
                          : game.gameType === 'local'
                            ? 'Local'
                            : (opponent?.name ?? 'Opponent')}
                      </TableCell>
                      <TableCell className='px-4 py-2'>
                        <ResultBadge result={game.result} isWhite={isWhite} />
                      </TableCell>
                      <TableCell className='text-muted-foreground px-4 py-2'>
                        {game.moveCount}
                      </TableCell>
                      <TableCell className='px-4 py-2 text-right font-mono text-xs'>
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
                      </TableCell>
                      <TableCell className='px-4 py-2 text-right'>
                        {game.moves.length > 0 && (
                          <Link href={reviewHref}>
                            <Button variant='outline' size='sm'>
                              Review
                            </Button>
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
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
