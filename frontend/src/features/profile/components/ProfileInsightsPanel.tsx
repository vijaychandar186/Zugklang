'use client';

import { useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import {
  getTimeCategory,
  TIME_CATEGORY_LABELS
} from '@/lib/ratings/timeCategory';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart';
import { StatsGrid } from './StatsGrid';
import { RatingsTable } from './RatingsTable';

type SpeedFilter = 'all' | 'bullet' | 'blitz' | 'rapid' | 'classical';
type DatePreset = 'all' | 'today' | 'week' | 'month' | 'year' | 'custom';

type GameForInsights = {
  variant: string;
  result: string;
  timeControl: unknown;
  whiteUserId: string | null;
  blackUserId: string | null;
  createdAt: string;
  playedAt: string | null;
};

type RatingsRow = {
  category: string;
  rating: number;
  rd: number;
  gameCount: number;
};

type PuzzleRatingRow = {
  rating: number;
  rd: number;
  gameCount: number;
} | null;

type ProfileInsightsPanelProps = {
  games: GameForInsights[];
  userId: string;
  ratings: RatingsRow[];
  puzzleRating: PuzzleRatingRow;
};

const chartConfig = {
  games: {
    label: 'Games',
    color: 'var(--primary)'
  }
} satisfies ChartConfig;

function getPlayedDate(game: GameForInsights): Date | null {
  const value = game.playedAt ?? game.createdAt;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getStandardSpeedCategory(game: GameForInsights): SpeedFilter | null {
  if (game.variant !== 'standard') return null;

  const timeControl =
    typeof game.timeControl === 'object' && game.timeControl !== null
      ? (game.timeControl as Record<string, unknown>)
      : null;
  if (!timeControl) return null;

  const mode = typeof timeControl.mode === 'string' ? timeControl.mode : null;
  if (mode === 'unlimited') return 'classical';
  if (mode !== 'timed') return null;

  const minutes =
    typeof timeControl.minutes === 'number' ? timeControl.minutes : null;
  const increment =
    typeof timeControl.increment === 'number' ? timeControl.increment : null;

  if (minutes === null || increment === null) return null;
  return getTimeCategory(minutes, increment);
}

function normalizeRange(preset: DatePreset, from: string, to: string) {
  if (preset === 'all')
    return { start: null as Date | null, end: null as Date | null };

  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  if (preset === 'today') return { start, end };
  if (preset === 'week') {
    const weekStart = new Date(start);
    weekStart.setDate(weekStart.getDate() - 6);
    return { start: weekStart, end };
  }
  if (preset === 'month') {
    const monthStart = new Date(start);
    monthStart.setDate(monthStart.getDate() - 29);
    return { start: monthStart, end };
  }
  if (preset === 'year') {
    const yearStart = new Date(start);
    yearStart.setDate(yearStart.getDate() - 364);
    return { start: yearStart, end };
  }

  const customStart = from ? new Date(`${from}T00:00:00`) : null;
  const customEnd = to ? new Date(`${to}T23:59:59.999`) : null;
  return { start: customStart, end: customEnd };
}

function labelForDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date);
}

