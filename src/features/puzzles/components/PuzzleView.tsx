'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { Chess, type PieceSymbol } from 'chess.js';
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

import { UnifiedChessBoard as Board } from '@/features/chess/components/Board';
import { Board3D } from '@/features/chess/components/Board3D';
import { BoardContainer } from '@/features/chess/components/BoardContainer';
import { PlayerInfo } from '@/features/chess/components/PlayerInfo';
import { MoveHistory } from '@/features/chess/components/sidebar/MoveHistory';
import { NavigationControls } from '@/features/chess/components/sidebar/NavigationControls';
import { SettingsDialog } from '@/features/settings/components/SettingsDialog';
import { PromotionDialog } from '@/features/chess/components/PromotionDialog';

import { useBoardTheme } from '@/features/chess/hooks/useSquareInteraction';
import { usePlayback } from '@/features/chess/hooks/usePlayback';
import { useChessStore } from '@/features/chess/stores/useChessStore';

import {
  usePuzzleState,
  usePuzzleStats,
  usePuzzleActions,
  type Puzzle,
  type PuzzleDifficulty
} from '../stores/usePuzzleStore';

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
  beginner: 'bg-green-500/20 text-green-600 dark:text-green-400',
  intermediate: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
  advanced: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
  master: 'bg-orange-500/20 text-orange-600 dark:text-orange-400',
  elite: 'bg-red-500/20 text-red-600 dark:text-red-400'
};

type PendingPromotion = {
  from: string;
  to: string;
  color: 'white' | 'black';
};

