'use client';

import { useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
import { toast } from 'sonner';

import { PlayerInfo } from '@/features/chess/components/PlayerInfo';
import { MoveHistory } from '@/features/chess/components/sidebar/MoveHistory';
import { NavigationControls } from '@/features/chess/components/sidebar/NavigationControls';
import { UnifiedBoardWithPromotion } from '@/features/chess/components/board';
import { GameViewLayout } from '@/features/chess/components/layout';
import {
  SidebarPanel,
  SidebarHeader,
  StandardActionBar
} from '@/features/chess/components/sidebar';

import { useNavigation } from '@/features/chess/hooks/useNavigation';
import { usePromotion } from '@/features/chess/hooks/usePromotion';

import {
  usePuzzleState,
  usePuzzleStats,
  usePuzzleActions
} from '../stores/usePuzzleStore';
import { type Puzzle, type PuzzleDifficulty } from '../types';

import puzzlesData from '@/resources/puzzles.json';

interface PuzzleViewProps {
  initialBoard3dEnabled?: boolean;
}

const DIFFICULTY_LABELS: Record<PuzzleDifficulty, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  master: 'Master',
  elite: 'Elite'
};

const DIFFICULTY_COLORS: Record<PuzzleDifficulty, string> = {
  beginner: 'bg-[color:var(--success)]/20 [color:var(--success)]',
  intermediate: 'bg-primary/20 text-primary',
  advanced:
    'bg-[color:var(--classification-inaccuracy)]/20 [color:var(--classification-inaccuracy)]',
  master:
    'bg-[color:var(--classification-mistake)]/20 [color:var(--classification-mistake)]',
  elite: 'bg-destructive/20 text-destructive'
};

