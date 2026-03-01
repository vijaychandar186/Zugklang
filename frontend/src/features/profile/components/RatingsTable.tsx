import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  TIME_CATEGORY_LABELS,
  type TimeCategory
} from '@/lib/ratings/timeCategory';
import { formatVariantLabel } from '@/lib/chess/variantLabels';
import { cn } from '@/lib/utils';
interface RatingRow {
  variant: string;
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
const CATEGORY_ORDER: TimeCategory[] = [
  'bullet',
  'blitz',
  'rapid',
  'classical'
];
function sortedVariants(variants: string[]): string[] {
  return [...variants].sort((a, b) => {
    if (a === 'standard') return -1;
    if (b === 'standard') return 1;
    return formatVariantLabel(a).localeCompare(formatVariantLabel(b));
  });
}
export function RatingsTable({
  ratings,
  puzzleRating,
  className
}: {
  ratings: RatingRow[];
  puzzleRating?: PuzzleRatingRow | null;
  className?: string;
}) {
  const byVariant = new Map<string, Map<string, RatingRow>>();
  for (const row of ratings) {
    if (!byVariant.has(row.variant)) {
      byVariant.set(row.variant, new Map());
    }
    byVariant.get(row.variant)!.set(row.category, row);
  }
  const variants = sortedVariants(Array.from(byVariant.keys()));
  return (
    <Card className={cn(className)}>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base'>Ratings</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {variants.length === 0 && !puzzleRating && (
          <p className='text-muted-foreground text-sm'>No rated games yet.</p>
        )}

        {variants.map((variant) => {
          const categoryMap = byVariant.get(variant)!;
          return (
            <div key={variant}>
              <p className='text-muted-foreground mb-1 text-xs font-semibold tracking-wide uppercase'>
                {formatVariantLabel(variant)}
              </p>
              <div className='divide-y rounded-md border'>
                {CATEGORY_ORDER.map((category) => {
                  const r = categoryMap.get(category);
                  return (
                    <div
                      key={category}
                      className='flex items-center justify-between px-3 py-2'
                    >
                      <div className='flex flex-col'>
                        <span className='text-sm font-medium'>
                          {TIME_CATEGORY_LABELS[category]}
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
              </div>
            </div>
          );
        })}

        <div>
          <p className='text-muted-foreground mb-1 text-xs font-semibold tracking-wide uppercase'>
            Puzzles
          </p>
          <div className='rounded-md border'>
            <div className='flex items-center justify-between px-3 py-2'>
              <div className='flex flex-col'>
                <span className='text-sm font-medium'>Puzzles</span>
                <span className='text-muted-foreground text-xs'>
                  {puzzleRating
                    ? `${puzzleRating.gameCount} ${puzzleRating.gameCount === 1 ? 'puzzle' : 'puzzles'} · RD ${Math.round(puzzleRating.rd)}`
                    : 'No puzzles yet'}
                </span>
              </div>
              <Badge variant='outline' className='font-mono text-base'>
                {puzzleRating ? puzzleRating.rating : '—'}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
