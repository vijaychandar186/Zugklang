import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
interface GameRow {
  id: string;
  variant: string;
  gameType: string;
  result: string;
  resultReason: string;
  moveCount: number;
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
export function RecentGamesTable({
  games,
  userId
}: {
  games: GameRow[];
  userId: string;
}) {
  if (games.length === 0) {
    return (
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-base'>Recent Games</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground py-6 text-center text-sm'>
            No games played yet. Start playing to build your history!
          </p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base'>Recent Games</CardTitle>
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
              return (
                <TableRow key={game.id}>
                  <TableCell className='text-muted-foreground px-4 py-2 text-xs'>
                    {date}
                  </TableCell>
                  <TableCell className='px-4 py-2'>
                    {VARIANT_LABELS[game.variant] ?? game.variant}
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
                          ratingDelta >= 0 ? 'text-green-500' : 'text-red-500'
                        }
                      >
                        {ratingDelta >= 0 ? '+' : ''}
                        {ratingDelta}
                      </span>
                    ) : (
                      <span className='text-muted-foreground'>—</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
