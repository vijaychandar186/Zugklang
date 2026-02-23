'use client';
import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ColumnDef,
  Column,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Icons } from '@/components/Icons';
import { formatVariantLabel } from '@/lib/chess/variantLabels';
export interface GameRow {
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
export interface PuzzleAttemptRow {
  id: string;
  puzzleId: string;
  difficulty: string;
  rating: number;
  solved: boolean;
  usedHint: boolean;
  createdAt: Date;
}
export interface PuzzleRushRow {
  id: string;
  mode: string;
  difficulty: string;
  score: number;
  mistakes: number;
  timeLimitSeconds: number | null;
  maxMistakes: number | null;
  createdAt: Date;
}
export interface VisionSessionRow {
  id: string;
  trainingMode: string;
  colorMode: string;
  timeLimitSeconds: number;
  score: number;
  totalAttempts: number;
  accuracy: number;
  avgResponseTimeMs: number;
  createdAt: Date;
}
export interface MemorySessionRow {
  id: string;
  mode: string;
  pieceCount: number;
  memorizeTimeSeconds: number;
  correctPieces: number;
  totalPieces: number;
  accuracy: number;
  progressiveLevel: number | null;
  createdAt: Date;
}
export interface HistoryViewProps {
  games: GameRow[];
  gamesTotalCount: number;
  page: number;
  totalPages: number;
  userId: string;
  variantFilter: string;
  typeFilter: string;
  availableVariants: string[];
  puzzleAttempts: PuzzleAttemptRow[];
  puzzleRush: PuzzleRushRow[];
  memorySessions: MemorySessionRow[];
  visionSessions: VisionSessionRow[];
}
function HistoryContentSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='flex gap-1 rounded-lg border p-1'>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className='h-8 flex-1 rounded-md' />
        ))}
      </div>
      <Skeleton className='h-10 w-64' />
      <div className='overflow-hidden rounded-md border'>
        <div className='space-y-2 p-4'>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className='h-8 w-full' />
          ))}
        </div>
      </div>
    </div>
  );
}
function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date));
}
function buildPgn(moves: string[]) {
  return moves
    .map((move, i) =>
      i % 2 === 0 ? `${Math.floor(i / 2) + 1}. ${move}` : move
    )
    .join(' ');
}
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterColumn?: string;
  filterPlaceholder?: string;
}
function DataTable<TData, TValue>({
  columns,
  data,
  filterColumn,
  filterPlaceholder = 'Filter...'
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    initialState: { pagination: { pageSize: 25 } },
    state: { sorting, columnFilters }
  });
  return (
    <div className='space-y-3'>
      {filterColumn && (
        <Input
          placeholder={filterPlaceholder}
          value={
            (table.getColumn(filterColumn)?.getFilterValue() as string) ?? ''
          }
          onChange={(e) =>
            table.getColumn(filterColumn)?.setFilterValue(e.target.value)
          }
          className='max-w-sm'
        />
      )}
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id} className='px-4 py-2'>
                    {h.isPlaceholder
                      ? null
                      : flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className='px-4 py-2'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-between'>
        <p className='text-muted-foreground text-sm'>
          {table.getFilteredRowModel().rows.length} row
          {table.getFilteredRowModel().rows.length !== 1 ? 's' : ''}
        </p>
        <div className='flex items-center gap-2'>
          <span className='text-muted-foreground text-sm'>
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount() || 1}
          </span>
          <div className='flex items-center gap-1'>
            <Button
              variant='outline'
              size='icon'
              className='h-8 w-8'
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <Icons.chevronsLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              className='h-8 w-8'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <Icons.chevronLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              className='h-8 w-8'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <Icons.chevronRight className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              className='h-8 w-8'
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <Icons.chevronsRight className='h-4 w-4' />
            </Button>
          </div>
          <Select
            value={String(table.getState().pagination.pageSize)}
            onValueChange={(v) => table.setPageSize(Number(v))}
          >
            <SelectTrigger className='h-8 w-[80px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 25, 50, 100].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SortHeader({
  label,
  column
}: {
  label: string;
  column: Column<any, any>;
}) {
  return (
    <button
      className='flex items-center gap-1 font-medium'
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {label}
      {column.getIsSorted() === 'asc' ? (
        <Icons.arrowUp className='h-3 w-3' />
      ) : column.getIsSorted() === 'desc' ? (
        <Icons.arrowDown className='h-3 w-3' />
      ) : (
        <Icons.arrowUpDown className='h-3 w-3 opacity-40' />
      )}
    </button>
  );
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
function makeGameColumns(userId: string): ColumnDef<GameRow>[] {
  return [
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <SortHeader label='Date' column={column} />,
      cell: ({ row }) => (
        <span className='text-muted-foreground text-xs'>
          {formatDate(row.original.createdAt)}
        </span>
      )
    },
    {
      accessorKey: 'variant',
      header: ({ column }) => <SortHeader label='Variant' column={column} />,
      cell: ({ row }) => formatVariantLabel(row.original.variant)
    },
    {
      accessorKey: 'gameType',
      header: ({ column }) => <SortHeader label='Type' column={column} />,
      cell: ({ row }) => (
        <span className='text-muted-foreground text-xs capitalize'>
          {row.original.gameType}
        </span>
      )
    },
    {
      id: 'color',
      header: 'Color',
      cell: ({ row }) => {
        const isWhite = row.original.whiteUserId === userId;
        return (
          <span className='capitalize'>{isWhite ? 'White' : 'Black'}</span>
        );
      }
    },
    {
      id: 'opponent',
      header: 'Opponent',
      cell: ({ row }) => {
        const game = row.original;
        const isWhite = game.whiteUserId === userId;
        const opponent = isWhite ? game.black : game.white;
        if (game.gameType === 'computer') return 'Stockfish';
        if (game.gameType === 'local') return 'Local';
        if (game.variant === 'four-player') return 'Multiplayer (4P)';
        return opponent?.name ?? 'Opponent';
      },
      filterFn: (row, _colId, filterValue) => {
        const game = row.original;
        const isWhite = game.whiteUserId === userId;
        const opponent = isWhite ? game.black : game.white;
        const name =
          game.gameType === 'computer'
            ? 'Stockfish'
            : game.gameType === 'local'
              ? 'Local'
              : game.variant === 'four-player'
                ? 'Multiplayer (4P)'
                : (opponent?.name ?? 'Opponent');
        return name.toLowerCase().includes(filterValue.toLowerCase());
      }
    },
    {
      accessorKey: 'result',
      header: ({ column }) => <SortHeader label='Result' column={column} />,
      cell: ({ row }) => (
        <ResultBadge
          result={row.original.result}
          isWhite={row.original.whiteUserId === userId}
        />
      )
    },
    {
      accessorKey: 'moveCount',
      header: ({ column }) => <SortHeader label='Moves' column={column} />,
      cell: ({ row }) => (
        <span className='text-muted-foreground'>{row.original.moveCount}</span>
      )
    },
    {
      id: 'rating',
      header: ({ column }) => <SortHeader label='Rating Δ' column={column} />,
      accessorFn: (row) => {
        const isWhite = row.whiteUserId === userId;
        return isWhite ? row.whiteRatingDelta : row.blackRatingDelta;
      },
      cell: ({ row }) => {
        const isWhite = row.original.whiteUserId === userId;
        const delta = isWhite
          ? row.original.whiteRatingDelta
          : row.original.blackRatingDelta;
        if (delta == null)
          return <span className='text-muted-foreground'>—</span>;
        return (
          <span
            className={`font-mono text-xs ${delta >= 0 ? 'text-green-500' : 'text-red-500'}`}
          >
            {delta >= 0 ? '+' : ''}
            {delta}
          </span>
        );
      }
    },
    {
      id: 'review',
      header: '',
      cell: ({ row }) => {
        if (row.original.moves.length === 0) return null;
        const pgn = buildPgn(row.original.moves);
        const href = `/tools/game-review?pgn=${encodeURIComponent(pgn)}`;
        return (
          <Link href={href}>
            <Button variant='outline' size='sm'>
              Review
            </Button>
          </Link>
        );
      }
    }
  ];
}
const puzzleColumns: ColumnDef<PuzzleAttemptRow>[] = [
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <SortHeader label='Date' column={column} />,
    cell: ({ row }) => (
      <span className='text-muted-foreground text-xs'>
        {formatDate(row.original.createdAt)}
      </span>
    )
  },
  {
    accessorKey: 'difficulty',
    header: ({ column }) => <SortHeader label='Difficulty' column={column} />,
    cell: ({ row }) => (
      <span className='capitalize'>{row.original.difficulty}</span>
    )
  },
  {
    accessorKey: 'rating',
    header: ({ column }) => <SortHeader label='Rating' column={column} />
  },
  {
    accessorKey: 'solved',
    header: ({ column }) => <SortHeader label='Result' column={column} />,
    cell: ({ row }) =>
      row.original.solved ? (
        <Badge
          variant='outline'
          className='border-green-500 text-xs text-green-500'
        >
          Solved
        </Badge>
      ) : (
        <Badge
          variant='outline'
          className='border-red-500 text-xs text-red-500'
        >
          Failed
        </Badge>
      )
  },
  {
    accessorKey: 'usedHint',
    header: 'Hint',
    cell: ({ row }) => (row.original.usedHint ? 'Yes' : '—')
  }
];
const rushColumns: ColumnDef<PuzzleRushRow>[] = [
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <SortHeader label='Date' column={column} />,
    cell: ({ row }) => (
      <span className='text-muted-foreground text-xs'>
        {formatDate(row.original.createdAt)}
      </span>
    )
  },
  {
    accessorKey: 'mode',
    header: ({ column }) => <SortHeader label='Mode' column={column} />,
    cell: ({ row }) => <span className='capitalize'>{row.original.mode}</span>
  },
  {
    accessorKey: 'difficulty',
    header: ({ column }) => <SortHeader label='Difficulty' column={column} />,
    cell: ({ row }) => (
      <span className='capitalize'>{row.original.difficulty}</span>
    )
  },
  {
    accessorKey: 'score',
    header: ({ column }) => <SortHeader label='Score' column={column} />,
    cell: ({ row }) => (
      <span className='font-bold [color:var(--success)]'>
        {row.original.score}
      </span>
    )
  },
  {
    accessorKey: 'mistakes',
    header: ({ column }) => <SortHeader label='Mistakes' column={column} />,
    cell: ({ row }) => (
      <span className='text-destructive'>{row.original.mistakes}</span>
    )
  },
  {
    id: 'setting',
    header: 'Setting',
    cell: ({ row }) => {
      const r = row.original;
      if (r.mode === 'timed' && r.timeLimitSeconds != null)
        return `${r.timeLimitSeconds / 60} min`;
      if (r.mode === 'survival' && r.maxMistakes != null)
        return `${r.maxMistakes} lives`;
      return '—';
    }
  }
];
const memoryColumns: ColumnDef<MemorySessionRow>[] = [
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <SortHeader label='Date' column={column} />,
    cell: ({ row }) => (
      <span className='text-muted-foreground text-xs'>
        {formatDate(row.original.createdAt)}
      </span>
    )
  },
  {
    accessorKey: 'mode',
    header: ({ column }) => <SortHeader label='Mode' column={column} />,
    cell: ({ row }) => <span className='capitalize'>{row.original.mode}</span>
  },
  {
    accessorKey: 'pieceCount',
    header: ({ column }) => <SortHeader label='Pieces' column={column} />
  },
  {
    accessorKey: 'memorizeTimeSeconds',
    header: ({ column }) => <SortHeader label='Time (s)' column={column} />
  },
  {
    id: 'piecesCorrect',
    header: ({ column }) => <SortHeader label='Correct' column={column} />,
    accessorFn: (row) => row.correctPieces,
    cell: ({ row }) =>
      `${row.original.correctPieces}/${row.original.totalPieces}`
  },
  {
    accessorKey: 'accuracy',
    header: ({ column }) => <SortHeader label='Accuracy' column={column} />,
    cell: ({ row }) => {
      const pct = Math.round(row.original.accuracy * 100);
      return (
        <span
          className={
            pct >= 80
              ? '[color:var(--success)]'
              : pct >= 50
                ? 'text-yellow-500'
                : 'text-destructive'
          }
        >
          {pct}%
        </span>
      );
    }
  },
  {
    accessorKey: 'progressiveLevel',
    header: ({ column }) => <SortHeader label='Level' column={column} />,
    cell: ({ row }) =>
      row.original.progressiveLevel != null
        ? row.original.progressiveLevel
        : '—'
  }
];
const visionColumns: ColumnDef<VisionSessionRow>[] = [
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <SortHeader label='Date' column={column} />,
    cell: ({ row }) => (
      <span className='text-muted-foreground text-xs'>
        {formatDate(row.original.createdAt)}
      </span>
    )
  },
  {
    accessorKey: 'trainingMode',
    header: ({ column }) => <SortHeader label='Mode' column={column} />,
    cell: ({ row }) => (
      <span className='capitalize'>{row.original.trainingMode}</span>
    )
  },
  {
    accessorKey: 'colorMode',
    header: ({ column }) => <SortHeader label='Color' column={column} />,
    cell: ({ row }) => (
      <span className='capitalize'>{row.original.colorMode}</span>
    )
  },
  {
    accessorKey: 'timeLimitSeconds',
    header: ({ column }) => <SortHeader label='Time (s)' column={column} />
  },
  {
    accessorKey: 'score',
    header: ({ column }) => <SortHeader label='Score' column={column} />,
    cell: ({ row }) => (
      <span className='font-bold [color:var(--success)]'>
        {row.original.score}
      </span>
    )
  },
  {
    accessorKey: 'totalAttempts',
    header: ({ column }) => <SortHeader label='Attempts' column={column} />
  },
  {
    accessorKey: 'accuracy',
    header: ({ column }) => <SortHeader label='Accuracy' column={column} />,
    cell: ({ row }) => {
      const pct = Math.round(row.original.accuracy * 100);
      return (
        <span
          className={
            pct >= 80
              ? '[color:var(--success)]'
              : pct >= 50
                ? 'text-yellow-500'
                : 'text-destructive'
          }
        >
          {pct}%
        </span>
      );
    }
  },
  {
    accessorKey: 'avgResponseTimeMs',
    header: ({ column }) => <SortHeader label='Avg Response' column={column} />,
    cell: ({ row }) => `${row.original.avgResponseTimeMs}ms`
  }
];
type Tab = 'games' | 'puzzles' | 'rush' | 'memory' | 'vision';
export function HistoryView({
  games,
  gamesTotalCount,
  page,
  totalPages,
  userId,
  variantFilter,
  typeFilter,
  availableVariants,
  puzzleAttempts,
  puzzleRush,
  memorySessions,
  visionSessions
}: HistoryViewProps) {
  const router = useRouter();
  const [isRefreshing, startRefresh] = React.useTransition();
  const [activeTab, setActiveTab] = React.useState<Tab>('games');
  const gameColumns = React.useMemo(() => makeGameColumns(userId), [userId]);

  function buildFilterUrl(newVariant: string, newType: string, newPage = 1) {
    const params = new URLSearchParams();
    if (newVariant !== 'all') params.set('variant', newVariant);
    if (newType !== 'all') params.set('type', newType);
    if (newPage > 1) params.set('page', String(newPage));
    const qs = params.toString();
    return qs ? `/games?${qs}` : '/games';
  }

  const handleVariantChange = (value: string) => {
    router.push(buildFilterUrl(value, typeFilter));
  };

  const handleTypeChange = (value: string) => {
    router.push(buildFilterUrl(variantFilter, value));
  };

  const tabs: {
    id: Tab;
    label: string;
    count: number;
  }[] = [
    { id: 'games', label: 'Games', count: gamesTotalCount },
    { id: 'puzzles', label: 'Puzzles', count: puzzleAttempts.length },
    { id: 'rush', label: 'Puzzle Rush', count: puzzleRush.length },
    { id: 'memory', label: 'Memory', count: memorySessions.length },
    { id: 'vision', label: 'Vision', count: visionSessions.length }
  ];
  return (
    <div className='flex w-full flex-col gap-6 px-4 py-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>History</h1>
          <p className='text-muted-foreground text-sm'>
            All your activity across games and training modes
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            disabled={isRefreshing}
            onClick={() => startRefresh(() => router.refresh())}
          >
            {isRefreshing ? (
              <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <Icons.rotate className='mr-2 h-4 w-4' />
            )}
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Link href='/profile'>
            <Button variant='outline' size='sm'>
              Back to Profile
            </Button>
          </Link>
        </div>
      </div>

      {isRefreshing ? (
        <HistoryContentSkeleton />
      ) : (
        <>
          <div className='flex gap-1 rounded-lg border p-1'>
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === t.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs ${
                    activeTab === t.id
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {activeTab === 'games' && (
            <div className='space-y-4'>
              <div className='grid gap-3 md:grid-cols-2'>
                <div className='space-y-1.5'>
                  <label className='text-sm font-medium'>Variant</label>
                  <Select
                    value={variantFilter}
                    onValueChange={handleVariantChange}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='All variants' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All variants</SelectItem>
                      {availableVariants.map((variant) => (
                        <SelectItem key={variant} value={variant}>
                          {formatVariantLabel(variant)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-1.5'>
                  <label className='text-sm font-medium'>Game Type</label>
                  <Select value={typeFilter} onValueChange={handleTypeChange}>
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder='All game types' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='all'>All game types</SelectItem>
                      <SelectItem value='multiplayer'>Multiplayer</SelectItem>
                      <SelectItem value='computer'>Computer</SelectItem>
                      <SelectItem value='local'>Local</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DataTable
                columns={gameColumns}
                data={games}
                filterColumn='opponent'
                filterPlaceholder='Filter by opponent...'
              />

              {totalPages > 1 && (
                <div className='flex items-center justify-center gap-2'>
                  {page > 1 && (
                    <Link
                      href={buildFilterUrl(variantFilter, typeFilter, page - 1)}
                    >
                      <Button variant='outline' size='sm'>
                        Previous
                      </Button>
                    </Link>
                  )}
                  <span className='text-muted-foreground text-sm'>
                    Page {page} of {totalPages}
                  </span>
                  {page < totalPages && (
                    <Link
                      href={buildFilterUrl(variantFilter, typeFilter, page + 1)}
                    >
                      <Button variant='outline' size='sm'>
                        Next
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'puzzles' && (
            <DataTable
              columns={puzzleColumns}
              data={puzzleAttempts}
              filterColumn='difficulty'
              filterPlaceholder='Filter by difficulty...'
            />
          )}

          {activeTab === 'rush' && (
            <DataTable
              columns={rushColumns}
              data={puzzleRush}
              filterColumn='difficulty'
              filterPlaceholder='Filter by difficulty...'
            />
          )}

          {activeTab === 'memory' && (
            <DataTable
              columns={memoryColumns}
              data={memorySessions}
              filterColumn='mode'
              filterPlaceholder='Filter by mode...'
            />
          )}

          {activeTab === 'vision' && (
            <DataTable
              columns={visionColumns}
              data={visionSessions}
              filterColumn='trainingMode'
              filterPlaceholder='Filter by mode...'
            />
          )}
        </>
      )}
    </div>
  );
}
