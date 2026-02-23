import { Card, CardContent } from '@/components/ui/card';
interface StatsGridProps {
  wins: number;
  losses: number;
  draws: number;
  total: number;
}
export function StatsGrid({ wins, losses, draws, total }: StatsGridProps) {
  const stats = [
    { label: 'Games', value: total, className: '' },
    { label: 'Wins', value: wins, className: 'text-green-500' },
    { label: 'Losses', value: losses, className: 'text-red-500' },
    { label: 'Draws', value: draws, className: 'text-yellow-500' }
  ];

  return (
    <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
      {stats.map((s) => (
        <Card key={s.label}>
          <CardContent className='flex flex-col items-center justify-center py-4'>
            <span className={`text-2xl font-bold ${s.className}`}>
              {s.value}
            </span>
            <span className='text-muted-foreground text-xs'>{s.label}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