export function PuzzleView({ initialBoard3dEnabled }: PuzzleViewProps = {}) {
  const {
    currentPuzzle,
    puzzleIndex,
    difficulty,
    currentFEN,
    moves,
    positionHistory,
    viewingIndex,
    boardOrientation,
    status,
    solutionMoves,
    currentMoveIndex,
    playerTurn,
    showHint
  } = usePuzzleState();

  const { puzzlesSolved, puzzlesFailed, currentStreak, bestStreak } =
    usePuzzleStats();

  const {
    loadPuzzle,
    setDifficulty,
    makeMove,
    resetPuzzle,
    toggleHint,
    toggleBoardOrientation,
    goToMove
  } = usePuzzleActions();

  const puzzles = useMemo(() => {
    return (
      (puzzlesData as Record<PuzzleDifficulty, Puzzle[]>)[difficulty] || []
    );
  }, [difficulty]);

  const displayedFEN = useMemo(() => {
    return positionHistory[viewingIndex] || currentFEN;
  }, [positionHistory, viewingIndex, currentFEN]);

  const navigation = useNavigation({
    viewingIndex,
    totalPositions: positionHistory.length,
    onIndexChange: goToMove,
    playbackEnabled: status !== 'playing'
  });

  const promotion = usePromotion({
    fen: displayedFEN,
    onMove: makeMove
  });

  const hintArrow = useMemo(() => {
    if (!showHint || status !== 'playing' || !playerTurn) return [];

    const nextMove = solutionMoves[currentMoveIndex];
    if (!nextMove) return [];

    const from = nextMove.slice(0, 2);
    const to = nextMove.slice(2, 4);

    return [
      {
        startSquare: from,
        endSquare: to,
        color: 'color-mix(in srgb, var(--success) 60%, transparent)'
      }
    ];
  }, [showHint, status, playerTurn, solutionMoves, currentMoveIndex]);

  useEffect(() => {
    if (!currentPuzzle && puzzles.length > 0) {
      loadPuzzle(puzzles[0], 0);
    }
  }, [currentPuzzle, puzzles, loadPuzzle]);

  const handlePieceDrop = useCallback(
    ({
      sourceSquare,
      targetSquare
    }: {
      sourceSquare: string;
      targetSquare: string | null;
    }) => {
      if (!targetSquare) return false;
      if (sourceSquare === targetSquare) return false;
      if (status !== 'playing') return false;
      if (!playerTurn) return false;
      if (viewingIndex < positionHistory.length - 1) return false;

      const promotionTriggered = promotion.handleMoveWithPromotionCheck(
        sourceSquare,
        targetSquare
      );
      return promotionTriggered || !!makeMove(sourceSquare, targetSquare);
    },
    [
      status,
      playerTurn,
      viewingIndex,
      positionHistory.length,
      promotion,
      makeMove
    ]
  );

  const handleNextPuzzle = useCallback(() => {
    const nextIndex = (puzzleIndex + 1) % puzzles.length;
    loadPuzzle(puzzles[nextIndex], nextIndex);
    toast.success('Next puzzle loaded');
  }, [puzzleIndex, puzzles, loadPuzzle]);

  const handleDifficultyChange = useCallback(
    (newDifficulty: PuzzleDifficulty) => {
      setDifficulty(newDifficulty);
      const newPuzzles =
        (puzzlesData as Record<PuzzleDifficulty, Puzzle[]>)[newDifficulty] ||
        [];
      if (newPuzzles.length > 0) {
        loadPuzzle(newPuzzles[0], 0);
        toast.success(`Difficulty set to ${DIFFICULTY_LABELS[newDifficulty]}`);
      }
    },
    [setDifficulty, loadPuzzle]
  );

  const handleRandomPuzzle = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * puzzles.length);
    loadPuzzle(puzzles[randomIndex], randomIndex);
    toast.success('Random puzzle loaded');
  }, [puzzles, loadPuzzle]);

  const playerColor = boardOrientation;
  const opponentColor = playerColor === 'white' ? 'black' : 'white';

  return (
    <GameViewLayout
      topPlayerInfo={
        <PlayerInfo
          name={opponentColor === 'white' ? 'White' : 'Black'}
          subtitle='Opponent'
          isStockfish={false}
        />
      }
      bottomPlayerInfo={
        <PlayerInfo
          name={playerColor === 'white' ? 'White' : 'Black'}
          subtitle='You'
          isStockfish={false}
        />
      }
      showEvaluation={false}
      board={
        <UnifiedBoardWithPromotion
          position={displayedFEN}
          boardOrientation={boardOrientation}
          initialBoard3dEnabled={initialBoard3dEnabled}
          canDrag={
            status === 'playing' &&
            playerTurn &&
            viewingIndex === positionHistory.length - 1 &&
            !promotion.pendingPromotion
          }
          onPieceDrop={handlePieceDrop}
          arrows={hintArrow}
          pendingPromotion={promotion.pendingPromotion}
          onPromotionSelect={promotion.completePromotion}
          onPromotionCancel={promotion.cancelPromotion}
        />
      }
      sidebar={
        <>
          <SidebarPanel className='p-4'>
            <h4 className='mb-2 text-sm font-medium'>Stats</h4>
            <div className='grid grid-cols-4 gap-2 text-center'>
              <div>
                <p className='text-lg font-bold [color:var(--success)]'>
                  {puzzlesSolved}
                </p>
                <p className='text-muted-foreground text-xs'>Solved</p>
              </div>
              <div>
                <p className='text-destructive text-lg font-bold'>
                  {puzzlesFailed}
                </p>
                <p className='text-muted-foreground text-xs'>Failed</p>
              </div>
              <div>
                <p className='text-primary text-lg font-bold'>
                  {currentStreak}
                </p>
                <p className='text-muted-foreground text-xs'>Streak</p>
              </div>
              <div>
                <p className='text-lg font-bold [color:var(--classification-inaccuracy)]'>
                  {bestStreak}
                </p>
                <p className='text-muted-foreground text-xs'>Best</p>
              </div>
            </div>
          </SidebarPanel>

          <SidebarPanel flexible>
            <SidebarHeader
              title='Moves'
              actions={
                <Select
                  value={difficulty}
                  onValueChange={(v) =>
                    handleDifficultyChange(v as PuzzleDifficulty)
                  }
                >
                  <SelectTrigger className='w-[140px]'>
                    <SelectValue placeholder='Difficulty' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='beginner'>Beginner</SelectItem>
                    <SelectItem value='intermediate'>Intermediate</SelectItem>
                    <SelectItem value='advanced'>Advanced</SelectItem>
                    <SelectItem value='master'>Master</SelectItem>
                    <SelectItem value='elite'>Elite</SelectItem>
                  </SelectContent>
                </Select>
              }
            />

            <ScrollArea className='h-[120px] lg:h-0 lg:min-h-0 lg:flex-1'>
              <div className='px-4 py-2'>
                <MoveHistory
                  moves={moves}
                  viewingIndex={viewingIndex}
                  onMoveClick={navigation.goToMove}
                />
              </div>
            </ScrollArea>

            <NavigationControls
              viewingIndex={viewingIndex}
              totalPositions={positionHistory.length}
              canGoBack={navigation.canGoBack}
              canGoForward={navigation.canGoForward}
              isPlaying={navigation.isPlaying}
              onTogglePlay={navigation.togglePlay}
              onGoToStart={navigation.goToStart}
              onGoToEnd={navigation.goToEnd}
              onGoToPrev={navigation.goToPrev}
              onGoToNext={navigation.goToNext}
            />

            <StandardActionBar
              onFlipBoard={toggleBoardOrientation}
              showSettings
              leftActions={
                status === 'playing' ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={showHint ? 'default' : 'ghost'}
                        size='icon'
                        onClick={toggleHint}
                      >
                        <Icons.zap className='h-4 w-4' />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {showHint ? 'Hide Hint' : 'Show Hint'}
                    </TooltipContent>
                  </Tooltip>
                ) : null
              }
              rightActions={
                <>
                  {(status === 'failed' || status === 'playing') && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={resetPuzzle}
                        >
                          <Icons.rematch className='h-4 w-4' />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Retry Puzzle</TooltipContent>
                    </Tooltip>
                  )}

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={handleRandomPuzzle}
                      >
                        <Icons.shuffle className='h-4 w-4' />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Random Puzzle</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant='default'
                        size='icon'
                        onClick={handleNextPuzzle}
                      >
                        <Icons.chevronRight className='h-4 w-4' />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Next Puzzle</TooltipContent>
                  </Tooltip>
                </>
              }
            />
          </SidebarPanel>

          <SidebarPanel className='p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <h3 className='font-semibold'>Puzzle</h3>
                <Badge
                  variant='secondary'
                  className={DIFFICULTY_COLORS[difficulty]}
                >
                  {DIFFICULTY_LABELS[difficulty]}
                </Badge>
              </div>
              {currentPuzzle && (
                <span className='text-muted-foreground text-sm'>
                  Rating: {currentPuzzle.Rating}
                </span>
              )}
            </div>

            <div className='mt-3'>
              {status === 'playing' &&
                (playerTurn ? (
                  <div className='flex items-center gap-2'>
                    <Badge variant='secondary' className='text-xs'>
                      {boardOrientation === 'white' ? 'White' : 'Black'} to move
                    </Badge>
                    <span className='text-primary text-sm font-medium'>
                      Find the best move!
                    </span>
                  </div>
                ) : (
                  <Skeleton className='h-5 w-32' />
                ))}
              {status === 'success' && (
                <p className='font-medium [color:var(--success)]'>
                  Correct! Puzzle solved.
                </p>
              )}
              {status === 'failed' && (
                <p className='text-destructive font-medium'>
                  Incorrect. Try again or move to next puzzle.
                </p>
              )}
              {status === 'idle' && (
                <p className='text-muted-foreground text-sm'>
                  Select a difficulty to start
                </p>
              )}
            </div>

            {currentPuzzle?.Themes && (
              <div className='mt-3 flex flex-wrap gap-1'>
                {currentPuzzle.Themes.split(' ')
                  .slice(0, 4)
                  .map((theme) => (
                    <Badge key={theme} variant='secondary' className='text-xs'>
                      {theme}
                    </Badge>
                  ))}
              </div>
            )}
          </SidebarPanel>
        </>
      }
    />
  );
}
