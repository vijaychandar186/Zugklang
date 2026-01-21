'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { BoardContainer } from '@/features/chess/components/BoardContainer';
import { UnifiedChessBoard as Board } from '@/features/chess/components/Board';
import { Board3D } from '@/features/chess/components/Board3D';
import { SettingsDialog } from '@/features/settings/components/SettingsDialog';
import { useBoardTheme } from '@/features/chess/hooks/useSquareInteraction';
import {
  MoveHistoryBase,
  type MoveData
} from '@/features/chess/components/sidebar/MoveHistoryBase';
import { useChessState } from '@/features/chess/stores/useChessStore';
import {
  useAnalysisState,
  useAnalysisActions,
  useEngineAnalysis
} from '@/features/chess/stores/useAnalysisStore';
import { useChessArrows } from '@/features/chess/hooks/useChessArrows';
import { useOpeningsStore } from '../stores/useOpeningsStore';
import type { Opening, SortOption } from '../types';

import openingsData from '@/resources/eco-openings.json';

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// Parse PGN to get FEN
function pgnToFen(pgn: string): string {
  try {
    const chess = new Chess();
    const moves = pgn
      .replace(/\d+\.\s*/g, '')
      .split(/\s+/)
      .filter((m) => m.length > 0);
    for (const move of moves) {
      chess.move(move);
    }
    return chess.fen();
  } catch {
    return START_FEN;
  }
}

// Parse PGN to get move list as MoveData
function parsePgnMoves(pgn: string): MoveData[] {
  const moves: MoveData[] = [];
  const parts = pgn.split(/\s+/);
  for (const part of parts) {
    if (!part.match(/^\d+\.$/)) {
      moves.push({ san: part });
    }
  }
  return moves;
}

interface OpeningsViewProps {
  initialBoard3dEnabled?: boolean;
}

