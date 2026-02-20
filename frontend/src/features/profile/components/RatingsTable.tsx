import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RatingRow {
  variant: string;
  rating: number;
  rd: number;
  gameCount: number;
}

const VARIANT_LABELS: Record<string, string> = {
  standard: 'Standard',
  fischerRandom: 'Fischer Random',
  atomic: 'Atomic',
  racingKings: 'Racing Kings',
  horde: 'Horde',
  threeCheck: 'Three-Check',
  antichess: 'Antichess',
  kingOfTheHill: 'King of the Hill',
  crazyhouse: 'Crazyhouse'
};

export function RatingsTable({ ratings }: { ratings: RatingRow[] }) {
  if (ratings.length === 0) return null;

  return (
    <Card>
      <CardHeader className='pb-3'>
        <CardTitle className='text-base'>Ratings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='divide-y'>
          {ratings.map((r) => (
            <div
              key={r.variant}
              className='flex items-center justify-between py-2'
            >
              <div className='flex flex-col'>
                <span className='text-sm font-medium'>
                  {VARIANT_LABELS[r.variant] ?? r.variant}
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
        </div>
      </CardContent>
    </Card>
  );
}