export function PuzzleView({ initialBoard3dEnabled }: PuzzleViewProps = {}) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [pendingPromotion, setPendingPromotion] =
    useState<PendingPromotion | null>(null);

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
    goToStart,
    goToEnd,
    goToPrev,
    goToNext,
    goToMove
  } = usePuzzleActions();

  const theme = useBoardTheme();
  const board3dEnabled = useChessStore((s) => s.board3dEnabled);

  // Get puzzles for current difficulty
  const puzzles = useMemo(() => {
    return (
      (puzzlesData as Record<PuzzleDifficulty, Puzzle[]>)[difficulty] || []
    );
  }, [difficulty]);

  const canGoBack = viewingIndex > 0;
  const canGoForward = viewingIndex < positionHistory.length - 1;

  const { isPlaying, togglePlay } = usePlayback({
    currentIndex: viewingIndex,
    totalItems: positionHistory.length,
    onNext: goToNext,
    enabled: status !== 'playing'
  });

  // Get the displayed position (for history navigation)
  const displayedFEN = useMemo(() => {
    return positionHistory[viewingIndex] || currentFEN;
  }, [positionHistory, viewingIndex, currentFEN]);

  // Calculate hint arrow
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
        color: 'rgba(0, 255, 0, 0.6)'
      }
    ];
  }, [showHint, status, playerTurn, solutionMoves, currentMoveIndex]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load first puzzle on mount if none loaded
  useEffect(() => {
    if (!currentPuzzle && puzzles.length > 0) {
      loadPuzzle(puzzles[0], 0);
    }
  }, [currentPuzzle, puzzles, loadPuzzle]);

  // Check if a move is a pawn promotion
  const isPromotionMove = useCallback(
    (from: string, to: string): boolean => {
      try {
        const game = new Chess(displayedFEN);
        const piece = game.get(from as 'a1');
        if (!piece || piece.type !== 'p') return false;
        const targetRank = to[1];
        return targetRank === '8' || targetRank === '1';
      } catch {
        return false;
      }
    },
    [displayedFEN]
  );

  // Complete promotion with selected piece
  const completePromotion = useCallback(
    (piece: PieceSymbol) => {
      if (!pendingPromotion) return;
      makeMove(pendingPromotion.from, pendingPromotion.to, piece);
      setPendingPromotion(null);
    },
    [pendingPromotion, makeMove]
  );

  // Cancel promotion
  const cancelPromotion = useCallback(() => {
    setPendingPromotion(null);
  }, []);

  const handlePieceDrop = ({
    sourceSquare,
    targetSquare
  }: {
    sourceSquare: string;
    targetSquare: string | null;
  }) => {
    if (!targetSquare) return false;
    if (status !== 'playing') return false;
    if (!playerTurn) return false;
    if (viewingIndex < positionHistory.length - 1) return false;

    // Check if this is a promotion move
    if (isPromotionMove(sourceSquare, targetSquare)) {
      // Validate move is legal before showing dialog
      try {
        const game = new Chess(displayedFEN);
        const moves = game.moves({
          square: sourceSquare as 'a1',
          verbose: true
        });
        const isLegal = moves.some((m) => m.to === targetSquare);
        if (isLegal) {
          const piece = game.get(sourceSquare as 'a1');
          setPendingPromotion({
            from: sourceSquare,
            to: targetSquare,
            color: piece?.color === 'w' ? 'white' : 'black'
          });
          return true; // Return true to prevent piece snapping back
        }
      } catch {
        return false;
      }
    }

    const move = makeMove(sourceSquare, targetSquare);
    return !!move;
  };

  const handleNextPuzzle = () => {
    const nextIndex = (puzzleIndex + 1) % puzzles.length;
    loadPuzzle(puzzles[nextIndex], nextIndex);
    toast.success('Next puzzle loaded');
  };

  const handleDifficultyChange = (newDifficulty: PuzzleDifficulty) => {
    setDifficulty(newDifficulty);
    const newPuzzles =
      (puzzlesData as Record<PuzzleDifficulty, Puzzle[]>)[newDifficulty] || [];
    if (newPuzzles.length > 0) {
      loadPuzzle(newPuzzles[0], 0);
      toast.success(`Difficulty set to ${DIFFICULTY_LABELS[newDifficulty]}`);
    }
  };

  const handleRandomPuzzle = () => {
    const randomIndex = Math.floor(Math.random() * puzzles.length);
    loadPuzzle(puzzles[randomIndex], randomIndex);
    toast.success('Random puzzle loaded');
  };

  // Determine who is playing
  const playerColor = boardOrientation;
  const opponentColor = playerColor === 'white' ? 'black' : 'white';

  return (
    <div className='flex min-h-screen flex-col gap-4 px-1 py-4 sm:px-4 lg:h-screen lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:overflow-hidden lg:px-6'>
      {/* Left column - Board */}
      <div className='flex flex-col items-center gap-2'>
        <div className='flex w-full items-center py-2'>
          <PlayerInfo
            name={opponentColor === 'white' ? 'White' : 'Black'}
            subtitle='Opponent'
            isStockfish={false}
          />
        </div>

        <BoardContainer showEvaluation={false}>
          <div className='relative'>
            {(isMounted ? board3dEnabled : (initialBoard3dEnabled ?? false)) ? (
              <Board3D
                position={displayedFEN}
                boardOrientation={boardOrientation}
                canDrag={
                  status === 'playing' &&
                  playerTurn &&
                  viewingIndex === positionHistory.length - 1 &&
                  !pendingPromotion
                }
                onPieceDrop={handlePieceDrop}
                arrows={hintArrow}
              />
            ) : (
              <Board
                position={displayedFEN}
                boardOrientation={boardOrientation}
                canDrag={
                  status === 'playing' &&
                  playerTurn &&
                  viewingIndex === positionHistory.length - 1 &&
                  !pendingPromotion
                }
                onPieceDrop={handlePieceDrop}
                darkSquareStyle={theme.darkSquareStyle}
                lightSquareStyle={theme.lightSquareStyle}
                arrows={hintArrow}
              />
            )}
            <PromotionDialog
              isOpen={!!pendingPromotion}
              color={pendingPromotion?.color || 'white'}
              targetSquare={pendingPromotion?.to || 'a8'}
              boardOrientation={boardOrientation}
              onSelect={completePromotion}
              onCancel={cancelPromotion}
            />
          </div>
        </BoardContainer>

        <div className='flex w-full items-center py-2'>
          <PlayerInfo
            name={playerColor === 'white' ? 'White' : 'Black'}
            subtitle='You'
            isStockfish={false}
          />
        </div>
      </div>

      {/* Right column - Sidebar */}
      <div className='flex w-full flex-col gap-2 sm:h-[400px] lg:h-[560px] lg:w-80 lg:overflow-hidden'>
        {/* Stats Card */}
        <div className='bg-card shrink-0 rounded-lg border p-4'>
          <h4 className='mb-2 text-sm font-medium'>Stats</h4>
          <div className='grid grid-cols-4 gap-2 text-center'>
            <div>
              <p className='text-lg font-bold text-green-600 dark:text-green-400'>
                {puzzlesSolved}
              </p>
              <p className='text-muted-foreground text-xs'>Solved</p>
            </div>
            <div>
              <p className='text-lg font-bold text-red-600 dark:text-red-400'>
                {puzzlesFailed}
              </p>
              <p className='text-muted-foreground text-xs'>Failed</p>
            </div>
            <div>
              <p className='text-primary text-lg font-bold'>{currentStreak}</p>
              <p className='text-muted-foreground text-xs'>Streak</p>
            </div>
            <div>
              <p className='text-lg font-bold text-yellow-600 dark:text-yellow-400'>
                {bestStreak}
              </p>
              <p className='text-muted-foreground text-xs'>Best</p>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className='bg-card flex min-h-[200px] flex-col rounded-lg border lg:min-h-0 lg:flex-1'>
          <div className='flex shrink-0 items-center justify-between border-b px-4 py-3'>
            <h3 className='font-semibold'>Moves</h3>
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
          </div>

          <ScrollArea className='h-[120px] lg:h-0 lg:min-h-0 lg:flex-1'>
            <div className='px-4 py-2'>
              <MoveHistory
                moves={moves}
                viewingIndex={viewingIndex}
                onMoveClick={goToMove}
              />
            </div>
          </ScrollArea>

          <NavigationControls
            viewingIndex={viewingIndex}
            totalPositions={positionHistory.length}
            canGoBack={canGoBack}
            canGoForward={canGoForward}
            isPlaying={isPlaying}
            onTogglePlay={togglePlay}
            onGoToStart={goToStart}
            onGoToEnd={goToEnd}
            onGoToPrev={goToPrev}
            onGoToNext={goToNext}
          />

          {/* Action bar */}
          <div className='bg-muted/50 flex items-center justify-between border-t p-2'>
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

              {status === 'playing' && (
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
              )}
            </div>

            <div className='flex items-center gap-1'>
              {(status === 'failed' || status === 'playing') && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant='ghost' size='icon' onClick={resetPuzzle}>
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
            </div>
          </div>
        </div>

        {/* Puzzle Info Card */}
        <div className='bg-card shrink-0 rounded-lg border p-4'>
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

          {/* Status message */}
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
              <p className='font-medium text-green-600 dark:text-green-400'>
                Correct! Puzzle solved.
              </p>
            )}
            {status === 'failed' && (
              <p className='font-medium text-red-600 dark:text-red-400'>
                Incorrect. Try again or move to next puzzle.
              </p>
            )}
            {status === 'idle' && (
              <p className='text-muted-foreground text-sm'>
                Select a difficulty to start
              </p>
            )}
          </div>

          {/* Themes */}
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
        </div>
      </div>

      {/* Dialogs */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
