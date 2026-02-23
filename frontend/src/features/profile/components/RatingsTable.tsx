import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TIME_CATEGORY_LABELS } from '@/lib/ratings/timeCategory';
import { cn } from '@/lib/utils';
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
  puzzleRating,
  className
}: {
  ratings: RatingRow[];
  puzzleRating?: PuzzleRatingRow | null;
  className?: string;
}) {
  const ratingByCategory = new Map(
    ratings.map((rating) => [rating.category, rating])
  );

  return (
    <Card className={cn(className)}>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base'>Ratings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='divide-y'>
          {CATEGORY_ORDER.map((category) => {
            const r = ratingByCategory.get(category);
            return (
              <div
                key={category}
                className='flex items-center justify-between py-2'
              >
                <div className='flex flex-col'>
                  <span className='text-sm font-medium'>
                    {TIME_CATEGORY_LABELS[
                      category as keyof typeof TIME_CATEGORY_LABELS
                    ] ?? category}
                  </span>
                  <span className='text-muted-foreground text-xs'>
                    {r
                      ? `${r.gameCount} ${r.gameCount === 1 ? 'game' : 'games'} · RD ${Math.round(r.rd)}`
                      : 'No games yet'}
                  </span>
                </div>
                <Badge variant='outline' className='font-mono text-base'>
                  {r ? r.rating : '—'}
                </Badge>
              </div>
            );
          })}

          <div className='flex items-center justify-between py-2'>
            <div className='flex flex-col'>
              <span className='text-sm font-medium'>Puzzles</span>
              <span className='text-muted-foreground text-xs'>
                {puzzleRating
                  ? `${puzzleRating.gameCount} ${
                      puzzleRating.gameCount === 1 ? 'puzzle' : 'puzzles'
                    } · RD ${Math.round(puzzleRating.rd)}`
                  : 'No puzzles yet'}
              </span>
            </div>
            <Badge variant='outline' className='font-mono text-base'>
              {puzzleRating ? puzzleRating.rating : '—'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
