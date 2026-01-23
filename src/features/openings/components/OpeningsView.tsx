'use client';

import { useMemo, useState, useCallback, useEffect } from 'react';
import { Chess } from '@/lib/chess';
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
import {
  MoveHistoryBase,
  type MoveData
} from '@/features/chess/components/sidebar/MoveHistoryBase';
import { NavigationControls } from '@/features/chess/components/sidebar/NavigationControls';
import { StandardActionBar } from '@/features/chess/components/sidebar';
import { AnalysisLines } from '@/features/analysis/components/AnalysisLines';
import { usePlayback } from '@/features/chess/hooks/usePlayback';
import { useBoardMounting } from '@/features/chess/hooks/useBoardMounting';
import { useEngineInit } from '@/features/chess/hooks/useEngineInit';
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

function getFenAtMoveIndex(pgn: string, moveIndex: number): string {
  try {
    const chess = new Chess();
    if (moveIndex === 0) return chess.fen();

    const moves = pgn
      .replace(/\d+\.\s*/g, '')
      .split(/\s+/)
      .filter((m) => m.length > 0);

    for (let i = 0; i < Math.min(moveIndex, moves.length); i++) {
      chess.move(moves[i]);
    }
    return chess.fen();
  } catch {
    return START_FEN;
  }
}

interface OpeningsViewProps {
  initialBoard3dEnabled?: boolean;
}

