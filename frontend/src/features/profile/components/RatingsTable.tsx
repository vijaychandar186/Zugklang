import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TIME_CATEGORY_LABELS } from '@/lib/ratings/timeCategory';

interface RatingRow {
  category: string;
  rating: number;
  rd: number;
  gameCount: number;
}

interface PuzzleRatingRow {
  rating: number;
  rd: number;
  gameCount: number;
}

const CATEGORY_ORDER = ['bullet', 'blitz', 'rapid', 'classical'];

export function RatingsTable({
  ratings,
  puzzleRating
}: {
  ratings: RatingRow[];
  puzzleRating?: PuzzleRatingRow | null;
}) {
  const hasAny = ratings.length > 0 || puzzleRating != null;
  if (!hasAny) return null;

  const sorted = [...ratings].sort(
    (a, b) =>
      CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
  );

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base'>Ratings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='divide-y'>
          {sorted.map((r) => (
            <div
              key={r.category}
              className='flex items-center justify-between py-2'
            >
              <div className='flex flex-col'>
                <span className='text-sm font-medium'>
                  {TIME_CATEGORY_LABELS[
                    r.category as keyof typeof TIME_CATEGORY_LABELS
                  ] ?? r.category}
                </span>
                <span className='text-muted-foreground text-xs'>
                  {r.gameCount} {r.gameCount === 1 ? 'game' : 'games'} · RD{' '}
                  {Math.round(r.rd)}
                </span>
              </div>
              <Badge variant='outline' className='font-mono text-base'>
                {r.rating}
              </Badge>
            </div>
          ))}

          {puzzleRating != null && (
            <div className='flex items-center justify-between py-2'>
              <div className='flex flex-col'>
                <span className='text-sm font-medium'>Puzzles</span>
                <span className='text-muted-foreground text-xs'>
                  {puzzleRating.gameCount}{' '}
                  {puzzleRating.gameCount === 1 ? 'puzzle' : 'puzzles'} · RD{' '}
                  {Math.round(puzzleRating.rd)}
                </span>
              </div>
              <Badge variant='outline' className='font-mono text-base'>
                {puzzleRating.rating}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
