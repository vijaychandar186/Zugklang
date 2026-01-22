'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { type Square, type PieceSymbol, type Color } from '@/lib/chess';
import { ChessboardProvider, Chessboard } from 'react-chessboard';
import type { PieceDropHandlerArgs } from 'react-chessboard';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
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
import { toast } from 'sonner';

import { UnifiedChessBoard as Board } from '@/features/chess/components/Board';
import { BoardContainer } from '@/features/chess/components/BoardContainer';
import { SettingsDialog } from '@/features/settings/components/SettingsDialog';
import { MemoryPiecePalette } from './MemoryPiecePalette';

import { useBoardTheme } from '@/features/chess/hooks/useSquareInteraction';
import { BOARD_STYLES } from '@/features/chess/config/board-themes';

type TrainingMode = 'standard' | 'progressive';
type GameStatus = 'setup' | 'memorizing' | 'placing' | 'results';

type PieceInfo = {
  type: PieceSymbol;
  color: Color;
};

const SQUARES: Square[] = [
  'a8',
  'b8',
  'c8',
  'd8',
  'e8',
  'f8',
  'g8',
  'h8',
  'a7',
  'b7',
  'c7',
  'd7',
  'e7',
  'f7',
  'g7',
  'h7',
  'a6',
  'b6',
  'c6',
  'd6',
  'e6',
  'f6',
  'g6',
  'h6',
  'a5',
  'b5',
  'c5',
  'd5',
  'e5',
  'f5',
  'g5',
  'h5',
  'a4',
  'b4',
  'c4',
  'd4',
  'e4',
  'f4',
  'g4',
  'h4',
  'a3',
  'b3',
  'c3',
  'd3',
  'e3',
  'f3',
  'g3',
  'h3',
  'a2',
  'b2',
  'c2',
  'd2',
  'e2',
  'f2',
  'g2',
  'h2',
  'a1',
  'b1',
  'c1',
  'd1',
  'e1',
  'f1',
  'g1',
  'h1'
];

