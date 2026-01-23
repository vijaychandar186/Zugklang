'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Chess, type PieceSymbol } from '@/lib/chess';
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
import { StandardActionBar } from '@/features/chess/components/sidebar';
import { StatBox } from '@/features/chess/components/common';
import { useBoardMounting } from '@/features/chess/hooks/useBoardMounting';

import { type Puzzle, type PuzzleDifficulty } from '../types';

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
  beginner: 'bg-[color:var(--success)]/20 [color:var(--success)]',
  intermediate: 'bg-primary/20 text-primary',
  advanced:
    'bg-[color:var(--classification-inaccuracy)]/20 [color:var(--classification-inaccuracy)]',
  master:
    'bg-[color:var(--classification-mistake)]/20 [color:var(--classification-mistake)]',
  elite: 'bg-destructive/20 text-destructive'
};

export function PuzzleRushView({
  initialBoard3dEnabled
}: PuzzleRushViewProps = {}) {
  const [pendingPromotion, setPendingPromotion] =
    useState<PendingPromotion | null>(null);

  const [rushStatus, setRushStatus] = useState<RushStatus>('setup');
  const [rushMode, setRushMode] = useState<RushMode>('timed');
  const [timeLimit, setTimeLimit] = useState(3);
  const [maxMistakes, setMaxMistakes] = useState(3);
  const [difficulty, setDifficulty] = useState<PuzzleDifficulty>('beginner');

  const [timeRemaining, setTimeRemaining] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [score, setScore] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [puzzleQueue, setPuzzleQueue] = useState<Puzzle[]>([]);

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
  const { shouldShow3d, theme } = useBoardMounting({ initialBoard3dEnabled });

  const allPuzzles = useMemo(() => {
    return (
      (puzzlesData as Record<PuzzleDifficulty, Puzzle[]>)[difficulty] || []
    );
  }, [difficulty]);

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

    const puzzleMoves = nextPuzzle.Moves.split(' ');
    const newGame = new Chess(nextPuzzle.FEN);

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
  }, [puzzleQueue]);

  const startRush = () => {
    const shuffled = shuffleArray(allPuzzles);
    setPuzzleQueue(shuffled.slice(1));

    setScore(0);
    setMistakes(0);
    setTimeRemaining(timeLimit * 60);
    setRushStatus('playing');

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

    setTimeout(() => {
      loadNextPuzzle();
    }, 500);
  }, [loadNextPuzzle]);

  const makeMove = useCallback(
    (from: string, to: string, promotion?: string): boolean => {
      if (!game || !playerTurn) return false;
      if (from === to) return false;

      const expectedMove = solutionMoves[currentMoveIndex];
      const playerMove = `${from}${to}${promotion || ''}`;

      const isCorrect =
        expectedMove === playerMove ||
        expectedMove === `${from}${to}` ||
        (expectedMove.startsWith(`${from}${to}`) && promotion);

      if (!isCorrect) {
        const testGame = new Chess(game.fen());
        try {
          const moveResult = testGame.move({ from, to, promotion });
          if (!moveResult) return false;
        } catch {
          return false;
        }
        handleIncorrectMove();
        return true;
      }

      const gameAfterPlayerMove = new Chess(game.fen());
      const playerMoveResult = gameAfterPlayerMove.move({
        from,
        to,
        promotion
      });

      const nextMoveIndex = currentMoveIndex + 1;

      if (nextMoveIndex >= solutionMoves.length) {
        setGame(gameAfterPlayerMove);
        setCurrentFEN(gameAfterPlayerMove.fen());
        setPlayerTurn(false);
        if (playerMoveResult) {
          setMoves((prev) => [...prev, playerMoveResult.san]);
        }
        setScore((prev) => prev + 1);
        toast.success('Correct!', { duration: 1000 });

        setTimeout(() => {
          loadNextPuzzle();
        }, 500);
        return true;
      }

      const opponentMoveUci = solutionMoves[nextMoveIndex];
      const gameAfterOpponentMove = new Chess(gameAfterPlayerMove.fen());
      const opponentMoveResult = gameAfterOpponentMove.move({
        from: opponentMoveUci.slice(0, 2),
        to: opponentMoveUci.slice(2, 4),
        promotion: opponentMoveUci.length > 4 ? opponentMoveUci[4] : undefined
      });

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
    if (sourceSquare === targetSquare) return false;
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

  const hintArrow = useMemo(() => {
    if (!showHint || rushStatus !== 'playing' || !playerTurn) return [];

    const nextMove = solutionMoves[currentMoveIndex];
    if (!nextMove) return [];

    const from = nextMove.slice(0, 2);
    const to = nextMove.slice(2, 4);

    return [
      { startSquare: from, endSquare: to, color: 'rgba(0, 255, 0, 0.6)' }
    ];
  }, [showHint, rushStatus, playerTurn, solutionMoves, currentMoveIndex]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playerColor = boardOrientation;
  const opponentColor = playerColor === 'white' ? 'black' : 'white';

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

  if (rushStatus === 'finished') {
    return (
      <div className='flex min-h-screen items-center justify-center p-4'>
        <div className='bg-card w-full max-w-md rounded-lg border p-6 text-center'>
          <h2 className='mb-4 text-2xl font-bold'>Rush Complete!</h2>
          <div className='mb-6 grid grid-cols-2 gap-4'>
            <StatBox
              label='Puzzles Solved'
              value={score}
              variant='success'
              size='lg'
            />
            <StatBox
              label='Mistakes'
              value={mistakes}
              variant='error'
              size='md'
            />
          </div>
          <div className='mb-6'>
            <p className='text-muted-foreground text-sm'>Mode</p>
            <p className='text-lg'>
              {rushMode === 'timed'
                ? `${timeLimit} min`
                : `${maxMistakes} lives`}{' '}
              - {DIFFICULTY_LABELS[difficulty]}
            </p>
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

  return (
    <div className='flex min-h-screen flex-col gap-4 px-1 py-4 sm:px-4 lg:h-screen lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:overflow-hidden lg:px-6'>
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
            {shouldShow3d ? (
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

      <div className='flex w-full flex-col gap-2 sm:h-[400px] lg:h-[560px] lg:w-80 lg:overflow-hidden'>
        <div className='bg-card shrink-0 rounded-lg border p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              {rushMode === 'timed' ? (
                <>
                  <Icons.clock className='h-5 w-5' />
                  <span
                    className={`text-2xl font-bold tabular-nums ${timeRemaining <= 30 ? 'text-destructive' : ''}`}
                  >
                    {formatTime(timeRemaining)}
                  </span>
                </>
              ) : (
                <>
                  <Icons.heart className='text-destructive h-5 w-5' />
                  <span className='text-2xl font-bold'>
                    {maxMistakes - mistakes} / {maxMistakes}
                  </span>
                </>
              )}
            </div>
            <div className='text-right'>
              <p className='text-muted-foreground text-xs'>Score</p>
              <p className='text-2xl font-bold [color:var(--success)]'>
                {score}
              </p>
            </div>
          </div>
        </div>

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
            {currentPuzzle?.Themes && (
              <div className='mt-2 flex flex-wrap gap-1'>
                {currentPuzzle.Themes.split(' ')
                  .slice(0, 4)
                  .map((t) => (
                    <Badge key={t} variant='secondary' className='text-xs'>
                      {t}
                    </Badge>
                  ))}
              </div>
            )}
          </div>
        </div>

        <div className='bg-card shrink-0 overflow-hidden rounded-lg border'>
          <StandardActionBar
            onFlipBoard={() =>
              setBoardOrientation((o) => (o === 'white' ? 'black' : 'white'))
            }
            leftActions={
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
            }
            rightActions={
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
            }
          />
        </div>
      </div>
    </div>
  );
}
