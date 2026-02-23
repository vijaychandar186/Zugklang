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
import { Badge } from '@/components/ui/badge';
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
import { formatVariantLabel } from '@/lib/chess/variantLabels';

type SpeedFilter = 'all' | 'bullet' | 'blitz' | 'rapid' | 'classical';
type DatePreset = 'all' | 'today' | 'week' | 'month' | 'year' | 'custom';
type ResultFilter = 'all' | 'wins' | 'losses' | 'draws';

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
  const [variantFilter, setVariantFilter] = useState('all');
  const [resultFilter, setResultFilter] = useState<ResultFilter>('all');
  const [datePreset, setDatePreset] = useState<DatePreset>('all');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const variantOptions = useMemo(
    () =>
      Array.from(new Set(games.map((game) => game.variant))).sort((a, b) =>
        formatVariantLabel(a).localeCompare(formatVariantLabel(b))
      ),
    [games]
  );

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
        if (variantFilter !== 'all' && game.variant !== variantFilter) {
          return false;
        }
        const isWhite = game.whiteUserId === userId;
        const isWin =
          (game.result === '1-0' && isWhite) ||
          (game.result === '0-1' && !isWhite);
        const isDraw = game.result === '1/2-1/2';
        if (resultFilter === 'wins' && !isWin) return false;
        if (resultFilter === 'losses' && (isWin || isDraw)) return false;
        if (resultFilter === 'draws' && !isDraw) return false;

        const playedDate = getPlayedDate(game);
        if (!playedDate) return false;
        if (start && playedDate < start) return false;
        if (end && playedDate > end) return false;

        return true;
      }),
    [games, userId, speedFilter, variantFilter, resultFilter, start, end]
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
  const variantLabel =
    variantFilter === 'all'
      ? 'All variants'
      : formatVariantLabel(variantFilter);

  const variantRecords = useMemo(() => {
    const completedGames = games.filter(
      (game) =>
        (game.result === '1-0' ||
          game.result === '0-1' ||
          game.result === '1/2-1/2') &&
        (game.whiteUserId === userId || game.blackUserId === userId)
    );
    const recordByVariant = new Map<
      string,
      { games: number; wins: number; losses: number; draws: number }
    >();

    for (const game of completedGames) {
      const isWhite = game.whiteUserId === userId;
      const existing = recordByVariant.get(game.variant) ?? {
        games: 0,
        wins: 0,
        losses: 0,
        draws: 0
      };
      existing.games += 1;
      if (game.result === '1/2-1/2') {
        existing.draws += 1;
      } else if (
        (game.result === '1-0' && isWhite) ||
        (game.result === '0-1' && !isWhite)
      ) {
        existing.wins += 1;
      } else {
        existing.losses += 1;
      }
      recordByVariant.set(game.variant, existing);
    }

    return Array.from(recordByVariant.entries())
      .map(([variant, record]) => ({
        variant,
        ...record,
        winRate:
          record.games > 0 ? Math.round((record.wins / record.games) * 100) : 0
      }))
      .sort((a, b) => b.games - a.games);
  }, [games, userId]);

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
              <Label htmlFor='variant-filter'>Variant</Label>
              <Select value={variantFilter} onValueChange={setVariantFilter}>
                <SelectTrigger id='variant-filter' className='w-full'>
                  <SelectValue placeholder='Select variant' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All variants</SelectItem>
                  {variantOptions.map((variant) => (
                    <SelectItem key={variant} value={variant}>
                      {formatVariantLabel(variant)}
                    </SelectItem>
                  ))}
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
            <div className='space-y-1.5'>
              <Label htmlFor='result-filter'>Result</Label>
              <Select
                value={resultFilter}
                onValueChange={(value) =>
                  setResultFilter(value as ResultFilter)
                }
              >
                <SelectTrigger id='result-filter' className='w-full'>
                  <SelectValue placeholder='Select result' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All results</SelectItem>
                  <SelectItem value='wins'>Wins</SelectItem>
                  <SelectItem value='losses'>Losses</SelectItem>
                  <SelectItem value='draws'>Draws</SelectItem>
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
            {speedLabel} · {variantLabel} · {stats.total} completed games
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
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-base'>Variant Performance</CardTitle>
            <CardDescription>
              Completed results by variant, including custom modes.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-2'>
            {variantRecords.length === 0 ? (
              <p className='text-muted-foreground text-sm'>
                No completed games yet.
              </p>
            ) : (
              variantRecords.map((record) => (
                <div
                  key={record.variant}
                  className='flex items-center justify-between rounded-md border px-3 py-2'
                >
                  <div className='flex flex-col gap-1'>
                    <span className='text-sm font-medium'>
                      {formatVariantLabel(record.variant)}
                    </span>
                    <span className='text-muted-foreground text-xs'>
                      {record.games} games · {record.wins}W/{record.losses}L/
                      {record.draws}D
                    </span>
                  </div>
                  <Badge variant='outline' className='font-mono'>
                    {record.winRate}% WR
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