export function MemoryView() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [gameStatus, setGameStatus] = useState<GameStatus>('setup');
  const [trainingMode, setTrainingMode] = useState<TrainingMode>('standard');
  const [pieceCount, setPieceCount] = useState(6);
  const [memorizeTime, setMemorizeTime] = useState(10);

  const [progressiveLevel, setProgressiveLevel] = useState(1);
  const [progressiveStreak, setProgressiveStreak] = useState(0);

  const [targetPosition, setTargetPosition] = useState<Map<Square, PieceInfo>>(
    new Map()
  );
  const [userPosition, setUserPosition] = useState<Map<Square, PieceInfo>>(
    new Map()
  );
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>(
    'white'
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const theme = useBoardTheme();

  useEffect(() => {
    if (gameStatus !== 'memorizing') return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setGameStatus('placing');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStatus]);

  const generateRandomPosition = useCallback((numPieces: number) => {
    const position = new Map<Square, PieceInfo>();
    const availableSquares = [...SQUARES];

    const whiteKingSquare = availableSquares.splice(
      Math.floor(Math.random() * availableSquares.length),
      1
    )[0];
    const blackKingSquare = availableSquares.splice(
      Math.floor(Math.random() * availableSquares.length),
      1
    )[0];

    position.set(whiteKingSquare, { type: 'k', color: 'w' });
    position.set(blackKingSquare, { type: 'k', color: 'b' });

    const remainingPieces = numPieces - 2;
    const pieceTypes: PieceSymbol[] = ['q', 'r', 'r', 'b', 'b', 'n', 'n'];

    for (let i = 0; i < remainingPieces && availableSquares.length > 0; i++) {
      const squareIndex = Math.floor(Math.random() * availableSquares.length);
      const square = availableSquares.splice(squareIndex, 1)[0];
      const color: Color = Math.random() < 0.5 ? 'w' : 'b';

      const rank = square[1];
      let pieceType: PieceSymbol;

      if (rank === '1' || rank === '8') {
        pieceType = pieceTypes[Math.floor(Math.random() * pieceTypes.length)];
      } else {
        const allTypes: PieceSymbol[] = [...pieceTypes, 'p', 'p', 'p'];
        pieceType = allTypes[Math.floor(Math.random() * allTypes.length)];
      }

      position.set(square, { type: pieceType, color });
    }

    return position;
  }, []);

  const positionToFen = useCallback((position: Map<Square, PieceInfo>) => {
    const board: (string | null)[][] = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));

    position.forEach((piece, square) => {
      const file = square.charCodeAt(0) - 97;
      const rank = 8 - parseInt(square[1]);
      const pieceChar =
        piece.color === 'w'
          ? piece.type.toUpperCase()
          : piece.type.toLowerCase();
      board[rank][file] = pieceChar;
    });

    const fenRows = board.map((row) => {
      let fenRow = '';
      let emptyCount = 0;

      for (const cell of row) {
        if (cell === null) {
          emptyCount++;
        } else {
          if (emptyCount > 0) {
            fenRow += emptyCount;
            emptyCount = 0;
          }
          fenRow += cell;
        }
      }

      if (emptyCount > 0) {
        fenRow += emptyCount;
      }

      return fenRow;
    });

    return fenRows.join('/') + ' w - - 0 1';
  }, []);

  const getProgressivePieceCount = useCallback((level: number) => {
    return Math.min(3 + Math.floor((level - 1) * 1.5), 32);
  }, []);

  const startRound = useCallback(() => {
    const pieces =
      trainingMode === 'progressive'
        ? getProgressivePieceCount(progressiveLevel)
        : pieceCount;

    const position = generateRandomPosition(pieces);
    setTargetPosition(position);
    setUserPosition(new Map());
    setTimeRemaining(memorizeTime);
    setGameStatus('memorizing');
  }, [
    trainingMode,
    progressiveLevel,
    pieceCount,
    memorizeTime,
    generateRandomPosition,
    getProgressivePieceCount
  ]);

  const handlePieceDrop = useCallback(
    ({ sourceSquare, targetSquare, piece }: PieceDropHandlerArgs): boolean => {
      const color = piece.pieceType[0] as 'w' | 'b';
      const type = piece.pieceType[1].toLowerCase() as PieceSymbol;

      if (!targetSquare) {
        if (!piece.isSparePiece && sourceSquare) {
          setUserPosition((prev) => {
            const newPos = new Map(prev);
            newPos.delete(sourceSquare as Square);
            return newPos;
          });
        }
        return true;
      }

      if (!piece.isSparePiece && sourceSquare) {
        setUserPosition((prev) => {
          const newPos = new Map(prev);
          newPos.delete(sourceSquare as Square);
          newPos.set(targetSquare as Square, { type, color });
          return newPos;
        });
      } else {
        setUserPosition((prev) => {
          const newPos = new Map(prev);
          newPos.set(targetSquare as Square, { type, color });
          return newPos;
        });
      }

      return true;
    },
    []
  );

  const handleSquareRightClick = useCallback(
    ({ square }: { square: string }) => {
      setUserPosition((prev) => {
        const newPos = new Map(prev);
        if (newPos.has(square as Square)) {
          newPos.delete(square as Square);
        }
        return newPos;
      });
    },
    []
  );

  const checkAnswer = useCallback(() => {
    let correct = 0;
    const total = targetPosition.size;

    targetPosition.forEach((targetPiece, square) => {
      const userPiece = userPosition.get(square);
      if (
        userPiece &&
        userPiece.type === targetPiece.type &&
        userPiece.color === targetPiece.color
      ) {
        correct++;
      }
    });

    setScore({ correct, total });
    setGameStatus('results');

    if (trainingMode === 'progressive') {
      const accuracy = correct / total;
      if (accuracy >= 0.8) {
        setProgressiveStreak((prev) => prev + 1);
        if (progressiveStreak >= 2) {
          setProgressiveLevel((prev) => prev + 1);
          setProgressiveStreak(0);
          toast.success('Level up!');
        }
      } else {
        setProgressiveStreak(0);
        if (progressiveLevel > 1) {
          setProgressiveLevel((prev) => Math.max(1, prev - 1));
        }
      }
    }
  }, [
    targetPosition,
    userPosition,
    trainingMode,
    progressiveStreak,
    progressiveLevel
  ]);

  const clearBoard = useCallback(() => {
    setUserPosition(new Map());
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0
      ? `${mins}:${secs.toString().padStart(2, '0')}`
      : `${secs}s`;
  };

  const currentFen = useMemo(() => {
    if (gameStatus === 'memorizing') {
      return positionToFen(targetPosition);
    } else if (gameStatus === 'placing' || gameStatus === 'results') {
      return positionToFen(userPosition);
    }
    return '8/8/8/8/8/8/8/8 w - - 0 1';
  }, [gameStatus, targetPosition, userPosition, positionToFen]);

  const customSquareStyles = useMemo(() => {
    if (gameStatus !== 'results') return {};

    const styles: Record<string, React.CSSProperties> = {};

    targetPosition.forEach((targetPiece, square) => {
      const userPiece = userPosition.get(square);
      if (
        userPiece &&
        userPiece.type === targetPiece.type &&
        userPiece.color === targetPiece.color
      ) {
        styles[square] = { backgroundColor: 'rgba(34, 197, 94, 0.5)' };
      } else {
        styles[square] = { backgroundColor: 'rgba(239, 68, 68, 0.5)' };
      }
    });

    userPosition.forEach((_, square) => {
      if (!targetPosition.has(square)) {
        styles[square] = { backgroundColor: 'rgba(239, 68, 68, 0.5)' };
      }
    });

    return styles;
  }, [gameStatus, targetPosition, userPosition]);

  const chessboardOptions = useMemo(
    () => ({
      position: currentFen,
      boardOrientation,
      allowDragging: true,
      allowDragOffBoard: true,
      boardStyle: BOARD_STYLES.boardStyle,
      darkSquareStyle: theme.darkSquareStyle,
      lightSquareStyle: theme.lightSquareStyle,
      dropSquareStyle: {
        boxShadow: 'inset 0 0 1px 4px var(--highlight-drop)'
      },
      onPieceDrop: handlePieceDrop,
      onSquareRightClick: handleSquareRightClick,
      id: 'memory-board'
    }),
    [
      currentFen,
      boardOrientation,
      theme.darkSquareStyle,
      theme.lightSquareStyle,
      handlePieceDrop,
      handleSquareRightClick
    ]
  );

  if (gameStatus === 'setup') {
    return (
      <div className='flex min-h-screen items-center justify-center p-4'>
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent
            className='max-h-[90vh] overflow-y-auto sm:max-w-md'
            showCloseButton={false}
          >
            <DialogHeader>
              <DialogTitle className='text-center text-xl'>
                Choose Training Style
              </DialogTitle>
              <p className='text-muted-foreground text-center text-sm'>
                Decide how you want to practice
              </p>
            </DialogHeader>
            <div className='space-y-6 py-4'>
              {}
              <div className='grid grid-cols-2 gap-3'>
                <button
                  onClick={() => setTrainingMode('standard')}
                  className={`rounded-lg border-2 p-4 text-left transition-all ${
                    trainingMode === 'standard'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <h3 className='font-semibold'>Standard Mode</h3>
                  <p className='text-muted-foreground mt-1 text-xs'>
                    Fixed difficulty levels
                  </p>
                </button>
                <button
                  onClick={() => setTrainingMode('progressive')}
                  className={`rounded-lg border-2 p-4 text-left transition-all ${
                    trainingMode === 'progressive'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <h3 className='font-semibold'>Progressive Mode</h3>
                  <p className='text-muted-foreground mt-1 text-xs'>
                    Difficulty adjusts automatically
                  </p>
                </button>
              </div>

              {}
              <div className='bg-muted/50 rounded-lg p-3'>
                {trainingMode === 'standard' ? (
                  <p className='text-muted-foreground text-sm'>
                    Choose your difficulty level. Easy starts with fewer pieces,
                    Hard includes the full board.
                  </p>
                ) : (
                  <p className='text-muted-foreground text-sm'>
                    Start easy and level up as you succeed. Get 3 correct in a
                    row to advance!
                  </p>
                )}
              </div>

              {}
              {trainingMode === 'standard' && (
                <div className='space-y-3'>
                  <Label className='block text-center'>
                    Difficulty: {pieceCount} pieces
                  </Label>
                  <Slider
                    value={[pieceCount]}
                    onValueChange={(v) => setPieceCount(v[0])}
                    min={3}
                    max={32}
                    step={1}
                    className='w-full'
                  />
                  <div className='text-muted-foreground flex justify-between text-xs'>
                    <span>Easy</span>
                    <span>Hard</span>
                  </div>
                </div>
              )}

              {}
              <div className='space-y-3'>
                <Label className='block text-center'>
                  Set Memorization Time
                </Label>
                <p className='text-muted-foreground text-center text-xs'>
                  Adjust how long you have to memorize
                </p>
                <Slider
                  value={[memorizeTime]}
                  onValueChange={(v) => setMemorizeTime(v[0])}
                  min={5}
                  max={60}
                  step={5}
                  className='w-full'
                />
                <div className='text-muted-foreground flex justify-between text-xs'>
                  <span>5s</span>
                  <span>{formatTime(memorizeTime)}</span>
                  <span>1 min</span>
                </div>
              </div>

              <Button className='w-full' size='lg' onClick={startRound}>
                Start Training
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (gameStatus === 'results') {
    const accuracy = Math.round((score.correct / score.total) * 100);
    return (
      <div className='flex min-h-screen flex-col gap-4 px-1 py-4 sm:px-4 lg:h-screen lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:overflow-hidden lg:px-6'>
        {}
        <div className='flex flex-col items-center gap-2'>
          <BoardContainer showEvaluation={false}>
            <Board
              position={positionToFen(targetPosition)}
              boardOrientation={boardOrientation}
              canDrag={false}
              darkSquareStyle={theme.darkSquareStyle}
              lightSquareStyle={theme.lightSquareStyle}
              squareStyles={customSquareStyles}
            />
          </BoardContainer>
        </div>

        {}
        <div className='flex w-full flex-col gap-4 sm:h-[400px] lg:h-[560px] lg:w-80 lg:overflow-hidden'>
          <div className='bg-card flex flex-col rounded-lg border p-6 text-center lg:flex-1'>
            <h2 className='mb-4 text-2xl font-bold'>Results</h2>
            <div className='mb-6 space-y-4'>
              <div>
                <p className='text-muted-foreground text-sm'>Accuracy</p>
                <p
                  className={`text-4xl font-bold ${accuracy >= 80 ? 'text-green-600 dark:text-green-400' : accuracy >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}
                >
                  {accuracy}%
                </p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm'>Pieces Correct</p>
                <p className='text-2xl font-bold'>
                  {score.correct} / {score.total}
                </p>
              </div>
              {trainingMode === 'progressive' && (
                <div>
                  <p className='text-muted-foreground text-sm'>Level</p>
                  <p className='text-2xl font-bold'>{progressiveLevel}</p>
                  <p className='text-muted-foreground text-xs'>
                    Streak: {progressiveStreak}/3
                  </p>
                </div>
              )}
            </div>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                className='flex-1'
                onClick={() => setGameStatus('setup')}
              >
                Settings
              </Button>
              <Button className='flex-1' onClick={startRound}>
                Next Round
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameStatus === 'memorizing') {
    return (
      <div className='flex min-h-screen flex-col gap-4 px-1 py-4 sm:px-4 lg:h-screen lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:overflow-hidden lg:px-6'>
        <div className='flex flex-col items-center gap-2'>
          <BoardContainer showEvaluation={false}>
            <div className='relative'>
              <Board
                position={currentFen}
                boardOrientation={boardOrientation}
                canDrag={false}
                darkSquareStyle={theme.darkSquareStyle}
                lightSquareStyle={theme.lightSquareStyle}
              />
              <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
                <div className='bg-background/80 rounded-full p-4'>
                  <span className='text-4xl font-bold tabular-nums'>
                    {timeRemaining}
                  </span>
                </div>
              </div>
            </div>
          </BoardContainer>
        </div>

        <div className='flex w-full flex-col gap-2 sm:h-[400px] lg:h-[560px] lg:w-80 lg:overflow-hidden'>
          <div className='bg-card shrink-0 rounded-lg border p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <Badge variant='secondary'>Memorize!</Badge>
                {trainingMode === 'progressive' && (
                  <p className='text-muted-foreground mt-1 text-xs'>
                    Level {progressiveLevel} -{' '}
                    {getProgressivePieceCount(progressiveLevel)} pieces
                  </p>
                )}
                {trainingMode === 'standard' && (
                  <p className='text-muted-foreground mt-1 text-xs'>
                    {pieceCount} pieces
                  </p>
                )}
              </div>
              <div className='text-right'>
                <p className='text-muted-foreground text-xs'>Time</p>
                <p className='text-2xl font-bold tabular-nums'>
                  {timeRemaining}s
                </p>
              </div>
            </div>
          </div>

          {}
          <div className='bg-card hidden rounded-lg border lg:flex lg:flex-1' />

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
              </div>

              <Button
                size='sm'
                variant='outline'
                onClick={() => setGameStatus('placing')}
              >
                Skip to Placing
              </Button>
            </div>
          </div>
        </div>

        <SettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          show3dToggle={false}
        />
      </div>
    );
  }

  return (
    <ChessboardProvider options={chessboardOptions}>
      <div className='flex min-h-screen flex-col gap-4 px-1 py-4 sm:px-4 lg:h-screen lg:flex-row lg:items-center lg:justify-center lg:gap-8 lg:overflow-hidden lg:px-6'>
        <div className='flex flex-col items-center gap-2'>
          <BoardContainer showEvaluation={false}>
            <div className='w-[calc(100vw-0.5rem)] sm:w-[400px] lg:w-[560px]'>
              <Chessboard />
            </div>
          </BoardContainer>
        </div>

        <div className='flex w-full flex-col gap-2 sm:h-[400px] lg:h-[560px] lg:w-80 lg:overflow-hidden'>
          <div className='bg-card shrink-0 rounded-lg border p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <Badge variant='secondary'>Recreate!</Badge>
                {trainingMode === 'progressive' && (
                  <p className='text-muted-foreground mt-1 text-xs'>
                    Level {progressiveLevel} -{' '}
                    {getProgressivePieceCount(progressiveLevel)} pieces
                  </p>
                )}
                {trainingMode === 'standard' && (
                  <p className='text-muted-foreground mt-1 text-xs'>
                    {pieceCount} pieces
                  </p>
                )}
              </div>
            </div>
          </div>

          {}
          <div className='bg-card flex flex-col rounded-lg border lg:flex-1'>
            <MemoryPiecePalette orientation={boardOrientation} />
          </div>

          {}
          <div className='bg-card shrink-0 rounded-lg border p-4'>
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground text-sm'>
                Pieces placed
              </span>
              <span className='font-semibold'>
                {userPosition.size} / {targetPosition.size}
              </span>
            </div>
          </div>

          {}
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
                    <Button variant='ghost' size='icon' onClick={clearBoard}>
                      <Icons.eraser className='h-4 w-4' />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Clear Board</TooltipContent>
                </Tooltip>
              </div>

              <Button size='sm' onClick={checkAnswer}>
                Check Answer
              </Button>
            </div>
          </div>
        </div>

        <SettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          show3dToggle={false}
        />
      </div>
    </ChessboardProvider>
  );
}