export function ProfileInsightsPanel({
  games,
  userId,
  ratings,
  puzzleRating
}: ProfileInsightsPanelProps) {
  const [speedFilter, setSpeedFilter] = useState<SpeedFilter>('all');
  const [datePreset, setDatePreset] = useState<DatePreset>('all');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');

  const { start, end } = useMemo(
    () => normalizeRange(datePreset, customFrom, customTo),
    [datePreset, customFrom, customTo]
  );

  const filteredGames = useMemo(
    () =>
      games.filter((game) => {
        if (
          game.result !== '1-0' &&
          game.result !== '0-1' &&
          game.result !== '1/2-1/2'
        ) {
          return false;
        }

        if (game.whiteUserId !== userId && game.blackUserId !== userId)
          return false;

        if (
          speedFilter !== 'all' &&
          getStandardSpeedCategory(game) !== speedFilter
        ) {
          return false;
        }

        const playedDate = getPlayedDate(game);
        if (!playedDate) return false;
        if (start && playedDate < start) return false;
        if (end && playedDate > end) return false;

        return true;
      }),
    [games, userId, speedFilter, start, end]
  );

  const stats = useMemo(() => {
    let wins = 0;
    let losses = 0;
    let draws = 0;

    for (const game of filteredGames) {
      const isWhite = game.whiteUserId === userId;
      if (game.result === '1/2-1/2') {
        draws++;
      } else if (
        (game.result === '1-0' && isWhite) ||
        (game.result === '0-1' && !isWhite)
      ) {
        wins++;
      } else {
        losses++;
      }
    }

    return {
      wins,
      losses,
      draws,
      total: wins + losses + draws
    };
  }, [filteredGames, userId]);

  const chartData = useMemo(() => {
    const byDay = new Map<
      string,
      { iso: string; label: string; games: number }
    >();

    for (const game of filteredGames) {
      const playedDate = getPlayedDate(game);
      if (!playedDate) continue;
      const dayKey = playedDate.toISOString().slice(0, 10);

      const current = byDay.get(dayKey);
      if (current) {
        current.games += 1;
      } else {
        byDay.set(dayKey, {
          iso: dayKey,
          label: labelForDate(playedDate),
          games: 1
        });
      }
    }

    const sorted = Array.from(byDay.values()).sort((a, b) =>
      a.iso.localeCompare(b.iso)
    );
    if (sorted.length > 0) return sorted;
    return [{ iso: 'empty', label: 'No data', games: 0 }];
  }, [filteredGames]);

  const speedLabel =
    speedFilter === 'all' ? 'All speeds' : TIME_CATEGORY_LABELS[speedFilter];

  return (
    <div className='grid gap-4 lg:grid-cols-2 lg:items-stretch'>
      <Card className='h-full min-h-[560px]'>
        <CardHeader className='gap-4'>
          <div>
            <CardTitle>Performance Chart</CardTitle>
            <CardDescription>
              Games played over time for the selected speed and date range.
            </CardDescription>
          </div>

          <div className='grid gap-3 md:grid-cols-2'>
            <div className='space-y-1.5'>
              <Label htmlFor='speed-filter'>Speed</Label>
              <Select
                value={speedFilter}
                onValueChange={(value) => setSpeedFilter(value as SpeedFilter)}
              >
                <SelectTrigger id='speed-filter' className='w-full'>
                  <SelectValue placeholder='Select speed' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All</SelectItem>
                  <SelectItem value='bullet'>Bullet</SelectItem>
                  <SelectItem value='blitz'>Blitz</SelectItem>
                  <SelectItem value='rapid'>Rapid</SelectItem>
                  <SelectItem value='classical'>Classical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-1.5'>
              <Label htmlFor='date-range'>Date Range</Label>
              <Select
                value={datePreset}
                onValueChange={(value) => setDatePreset(value as DatePreset)}
              >
                <SelectTrigger id='date-range' className='w-full'>
                  <SelectValue placeholder='Select range' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All time</SelectItem>
                  <SelectItem value='today'>Today</SelectItem>
                  <SelectItem value='week'>Past week</SelectItem>
                  <SelectItem value='month'>Past month</SelectItem>
                  <SelectItem value='year'>Past year</SelectItem>
                  <SelectItem value='custom'>Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {datePreset === 'custom' && (
            <div className='grid gap-3 md:grid-cols-2'>
              <div className='space-y-1.5'>
                <Label htmlFor='custom-from'>From</Label>
                <Input
                  id='custom-from'
                  type='date'
                  value={customFrom}
                  onChange={(event) => setCustomFrom(event.target.value)}
                />
              </div>
              <div className='space-y-1.5'>
                <Label htmlFor='custom-to'>To</Label>
                <Input
                  id='custom-to'
                  type='date'
                  value={customTo}
                  onChange={(event) => setCustomTo(event.target.value)}
                />
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent className='flex flex-1 flex-col'>
          <div className='text-muted-foreground mb-2 text-xs'>
            {speedLabel} · {stats.total} completed games
          </div>
          <ChartContainer
            config={chartConfig}
            className='aspect-auto h-[320px] w-full flex-1'
          >
            <LineChart data={chartData} margin={{ left: -10, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='label'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
              />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator='dot' />}
              />
              <Line
                dataKey='games'
                type='monotone'
                stroke='var(--color-games)'
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className='flex h-full min-h-[560px] flex-col gap-4'>
        <StatsGrid
          wins={stats.wins}
          losses={stats.losses}
          draws={stats.draws}
          total={stats.total}
        />
        <RatingsTable
          ratings={ratings}
          puzzleRating={puzzleRating}
          className='flex-1'
        />
      </div>
    </div>
  );
}