export function OpeningsView({ initialBoard3dEnabled }: OpeningsViewProps) {
  const [inputValue, setInputValue] = useState('');
  const [viewingMoveIndex, setViewingMoveIndex] = useState(0);

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

  const { isMounted, shouldShow3d, theme } = useBoardMounting({
    initialBoard3dEnabled
  });

  const { isAnalysisOn, isInitialized } = useAnalysisState();
  const { startAnalysis, endAnalysis, setPosition } = useAnalysisActions();
  const { uciLines } = useEngineAnalysis();

  useEngineInit();

  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 150);
    return () => clearTimeout(timer);
  }, [inputValue, setSearchQuery]);

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

  const currentMoves = selectedOpening
    ? parsePgnMoves(selectedOpening.pgn)
    : [];

  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

  useEffect(() => {
    if (selectedOpening) {
      setViewingMoveIndex(0);
      setShouldAutoPlay(true);
    }
  }, [selectedOpening]);

  const currentFen = selectedOpening
    ? getFenAtMoveIndex(selectedOpening.pgn, viewingMoveIndex)
    : START_FEN;

  const currentTurn = currentFen.split(' ')[1] === 'w' ? 'w' : 'b';

  useEffect(() => {
    if (isAnalysisOn && currentFen) {
      setPosition(currentFen, currentTurn);
    }
  }, [currentFen, currentTurn, isAnalysisOn, setPosition]);

  const analysisArrows = useChessArrows({
    isAnalysisOn,
    uciLines,
    showBestMoveArrow: true,
    showThreatArrow: false,
    playerColor: boardOrientation === 'white' ? 'w' : 'b',
    gameTurn: currentTurn,
    analysisTurn: currentTurn
  });

  const canGoBackMove = viewingMoveIndex > 0;
  const canGoForwardMove = viewingMoveIndex < currentMoves.length;

  const goToMoveStart = useCallback(() => setViewingMoveIndex(0), []);
  const goToMoveEnd = useCallback(
    () => setViewingMoveIndex(currentMoves.length),
    [currentMoves.length]
  );
  const goToMovePrev = useCallback(() => {
    if (viewingMoveIndex > 0) setViewingMoveIndex(viewingMoveIndex - 1);
  }, [viewingMoveIndex]);
  const goToMoveNext = useCallback(() => {
    if (viewingMoveIndex < currentMoves.length)
      setViewingMoveIndex(viewingMoveIndex + 1);
  }, [viewingMoveIndex, currentMoves.length]);
  const goToMoveIndex = useCallback((moveArrayIndex: number) => {
    setViewingMoveIndex(moveArrayIndex + 1);
  }, []);

  const { isPlaying, togglePlay, play } = usePlayback({
    currentIndex: viewingMoveIndex,
    totalItems: currentMoves.length + 1,
    onNext: goToMoveNext,
    enabled: currentMoves.length > 0
  });

  useEffect(() => {
    if (shouldAutoPlay && currentMoves.length > 0) {
      play();
      setShouldAutoPlay(false);
    }
  }, [shouldAutoPlay, currentMoves.length, play]);

  const handleSelectOpening = useCallback(
    (opening: Opening, index: number) => {
      setSelectedOpening(opening, index);
    },
    [setSelectedOpening]
  );

  const goToNextOpening = useCallback(() => {
    if (filteredOpenings.length === 0) return;
    const nextIndex =
      selectedIndex < filteredOpenings.length - 1 ? selectedIndex + 1 : 0;
    setSelectedOpening(filteredOpenings[nextIndex], nextIndex);
  }, [filteredOpenings, selectedIndex, setSelectedOpening]);

  const goToPrevOpening = useCallback(() => {
    if (filteredOpenings.length === 0) return;
    const prevIndex =
      selectedIndex > 0 ? selectedIndex - 1 : filteredOpenings.length - 1;
    setSelectedOpening(filteredOpenings[prevIndex], prevIndex);
  }, [filteredOpenings, selectedIndex, setSelectedOpening]);

  const handleToggleAnalysis = useCallback(() => {
    if (isAnalysisOn) {
      endAnalysis();
    } else {
      setPosition(currentFen, currentTurn);
      startAnalysis();
    }
  }, [
    isAnalysisOn,
    startAnalysis,
    endAnalysis,
    setPosition,
    currentFen,
    currentTurn
  ]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        goToNextOpening();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        goToPrevOpening();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToMovePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToMoveNext();
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
    goToNextOpening,
    goToPrevOpening,
    goToMoveNext,
    goToMovePrev,
    selectedOpening,
    toggleFavorite,
    handleToggleAnalysis
  ]);

  const boardProps = {
    position: currentFen,
    boardOrientation,
    canDrag: false,
    squareStyles: {},
    arrows: analysisArrows
  };

  return (
    <div className='flex min-h-screen flex-col gap-4 px-1 py-4 sm:px-4 lg:h-screen lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:overflow-hidden lg:px-6'>
      <div className='flex flex-col items-center gap-2'>
        <BoardContainer showEvaluation={isAnalysisOn}>
          {shouldShow3d ? (
            <Board3D {...boardProps} />
          ) : (
            <Board
              {...boardProps}
              darkSquareStyle={theme.darkSquareStyle}
              lightSquareStyle={theme.lightSquareStyle}
            />
          )}
        </BoardContainer>
      </div>

      <div className='flex w-full flex-col gap-2 sm:h-[400px] lg:h-[560px] lg:w-80 lg:overflow-hidden'>
        {isAnalysisOn && (
          <div className='bg-card w-full shrink-0 rounded-lg border'>
            <AnalysisLines />
          </div>
        )}

        <div className='bg-card flex min-h-[300px] w-full flex-col overflow-hidden rounded-lg border lg:min-h-0 lg:flex-1'>
          <div className='flex shrink-0 items-center justify-between gap-2 border-b px-4 py-3'>
            <h3 className='min-w-0 flex-1 font-semibold'>
              {selectedOpening ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='flex cursor-pointer items-center gap-2'>
                      <Badge variant='outline' className='shrink-0'>
                        {selectedOpening.eco}
                      </Badge>
                      <span className='truncate text-sm'>
                        {selectedOpening.name}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side='bottom' className='max-w-[280px]'>
                    <p className='font-medium'>
                      {selectedOpening.eco}: {selectedOpening.name}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                'Opening Explorer'
              )}
            </h3>
            {selectedOpening && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 shrink-0'
                    onClick={() => toggleFavorite(selectedOpening)}
                  >
                    <Icons.heart
                      className={`h-4 w-4 ${
                        isFavorite(selectedOpening)
                          ? 'fill-destructive text-destructive'
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
            )}
          </div>

          <ScrollArea className='h-[180px] lg:h-0 lg:min-h-0 lg:flex-1'>
            <div className='px-4 py-2'>
              <MoveHistoryBase
                items={currentMoves}
                viewingIndex={viewingMoveIndex}
                onMoveClick={goToMoveIndex}
                getWhiteMove={(item) => item}
                getBlackMove={(items, whiteIndex) =>
                  items[whiteIndex + 1] || null
                }
                emptyMessage='Select an opening to view moves'
              />
            </div>
          </ScrollArea>

          <NavigationControls
            viewingIndex={viewingMoveIndex}
            totalPositions={currentMoves.length + 1}
            canGoBack={canGoBackMove}
            canGoForward={canGoForwardMove}
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            onGoToStart={goToMoveStart}
            onGoToEnd={goToMoveEnd}
            onGoToPrev={goToMovePrev}
            onGoToNext={goToMoveNext}
          />

          <StandardActionBar
            onFlipBoard={toggleBoardOrientation}
            showEngine={true}
            isEngineOn={isAnalysisOn}
            isEngineDisabled={!isInitialized}
            onToggleEngine={handleToggleAnalysis}
            rightActions={
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={goToPrevOpening}
                      disabled={filteredOpenings.length === 0}
                    >
                      <Icons.chevronLeft className='h-4 w-4' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Previous Opening (↑/k)</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={goToNextOpening}
                      disabled={filteredOpenings.length === 0}
                    >
                      <Icons.chevronRight className='h-4 w-4' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Next Opening (↓/j)</TooltipContent>
                </Tooltip>
              </>
            }
          />
        </div>
      </div>

      <div className='flex w-full flex-col gap-2 sm:h-[400px] lg:h-[560px] lg:w-80 lg:overflow-hidden'>
        <div className='bg-card w-full shrink-0 rounded-lg border p-1'>
          <div className='flex w-full gap-1'>
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
              Favorites {isMounted && `(${favorites.length})`}
            </button>
          </div>
        </div>

        <div className='bg-card w-full shrink-0 rounded-lg border p-3'>
          <div className='flex w-full gap-2'>
            <div className='relative min-w-0 flex-1'>
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

        <div className='bg-card flex min-h-[300px] w-full flex-col overflow-hidden rounded-lg border lg:min-h-0 lg:flex-1'>
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
            <ScrollArea className='h-[180px] lg:h-0 lg:min-h-0 lg:flex-1'>
              <div className='w-full divide-y'>
                {filteredOpenings.map((opening, idx) => (
                  <div
                    key={`${opening.eco}-${opening.name}-${idx}`}
                    className={`group hover:bg-accent flex min-w-0 items-center justify-between gap-2 overflow-hidden transition-colors ${
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
                            <Icons.trash className='text-destructive h-3.5 w-3.5' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Remove from favorites</TooltipContent>
                      </Tooltip>
                    ) : (
                      isMounted &&
                      isFavorite(opening) && (
                        <Icons.heart className='fill-destructive text-destructive mr-3 h-3 w-3 shrink-0' />
                      )
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
}