export function OpeningsView({ initialBoard3dEnabled }: OpeningsViewProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  const {
    selectedOpening,
    selectedIndex,
    searchQuery,
    sortOption,
    activeTab,
    boardOrientation,
    favorites,
    setSelectedOpening,
    setSearchQuery,
    setSortOption,
    setActiveTab,
    toggleBoardOrientation,
    toggleFavorite,
    removeFavorite,
    isFavorite,
    getFavoriteKey
  } = useOpeningsStore();

  const { board3dEnabled } = useChessState();
  const theme = useBoardTheme();

  // Analysis state
  const { isAnalysisOn, isInitialized } = useAnalysisState();
  const { initializeEngine, startAnalysis, endAnalysis, setPosition, cleanup } =
    useAnalysisActions();
  const { uciLines } = useEngineAnalysis();

  // Mount tracking
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize engine on mount
  useEffect(() => {
    initializeEngine();
    return () => cleanup();
  }, [initializeEngine, cleanup]);

  // Sync input with store
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 150);
    return () => clearTimeout(timer);
  }, [inputValue, setSearchQuery]);

  // Parse favorites back to openings
  const favoriteOpenings = useMemo(() => {
    const openings = openingsData as Opening[];
    return favorites
      .map((key) => {
        const [eco, name, pgn] = key.split('::');
        return openings.find(
          (o) => o.eco === eco && o.name === name && o.pgn === pgn
        );
      })
      .filter((o): o is Opening => o !== undefined);
  }, [favorites]);

  // Filter and sort openings
  const filteredOpenings = useMemo(() => {
    const baseOpenings =
      activeTab === 'favorites'
        ? favoriteOpenings
        : (openingsData as Opening[]);

    let filtered = baseOpenings;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = baseOpenings.filter(
        (o) =>
          o.name.toLowerCase().includes(query) ||
          o.eco.toLowerCase().includes(query)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'eco':
          return a.eco.localeCompare(b.eco) || a.name.localeCompare(b.name);
        case 'eco-desc':
          return b.eco.localeCompare(a.eco) || b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return sorted;
  }, [searchQuery, sortOption, activeTab, favoriteOpenings]);

  // Get current position
  const currentFen = selectedOpening
    ? pgnToFen(selectedOpening.pgn)
    : START_FEN;

  // Get moves for display
  const currentMoves = selectedOpening
    ? parsePgnMoves(selectedOpening.pgn)
    : [];

  // Update analysis position when opening changes
  useEffect(() => {
    if (isAnalysisOn && currentFen) {
      setPosition(currentFen);
    }
  }, [currentFen, isAnalysisOn, setPosition]);

  // Get turn from FEN
  const currentTurn = currentFen.split(' ')[1] === 'w' ? 'w' : 'b';

  // Analysis arrows
  const analysisArrows = useChessArrows({
    isAnalysisOn,
    uciLines,
    showBestMoveArrow: true,
    showThreatArrow: false,
    playerColor: boardOrientation === 'white' ? 'w' : 'b',
    gameTurn: currentTurn,
    analysisTurn: currentTurn
  });

  // Handle opening selection
  const handleSelectOpening = useCallback(
    (opening: Opening, index: number) => {
      setSelectedOpening(opening, index);
    },
    [setSelectedOpening]
  );

  // Navigate to next/prev opening
  const goToNext = useCallback(() => {
    if (filteredOpenings.length === 0) return;
    const nextIndex =
      selectedIndex < filteredOpenings.length - 1 ? selectedIndex + 1 : 0;
    setSelectedOpening(filteredOpenings[nextIndex], nextIndex);
  }, [filteredOpenings, selectedIndex, setSelectedOpening]);

  const goToPrev = useCallback(() => {
    if (filteredOpenings.length === 0) return;
    const prevIndex =
      selectedIndex > 0 ? selectedIndex - 1 : filteredOpenings.length - 1;
    setSelectedOpening(filteredOpenings[prevIndex], prevIndex);
  }, [filteredOpenings, selectedIndex, setSelectedOpening]);

  // Toggle analysis
  const handleToggleAnalysis = useCallback(() => {
    if (isAnalysisOn) {
      endAnalysis();
    } else {
      setPosition(currentFen);
      startAnalysis();
    }
  }, [isAnalysisOn, startAnalysis, endAnalysis, setPosition, currentFen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        goToPrev();
      } else if (e.key === 'f') {
        if (selectedOpening) {
          toggleFavorite(selectedOpening);
        }
      } else if (e.key === 'e') {
        handleToggleAnalysis();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    goToNext,
    goToPrev,
    selectedOpening,
    toggleFavorite,
    handleToggleAnalysis
  ]);

  // Board props
  const boardProps = {
    position: currentFen,
    boardOrientation,
    canDrag: false,
    squareStyles: {},
    arrows: analysisArrows
  };

  // Use initialBoard3dEnabled for SSR, then fall back to store
  const shouldShow3d = isMounted
    ? board3dEnabled
    : (initialBoard3dEnabled ?? false);

  return (
    <div className='flex min-h-screen flex-col gap-4 px-1 py-4 sm:px-4 lg:h-screen lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:overflow-hidden lg:px-6'>
      {/* Board */}
      <div className='flex flex-col items-center gap-2'>
        <BoardContainer showEvaluation={isAnalysisOn}>
          <div className='w-[calc(100vw-0.5rem)] sm:w-[400px] lg:w-[560px]'>
            {shouldShow3d ? (
              <Board3D {...boardProps} />
            ) : (
              <Board
                {...boardProps}
                darkSquareStyle={theme.darkSquareStyle}
                lightSquareStyle={theme.lightSquareStyle}
              />
            )}
          </div>
        </BoardContainer>
      </div>

      {/* Sidebar */}
      <div className='flex w-full flex-col gap-2 sm:h-[400px] lg:h-[560px] lg:w-80 lg:overflow-hidden'>
        {/* Header */}
        <div className='bg-card shrink-0 rounded-lg border p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg'>
                <Icons.book className='text-primary h-6 w-6' />
              </div>
              <div>
                <h2 className='font-semibold'>Opening Explorer</h2>
                <Badge variant='secondary'>
                  {filteredOpenings.length.toLocaleString()} openings
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Current opening info */}
        {selectedOpening && (
          <div className='bg-card shrink-0 rounded-lg border p-4'>
            <div className='flex items-start justify-between gap-2'>
              <div className='min-w-0 flex-1'>
                <div className='flex items-center gap-2'>
                  <Badge variant='outline' className='shrink-0'>
                    {selectedOpening.eco}
                  </Badge>
                  <h3 className='truncate font-medium'>
                    {selectedOpening.name}
                  </h3>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => toggleFavorite(selectedOpening)}
                  >
                    <Icons.heart
                      className={`h-4 w-4 ${
                        isFavorite(selectedOpening)
                          ? 'fill-red-500 text-red-500'
                          : ''
                      }`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isFavorite(selectedOpening)
                    ? 'Remove from favorites'
                    : 'Add to favorites'}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        )}

        {/* Move History */}
        <div className='bg-card shrink-0 rounded-lg border'>
          <ScrollArea className='h-[100px]'>
            <div className='px-4 py-2'>
              <MoveHistoryBase
                items={currentMoves}
                viewingIndex={currentMoves.length}
                onMoveClick={() => {}}
                getWhiteMove={(item) => item}
                getBlackMove={(items, whiteIndex) =>
                  items[whiteIndex + 1] || null
                }
                emptyMessage='Select an opening to view moves'
              />
            </div>
          </ScrollArea>
        </div>

        {/* Tabs */}
        <div className='bg-card shrink-0 rounded-lg border p-1'>
          <div className='flex gap-1'>
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === 'favorites'
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              Favorites ({favorites.length})
            </button>
          </div>
        </div>

        {/* Search and filters */}
        <div className='bg-card shrink-0 rounded-lg border p-3'>
          <div className='flex gap-2'>
            <div className='relative flex-1'>
              <input
                type='text'
                placeholder='Search by name or ECO...'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className='bg-background border-input placeholder:text-muted-foreground focus:ring-ring w-full rounded-md border px-3 py-2 text-sm focus:ring-1 focus:outline-none'
              />
            </div>
            <Select
              value={sortOption}
              onValueChange={(v) => setSortOption(v as SortOption)}
            >
              <SelectTrigger className='w-[100px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='eco'>ECO</SelectItem>
                <SelectItem value='eco-desc'>ECO (Z-A)</SelectItem>
                <SelectItem value='name'>Name</SelectItem>
                <SelectItem value='name-desc'>Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Openings list */}
        <div className='bg-card flex flex-1 flex-col overflow-hidden rounded-lg border'>
          <div className='flex-1 overflow-y-auto'>
            {filteredOpenings.length === 0 ? (
              <div className='flex h-full flex-col items-center justify-center gap-2 p-4'>
                <Icons.book className='text-muted-foreground h-8 w-8' />
                <p className='text-muted-foreground text-sm'>
                  {activeTab === 'favorites'
                    ? 'No favorites yet'
                    : 'No openings found'}
                </p>
              </div>
            ) : (
              <div className='divide-y'>
                {filteredOpenings.map((opening, idx) => (
                  <div
                    key={`${opening.eco}-${opening.name}-${idx}`}
                    className={`group hover:bg-accent flex items-center justify-between gap-2 transition-colors ${
                      selectedIndex === idx ? 'bg-accent' : ''
                    }`}
                  >
                    <button
                      onClick={() => handleSelectOpening(opening, idx)}
                      className='flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-left'
                    >
                      <Badge
                        variant='outline'
                        className='shrink-0 font-mono text-xs'
                      >
                        {opening.eco}
                      </Badge>
                      <span className='truncate text-sm'>{opening.name}</span>
                    </button>
                    {activeTab === 'favorites' ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='mr-1 h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100'
                            onClick={() =>
                              removeFavorite(getFavoriteKey(opening))
                            }
                          >
                            <Icons.trash className='h-3.5 w-3.5 text-red-500' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Remove from favorites</TooltipContent>
                      </Tooltip>
                    ) : (
                      isFavorite(opening) && (
                        <Icons.heart className='mr-3 h-3 w-3 shrink-0 fill-red-500 text-red-500' />
                      )
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className='bg-card shrink-0 rounded-lg border p-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setSettingsOpen(true)}
                  >
                    <Icons.settings className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Settings</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={toggleBoardOrientation}
                  >
                    <Icons.flipBoard className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Flip Board</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isAnalysisOn ? 'default' : 'ghost'}
                    size='icon'
                    onClick={handleToggleAnalysis}
                    disabled={!isInitialized}
                  >
                    <Icons.engine className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isAnalysisOn
                    ? 'Turn Off Analysis (e)'
                    : 'Turn On Analysis (e)'}
                </TooltipContent>
              </Tooltip>
            </div>

            <div className='flex items-center gap-1'>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={goToPrev}
                    disabled={filteredOpenings.length === 0}
                  >
                    <Icons.chevronLeft className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Previous (↑/k)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={goToNext}
                    disabled={filteredOpenings.length === 0}
                  >
                    <Icons.chevronRight className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Next (↓/j)</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
