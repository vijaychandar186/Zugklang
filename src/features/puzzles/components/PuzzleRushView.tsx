'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Chess, type PieceSymbol } from 'chess.js';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
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
import { PromotionDialog } from '@/features/chess/components/PromotionDialog';
import { MoveHistory } from '@/features/chess/components/sidebar/MoveHistory';
import { SettingsDialog } from '@/features/settings/components/SettingsDialog';

import { useBoardTheme } from '@/features/chess/hooks/useSquareInteraction';
import { useChessStore } from '@/features/chess/stores/useChessStore';

import { type Puzzle, type PuzzleDifficulty } from '../stores/usePuzzleStore';

import puzzlesData from '@/resources/puzzles.json';

interface PuzzleRushViewProps {
  initialBoard3dEnabled?: boolean;
}

type RushMode = 'timed' | 'survival';
type RushStatus = 'setup' | 'playing' | 'finished';

type PendingPromotion = {
  from: string;
  to: string;
  color: 'white' | 'black';
};

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

export function PuzzleRushView({
  initialBoard3dEnabled
}: PuzzleRushViewProps = {}) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [pendingPromotion, setPendingPromotion] =
    useState<PendingPromotion | null>(null);

  // Rush mode state
  const [rushStatus, setRushStatus] = useState<RushStatus>('setup');
  const [rushMode, setRushMode] = useState<RushMode>('timed');
  const [timeLimit, setTimeLimit] = useState(3); // minutes
  const [maxMistakes, setMaxMistakes] = useState(3);
  const [difficulty, setDifficulty] = useState<PuzzleDifficulty>('beginner');

  // Game state
  const [timeRemaining, setTimeRemaining] = useState(0); // seconds
  const [mistakes, setMistakes] = useState(0);
  const [score, setScore] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [puzzleQueue, setPuzzleQueue] = useState<Puzzle[]>([]);

  // Puzzle solving state
  const [game, setGame] = useState<Chess | null>(null);
  const [currentFEN, setCurrentFEN] = useState('');
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>(
    'white'
  );
  const [solutionMoves, setSolutionMoves] = useState<string[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [playerTurn, setPlayerTurn] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [moves, setMoves] = useState<string[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const theme = useBoardTheme();
  const board3dEnabled = useChessStore((s) => s.board3dEnabled);

  // Get puzzles for current difficulty
  const allPuzzles = useMemo(() => {
    return (
      (puzzlesData as Record<PuzzleDifficulty, Puzzle[]>)[difficulty] || []
    );
  }, [difficulty]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Timer logic
  useEffect(() => {
    if (rushStatus !== 'playing' || rushMode !== 'timed') return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setRushStatus('finished');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [rushStatus, rushMode]);

  // Check for game over in survival mode
  useEffect(() => {
    if (
      rushStatus === 'playing' &&
      rushMode === 'survival' &&
      mistakes >= maxMistakes
    ) {
      setRushStatus('finished');
    }
  }, [rushStatus, rushMode, mistakes, maxMistakes]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const loadNextPuzzle = useCallback(() => {
    if (puzzleQueue.length === 0) return;

    const [nextPuzzle, ...rest] = puzzleQueue;
    setPuzzleQueue(rest);
    setCurrentPuzzle(nextPuzzle);

    // Parse the puzzle
    const puzzleMoves = nextPuzzle.Moves.split(' ');
    const newGame = new Chess(nextPuzzle.FEN);

    // Make the first move (opponent's move)
    const firstMoveUci = puzzleMoves[0];
    const firstMoveResult = newGame.move({
      from: firstMoveUci.slice(0, 2),
      to: firstMoveUci.slice(2, 4),
      promotion: firstMoveUci.length > 4 ? firstMoveUci[4] : undefined
    });

    setGame(newGame);
    setCurrentFEN(newGame.fen());
    setSolutionMoves(puzzleMoves.slice(1));
    setCurrentMoveIndex(0);
    setPlayerTurn(true);
    setShowHint(false);
    setMoves(firstMoveResult ? [firstMoveResult.san] : []);

    // Set board orientation based on who plays next
    const turn = newGame.turn();
    setBoardOrientation(turn === 'w' ? 'white' : 'black');
  }, [puzzleQueue]);

  const startRush = () => {
    // Shuffle and prepare puzzle queue
    const shuffled = shuffleArray(allPuzzles);
    setPuzzleQueue(shuffled.slice(1));

    // Reset state
    setScore(0);
    setMistakes(0);
    setTimeRemaining(timeLimit * 60);
    setRushStatus('playing');

    // Load first puzzle
    const firstPuzzle = shuffled[0];
    setCurrentPuzzle(firstPuzzle);

    const puzzleMoves = firstPuzzle.Moves.split(' ');
    const newGame = new Chess(firstPuzzle.FEN);

    const firstMoveUci = puzzleMoves[0];
    const firstMoveResult = newGame.move({
      from: firstMoveUci.slice(0, 2),
      to: firstMoveUci.slice(2, 4),
      promotion: firstMoveUci.length > 4 ? firstMoveUci[4] : undefined
    });

    setGame(newGame);
    setCurrentFEN(newGame.fen());
    setSolutionMoves(puzzleMoves.slice(1));
    setCurrentMoveIndex(0);
    setPlayerTurn(true);
    setShowHint(false);
    setMoves(firstMoveResult ? [firstMoveResult.san] : []);

    const turn = newGame.turn();
    setBoardOrientation(turn === 'w' ? 'white' : 'black');
  };

  const handleIncorrectMove = useCallback(() => {
    setMistakes((prev) => prev + 1);
    toast.error('Incorrect!', { duration: 1000 });

    // Move to next puzzle
    setTimeout(() => {
      loadNextPuzzle();
    }, 500);
  }, [loadNextPuzzle]);

  const makeMove = useCallback(
    (from: string, to: string, promotion?: string): boolean => {
      if (!game || !playerTurn) return false;

      const expectedMove = solutionMoves[currentMoveIndex];
      const playerMove = `${from}${to}${promotion || ''}`;

      // Check if move matches expected
      const isCorrect =
        expectedMove === playerMove ||
        expectedMove === `${from}${to}` ||
        (expectedMove.startsWith(`${from}${to}`) && promotion);

      if (!isCorrect) {
        // Check if it's a valid chess move at all
        const testGame = new Chess(game.fen());
        try {
          testGame.move({ from, to, promotion });
        } catch {
          return false; // Invalid move
        }
        handleIncorrectMove();
        return true;
      }

      // Make the correct move
      const gameAfterPlayerMove = new Chess(game.fen());
      const playerMoveResult = gameAfterPlayerMove.move({
        from,
        to,
        promotion
      });

      const nextMoveIndex = currentMoveIndex + 1;

      // Check if puzzle is complete
      if (nextMoveIndex >= solutionMoves.length) {
        setGame(gameAfterPlayerMove);
        setCurrentFEN(gameAfterPlayerMove.fen());
        setPlayerTurn(false);
        if (playerMoveResult) {
          setMoves((prev) => [...prev, playerMoveResult.san]);
        }
        setScore((prev) => prev + 1);
        toast.success('Correct!', { duration: 1000 });

        // Load next puzzle after short delay
        setTimeout(() => {
          loadNextPuzzle();
        }, 500);
        return true;
      }

      // Make opponent's response
      const opponentMoveUci = solutionMoves[nextMoveIndex];
      const gameAfterOpponentMove = new Chess(gameAfterPlayerMove.fen());
      const opponentMoveResult = gameAfterOpponentMove.move({
        from: opponentMoveUci.slice(0, 2),
        to: opponentMoveUci.slice(2, 4),
        promotion: opponentMoveUci.length > 4 ? opponentMoveUci[4] : undefined
      });

      // Update state - show player's move first, then opponent's after delay
      setGame(gameAfterPlayerMove);
      setCurrentFEN(gameAfterPlayerMove.fen());
      setPlayerTurn(false);
      if (playerMoveResult) {
        setMoves((prev) => [...prev, playerMoveResult.san]);
      }

      setTimeout(() => {
        setGame(gameAfterOpponentMove);
        setCurrentFEN(gameAfterOpponentMove.fen());
        setCurrentMoveIndex(nextMoveIndex + 1);
        setPlayerTurn(true);
        if (opponentMoveResult) {
          setMoves((prev) => [...prev, opponentMoveResult.san]);
        }
      }, 300);

      return true;
    },
    [
      game,
      playerTurn,
      solutionMoves,
      currentMoveIndex,
      handleIncorrectMove,
      loadNextPuzzle
    ]
  );

  // Check if a move is a pawn promotion
  const isPromotionMove = useCallback(
    (from: string, to: string): boolean => {
      if (!game) return false;
      try {
        const piece = game.get(from as 'a1');
        if (!piece || piece.type !== 'p') return false;
        const targetRank = to[1];
        return targetRank === '8' || targetRank === '1';
      } catch {
        return false;
      }
    },
    [game]
  );

  const completePromotion = useCallback(
    (piece: PieceSymbol) => {
      if (!pendingPromotion) return;
      makeMove(pendingPromotion.from, pendingPromotion.to, piece);
      setPendingPromotion(null);
    },
    [pendingPromotion, makeMove]
  );

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
    if (rushStatus !== 'playing') return false;
    if (!playerTurn) return false;

    if (isPromotionMove(sourceSquare, targetSquare)) {
      if (!game) return false;
      const moves = game.moves({ square: sourceSquare as 'a1', verbose: true });
      const isLegal = moves.some((m) => m.to === targetSquare);
      if (isLegal) {
        const piece = game.get(sourceSquare as 'a1');
        setPendingPromotion({
          from: sourceSquare,
          to: targetSquare,
          color: piece?.color === 'w' ? 'white' : 'black'
        });
        return true;
      }
    }

    return makeMove(sourceSquare, targetSquare);
  };

  // Calculate hint arrow
  const hintArrow = useMemo(() => {
    if (!showHint || rushStatus !== 'playing' || !playerTurn) return [];

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
  }, [showHint, rushStatus, playerTurn, solutionMoves, currentMoveIndex]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playerColor = boardOrientation;
  const opponentColor = playerColor === 'white' ? 'black' : 'white';

  // Setup Dialog
  if (rushStatus === 'setup') {
    return (
      <div className='flex min-h-screen items-center justify-center p-4'>
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent
            className='max-h-[90vh] overflow-y-auto sm:max-w-md'
            showCloseButton={false}
          >
            <DialogHeader>
              <DialogTitle className='text-center text-xl'>
                Puzzle Rush
              </DialogTitle>
            </DialogHeader>
            <div className='space-y-6 py-4'>
              {/* Mode Selection */}
              <div className='space-y-3'>
                <Label className='block text-center'>Mode</Label>
                <Select
                  value={rushMode}
                  onValueChange={(v) => setRushMode(v as RushMode)}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select mode' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='timed'>Time Controlled</SelectItem>
                    <SelectItem value='survival'>Survival</SelectItem>
                  </SelectContent>
                </Select>
                <p className='text-muted-foreground text-center text-sm'>
                  {rushMode === 'timed'
                    ? 'Solve as many puzzles as you can before time runs out'
                    : 'Keep solving until you reach the mistake limit'}
                </p>
              </div>

              {/* Difficulty Selection */}
              <div className='space-y-3'>
                <Label className='block text-center'>Difficulty</Label>
                <Select
                  value={difficulty}
                  onValueChange={(v) => setDifficulty(v as PuzzleDifficulty)}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select difficulty' />
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

              {/* Time Slider (for timed mode) */}
              {rushMode === 'timed' && (
                <div className='space-y-3'>
                  <Label className='block text-center'>
                    Time Limit: {timeLimit} min
                  </Label>
                  <Slider
                    value={[timeLimit]}
                    onValueChange={(v) => setTimeLimit(v[0])}
                    min={1}
                    max={10}
                    step={1}
                    className='w-full'
                  />
                  <div className='text-muted-foreground flex justify-between text-xs'>
                    <span>1 min</span>
                    <span>10 min</span>
                  </div>
                </div>
              )}

              {/* Mistakes Slider (for survival mode) */}
              {rushMode === 'survival' && (
                <div className='space-y-3'>
                  <Label className='block text-center'>
                    Mistakes Allowed: {maxMistakes}
                  </Label>
                  <Slider
                    value={[maxMistakes]}
                    onValueChange={(v) => setMaxMistakes(v[0])}
                    min={1}
                    max={10}
                    step={1}
                    className='w-full'
                  />
                  <div className='text-muted-foreground flex justify-between text-xs'>
                    <span>1 mistake</span>
                    <span>10 mistakes</span>
                  </div>
                </div>
              )}

              <Button className='w-full' size='lg' onClick={startRush}>
                Start Rush
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Finished state
  if (rushStatus === 'finished') {
    return (
      <div className='flex min-h-screen items-center justify-center p-4'>
        <div className='bg-card w-full max-w-md rounded-lg border p-6 text-center'>
          <h2 className='mb-4 text-2xl font-bold'>Rush Complete!</h2>
          <div className='mb-6 space-y-4'>
            <div>
              <p className='text-muted-foreground text-sm'>Puzzles Solved</p>
              <p className='text-4xl font-bold text-green-600 dark:text-green-400'>
                {score}
              </p>
            </div>
            <div>
              <p className='text-muted-foreground text-sm'>Mistakes</p>
              <p className='text-2xl font-bold text-red-600 dark:text-red-400'>
                {mistakes}
              </p>
            </div>
            <div>
              <p className='text-muted-foreground text-sm'>Mode</p>
              <p className='text-lg'>
                {rushMode === 'timed'
                  ? `${timeLimit} min`
                  : `${maxMistakes} lives`}{' '}
                - {DIFFICULTY_LABELS[difficulty]}
              </p>
            </div>
          </div>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              className='flex-1'
              onClick={() => setRushStatus('setup')}
            >
              Change Settings
            </Button>
            <Button className='flex-1' onClick={startRush}>
              Play Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Playing state
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
                position={currentFEN}
                boardOrientation={boardOrientation}
                canDrag={
                  rushStatus === 'playing' && playerTurn && !pendingPromotion
                }
                onPieceDrop={handlePieceDrop}
                arrows={hintArrow}
              />
            ) : (
              <Board
                position={currentFEN}
                boardOrientation={boardOrientation}
                canDrag={
                  rushStatus === 'playing' && playerTurn && !pendingPromotion
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
        {/* Timer / Lives */}
        <div className='bg-card shrink-0 rounded-lg border p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              {rushMode === 'timed' ? (
                <>
                  <Icons.clock className='h-5 w-5' />
                  <span
                    className={`text-2xl font-bold tabular-nums ${timeRemaining <= 30 ? 'text-red-600 dark:text-red-400' : ''}`}
                  >
                    {formatTime(timeRemaining)}
                  </span>
                </>
              ) : (
                <>
                  <Icons.heart className='h-5 w-5 text-red-500' />
                  <span className='text-2xl font-bold'>
                    {maxMistakes - mistakes} / {maxMistakes}
                  </span>
                </>
              )}
            </div>
            <div className='text-right'>
              <p className='text-muted-foreground text-xs'>Score</p>
              <p className='text-2xl font-bold text-green-600 dark:text-green-400'>
                {score}
              </p>
            </div>
          </div>
        </div>

        {/* Moves */}
        <div className='bg-card flex min-h-[200px] flex-col rounded-lg border lg:min-h-0 lg:flex-1'>
          <div className='flex shrink-0 items-center justify-between border-b px-4 py-3'>
            <h3 className='font-semibold'>Moves</h3>
            <div className='flex items-center gap-2'>
              <Badge
                variant='secondary'
                className={DIFFICULTY_COLORS[difficulty]}
              >
                {DIFFICULTY_LABELS[difficulty]}
              </Badge>
              {currentPuzzle && (
                <span className='text-muted-foreground text-xs'>
                  {currentPuzzle.Rating}
                </span>
              )}
            </div>
          </div>

          <ScrollArea className='h-[120px] lg:h-0 lg:min-h-0 lg:flex-1'>
            <div className='px-4 py-2'>
              <MoveHistory
                moves={moves}
                viewingIndex={moves.length - 1}
                onMoveClick={() => {}}
              />
            </div>
          </ScrollArea>

          <div className='border-t px-4 py-2'>
            <div className='flex items-center gap-2'>
              <Badge variant='secondary' className='text-xs'>
                {boardOrientation === 'white' ? 'White' : 'Black'} to move
              </Badge>
              <span className='text-primary text-sm font-medium'>
                Find the best move!
              </span>
            </div>
            {/* Themes */}
            {currentPuzzle?.Themes && (
              <div className='mt-2 flex flex-wrap gap-1'>
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

        {/* Action bar */}
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
                    onClick={() =>
                      setBoardOrientation((o) =>
                        o === 'white' ? 'black' : 'white'
                      )
                    }
                  >
                    <Icons.flipBoard className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Flip Board</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={showHint ? 'default' : 'ghost'}
                    size='icon'
                    onClick={() => setShowHint((h) => !h)}
                  >
                    <Icons.zap className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {showHint ? 'Hide Hint' : 'Show Hint'}
                </TooltipContent>
              </Tooltip>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='destructive'
                  size='sm'
                  onClick={() => setRushStatus('finished')}
                >
                  End Rush
                </Button>
              </TooltipTrigger>
              <TooltipContent>End the rush early</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
