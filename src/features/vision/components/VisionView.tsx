'use client';

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { type Square, Chess } from 'chess.js';
import { ChessboardProvider, Chessboard } from 'react-chessboard';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

import { BoardContainer } from '@/features/chess/components/BoardContainer';
import { SettingsDialog } from '@/features/settings/components/SettingsDialog';
import { useBoardTheme } from '@/features/chess/hooks/useSquareInteraction';
import { BOARD_STYLES } from '@/features/chess/config/board-themes';

type TrainingMode = 'coordinates' | 'moves';
type ColorMode = 'white' | 'black' | 'mixed';
type GameStatus = 'setup' | 'playing' | 'results';

interface AttemptResult {
  target: string;
  correct: boolean;
  responseTime: number; // in milliseconds
}

const ALL_SQUARES: Square[] = [
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

// Generate a random piece on a random square for Moves mode
function generateRandomPiecePosition(): {
  fen: string;
  square: Square;
  validMoves: Square[];
} {
  const pieces = ['q', 'r', 'b', 'n', 'k'];
  const pieceType = pieces[Math.floor(Math.random() * pieces.length)];
  const square = ALL_SQUARES[Math.floor(Math.random() * ALL_SQUARES.length)];

  // Create a FEN with just this piece
  const board: string[][] = Array(8)
    .fill(null)
    .map(() => Array(8).fill(''));
  const file = square.charCodeAt(0) - 97;
  const rank = 8 - parseInt(square[1]);
  board[rank][file] = pieceType.toUpperCase();

  const fenRows = board.map((row) => {
    let fenRow = '';
    let emptyCount = 0;
    for (const cell of row) {
      if (cell === '') {
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

  const fen = fenRows.join('/') + ' w - - 0 1';

  // Calculate valid moves for this piece (skip validation since we don't need kings)
  const chess = new Chess(fen, { skipValidation: true });
  const moves = chess.moves({ square, verbose: true });
  const validMoves = moves.map((m) => m.to as Square);

  return { fen, square, validMoves };
}

export function VisionView() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Setup state
  const [gameStatus, setGameStatus] = useState<GameStatus>('setup');
  const [trainingMode, setTrainingMode] = useState<TrainingMode>('coordinates');
  const [colorMode, setColorMode] = useState<ColorMode>('white');
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [timeLimit, setTimeLimit] = useState(30); // seconds

  // Game state
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>(
    'white'
  );
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [attempts, setAttempts] = useState<AttemptResult[]>([]);
  const [lastClickTime, setLastClickTime] = useState<number>(0);

  // Coordinates mode state
  const [targetSquare, setTargetSquare] = useState<Square | null>(null);
  const [lastClickedSquare, setLastClickedSquare] = useState<{
    square: Square;
    correct: boolean;
  } | null>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Moves mode state
  const [piecePosition, setPiecePosition] = useState<{
    fen: string;
    square: Square;
    validMoves: Square[];
  } | null>(null);
  const [selectedMoves, setSelectedMoves] = useState<Set<Square>>(new Set());
  const [movesSubmitted, setMovesSubmitted] = useState(false);

  const theme = useBoardTheme();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect - countdown
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setGameStatus('results');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStatus]);

  // Generate new target square for coordinates mode
  const generateNewTarget = useCallback(() => {
    const newTarget =
      ALL_SQUARES[Math.floor(Math.random() * ALL_SQUARES.length)];
    setTargetSquare(newTarget);
    setLastClickTime(Date.now());
  }, []);

  // Generate new piece position for moves mode
  const generateNewPiecePosition = useCallback(() => {
    const position = generateRandomPiecePosition();
    setPiecePosition(position);
    setSelectedMoves(new Set());
    setMovesSubmitted(false);
    setLastClickTime(Date.now());
  }, []);

  // Start game
  const startGame = useCallback(() => {
    // Set board orientation based on color mode
    if (colorMode === 'mixed') {
      setBoardOrientation(Math.random() < 0.5 ? 'white' : 'black');
    } else {
      setBoardOrientation(colorMode);
    }

    setScore(0);
    setTimeRemaining(timeLimit);
    setAttempts([]);
    setLastClickTime(Date.now());
    setGameStatus('playing');

    if (trainingMode === 'coordinates') {
      generateNewTarget();
    } else {
      generateNewPiecePosition();
    }
  }, [
    colorMode,
    trainingMode,
    timeLimit,
    generateNewTarget,
    generateNewPiecePosition
  ]);

  // Handle square click for coordinates mode
  const handleSquareClick = useCallback(
    ({ square }: { square: string }) => {
      if (
        gameStatus !== 'playing' ||
        trainingMode !== 'coordinates' ||
        !targetSquare
      )
        return;

      const now = Date.now();
      const responseTime = now - lastClickTime;
      const isCorrect = square === targetSquare;

      setAttempts((prev) => [
        ...prev,
        { target: targetSquare, correct: isCorrect, responseTime }
      ]);

      if (isCorrect) {
        setScore((prev) => prev + 1);
      }

      // Show feedback on the clicked square
      setLastClickedSquare({ square: square as Square, correct: isCorrect });

      // Clear feedback after a short delay
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
      feedbackTimeoutRef.current = setTimeout(() => {
        setLastClickedSquare(null);
      }, 300);

      // Change orientation on mixed mode
      if (colorMode === 'mixed') {
        setBoardOrientation(Math.random() < 0.5 ? 'white' : 'black');
      }

      generateNewTarget();
    },
    [
      gameStatus,
      trainingMode,
      targetSquare,
      colorMode,
      lastClickTime,
      generateNewTarget
    ]
  );

  // Handle square click for moves mode (toggle selection)
  const handleMovesSquareClick = useCallback(
    ({ square }: { square: string }) => {
      if (
        gameStatus !== 'playing' ||
        trainingMode !== 'moves' ||
        !piecePosition ||
        movesSubmitted
      )
        return;

      // Don't allow clicking the piece's own square
      if (square === piecePosition.square) return;

      setSelectedMoves((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(square as Square)) {
          newSet.delete(square as Square);
        } else {
          newSet.add(square as Square);
        }
        return newSet;
      });
    },
    [gameStatus, trainingMode, piecePosition, movesSubmitted]
  );

  // Submit moves answer
  const submitMoves = useCallback(() => {
    if (!piecePosition || movesSubmitted) return;

    const now = Date.now();
    const responseTime = now - lastClickTime;

    setMovesSubmitted(true);

    // Check if selected moves match valid moves
    const validSet = new Set(piecePosition.validMoves);
    const selectedArray = Array.from(selectedMoves);

    // Perfect match: all valid moves selected, no invalid moves selected
    const allValidSelected = piecePosition.validMoves.every((sq) =>
      selectedMoves.has(sq)
    );
    const noInvalidSelected = selectedArray.every((sq) => validSet.has(sq));
    const isCorrect = allValidSelected && noInvalidSelected;

    setAttempts((prev) => [
      ...prev,
      { target: piecePosition.square, correct: isCorrect, responseTime }
    ]);

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  }, [piecePosition, selectedMoves, movesSubmitted, lastClickTime]);

  // Next round in moves mode
  const nextMovesRound = useCallback(() => {
    if (colorMode === 'mixed') {
      setBoardOrientation(Math.random() < 0.5 ? 'white' : 'black');
    }
    generateNewPiecePosition();
  }, [colorMode, generateNewPiecePosition]);

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate average response time
  const averageResponseTime = useMemo(() => {
    if (attempts.length === 0) return 0;
    const correctAttempts = attempts.filter((a) => a.correct);
    if (correctAttempts.length === 0) return 0;
    const total = correctAttempts.reduce((sum, a) => sum + a.responseTime, 0);
    return Math.round(total / correctAttempts.length);
  }, [attempts]);

  // Calculate accuracy
  const accuracy = useMemo(() => {
    if (attempts.length === 0) return 0;
    return Math.round((score / attempts.length) * 100);
  }, [score, attempts.length]);

  // Square styles for highlighting
  const squareStyles = useMemo(() => {
    if (gameStatus !== 'playing') return {};

    const styles: Record<string, React.CSSProperties> = {};

    // Coordinates mode - show feedback on clicked square
    if (trainingMode === 'coordinates' && lastClickedSquare) {
      styles[lastClickedSquare.square] = {
        backgroundColor: lastClickedSquare.correct
          ? 'rgba(34, 197, 94, 0.6)' // Green for correct
          : 'rgba(239, 68, 68, 0.6)' // Red for incorrect
      };
    }

    if (trainingMode === 'moves' && piecePosition) {
      // Highlight selected squares
      selectedMoves.forEach((sq) => {
        styles[sq] = {
          backgroundColor: movesSubmitted
            ? piecePosition.validMoves.includes(sq)
              ? 'rgba(34, 197, 94, 0.5)'
              : 'rgba(239, 68, 68, 0.5)'
            : 'rgba(59, 130, 246, 0.5)'
        };
      });

      // After submission, show missed valid moves
      if (movesSubmitted) {
        piecePosition.validMoves.forEach((sq) => {
          if (!selectedMoves.has(sq)) {
            styles[sq] = { backgroundColor: 'rgba(234, 179, 8, 0.5)' }; // Yellow for missed
          }
        });
      }

      // Highlight the piece's square
      styles[piecePosition.square] = {
        backgroundColor: 'rgba(147, 51, 234, 0.5)'
      };
    }

    return styles;
  }, [
    gameStatus,
    trainingMode,
    piecePosition,
    selectedMoves,
    movesSubmitted,
    lastClickedSquare
  ]);

  // Chessboard options
  const chessboardOptions = useMemo(
    () => ({
      position:
        trainingMode === 'moves' && piecePosition
          ? piecePosition.fen
          : '8/8/8/8/8/8/8/8 w - - 0 1',
      boardOrientation,
      allowDragging: false,
      boardStyle: { ...BOARD_STYLES.boardStyle, cursor: 'pointer' },
      darkSquareStyle: theme.darkSquareStyle,
      lightSquareStyle: theme.lightSquareStyle,
      showBoardNotation: showCoordinates,
      customSquareStyles: squareStyles,
      onSquareClick:
        trainingMode === 'coordinates'
          ? handleSquareClick
          : handleMovesSquareClick,
      id: 'vision-board'
    }),
    [
      trainingMode,
      piecePosition,
      boardOrientation,
      theme.darkSquareStyle,
      theme.lightSquareStyle,
      showCoordinates,
      squareStyles,
      handleSquareClick,
      handleMovesSquareClick
    ]
  );

  // Setup Dialog
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
                Vision Training
              </DialogTitle>
              <p className='text-muted-foreground text-center text-sm'>
                Train your board awareness
              </p>
            </DialogHeader>
            <div className='space-y-6 py-4'>
              {/* Training Mode */}
              <div className='space-y-2'>
                <Label>Training Mode</Label>
                <Select
                  value={trainingMode}
                  onValueChange={(v) => setTrainingMode(v as TrainingMode)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='coordinates'>Coordinates</SelectItem>
                    <SelectItem value='moves'>Moves</SelectItem>
                  </SelectContent>
                </Select>
                <p className='text-muted-foreground text-xs'>
                  {trainingMode === 'coordinates'
                    ? 'Click on the square matching the shown coordinate'
                    : 'Identify all valid moves for the shown piece'}
                </p>
              </div>

              {/* Color Mode */}
              <div className='space-y-2'>
                <Label>Color</Label>
                <Select
                  value={colorMode}
                  onValueChange={(v) => setColorMode(v as ColorMode)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='white'>White</SelectItem>
                    <SelectItem value='black'>Black</SelectItem>
                    <SelectItem value='mixed'>Mixed</SelectItem>
                  </SelectContent>
                </Select>
                <p className='text-muted-foreground text-xs'>
                  Board orientation during training
                </p>
              </div>

              {/* Time Limit Slider */}
              <div className='space-y-3'>
                <Label className='block text-center'>
                  Time Limit: {timeLimit}s
                </Label>
                <Slider
                  value={[timeLimit]}
                  onValueChange={(v) => setTimeLimit(v[0])}
                  min={10}
                  max={120}
                  step={5}
                  className='w-full'
                />
                <div className='text-muted-foreground flex justify-between text-xs'>
                  <span>10s</span>
                  <span>120s</span>
                </div>
              </div>

              {/* Show Coordinates Toggle */}
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>Show Coordinates</Label>
                  <p className='text-muted-foreground text-xs'>
                    Display board notation labels
                  </p>
                </div>
                <Switch
                  checked={showCoordinates}
                  onCheckedChange={setShowCoordinates}
                />
              </div>

              <Button className='w-full' size='lg' onClick={startGame}>
                Start
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Results view
  if (gameStatus === 'results') {
    return (
      <div className='flex min-h-screen items-center justify-center p-4'>
        <Dialog open={true} onOpenChange={() => {}}>
          <DialogContent
            className='max-h-[90vh] overflow-y-auto sm:max-w-md'
            showCloseButton={false}
          >
            <DialogHeader>
              <DialogTitle className='text-center text-xl'>
                Training Complete
              </DialogTitle>
            </DialogHeader>
            <div className='space-y-6 py-4'>
              {/* Stats grid */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='bg-muted/50 rounded-lg p-4 text-center'>
                  <p className='text-muted-foreground text-sm'>Score</p>
                  <p className='text-3xl font-bold'>{score}</p>
                  <p className='text-muted-foreground text-xs'>
                    of {attempts.length} attempts
                  </p>
                </div>
                <div className='bg-muted/50 rounded-lg p-4 text-center'>
                  <p className='text-muted-foreground text-sm'>Accuracy</p>
                  <p
                    className={`text-3xl font-bold ${
                      accuracy >= 80
                        ? 'text-green-600 dark:text-green-400'
                        : accuracy >= 50
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {accuracy}%
                  </p>
                </div>
              </div>

              {/* Response time - highlighted */}
              <div className='bg-primary/10 rounded-lg p-6 text-center'>
                <p className='text-muted-foreground text-sm'>
                  Average Response Time
                </p>
                <p className='text-primary text-4xl font-bold'>
                  {averageResponseTime}
                  <span className='text-lg'>ms</span>
                </p>
                <p className='text-muted-foreground mt-1 text-xs'>
                  Based on {attempts.filter((a) => a.correct).length} correct
                  answers
                </p>
              </div>

              {/* Attempt history */}
              <div className='space-y-2'>
                <p className='text-muted-foreground text-center text-sm'>
                  Recent Attempts
                </p>
                <div className='grid grid-cols-8 gap-1'>
                  {attempts.slice(-16).map((attempt, i) => (
                    <div
                      key={i}
                      className={`flex aspect-square flex-col items-center justify-center rounded text-xs ${
                        attempt.correct
                          ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                          : 'bg-red-500/20 text-red-600 dark:text-red-400'
                      }`}
                    >
                      {attempt.correct ? (
                        <Icons.check className='h-3 w-3' />
                      ) : (
                        <Icons.close className='h-3 w-3' />
                      )}
                      <span className='text-[10px]'>{attempt.target}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  className='flex-1'
                  onClick={() => setGameStatus('setup')}
                >
                  Settings
                </Button>
                <Button className='flex-1' onClick={startGame}>
                  Play Again
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Playing view
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
          {/* Header card with timer */}
          <div className='bg-card shrink-0 rounded-lg border p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-3'>
                <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg'>
                  <Icons.target className='text-primary h-6 w-6' />
                </div>
                <div>
                  <Badge variant='secondary'>
                    {trainingMode === 'coordinates' ? 'Coordinates' : 'Moves'}
                  </Badge>
                </div>
              </div>
              <div className='text-right'>
                <p className='text-muted-foreground text-xs'>Time Left</p>
                <p
                  className={`text-2xl font-bold tabular-nums ${
                    timeRemaining <= 10 ? 'text-red-600 dark:text-red-400' : ''
                  }`}
                >
                  {timeRemaining}s
                </p>
              </div>
            </div>
          </div>

          {/* Target display */}
          <div className='bg-card flex shrink-0 flex-col items-center justify-center rounded-lg border p-6'>
            {trainingMode === 'coordinates' && targetSquare && (
              <>
                <p className='text-muted-foreground mb-2 text-sm'>Click on</p>
                <p className='text-5xl font-bold'>{targetSquare}</p>
              </>
            )}
            {trainingMode === 'moves' && piecePosition && (
              <>
                <p className='text-muted-foreground mb-2 text-sm'>
                  {movesSubmitted ? 'Result' : 'Select all valid moves'}
                </p>
                {!movesSubmitted ? (
                  <Button
                    onClick={submitMoves}
                    disabled={selectedMoves.size === 0}
                  >
                    Check ({selectedMoves.size} selected)
                  </Button>
                ) : (
                  <Button onClick={nextMovesRound}>Next</Button>
                )}
              </>
            )}
          </div>

          {/* Score */}
          <div className='bg-card flex shrink-0 items-center justify-between rounded-lg border p-4'>
            <div className='flex items-center gap-2'>
              <Icons.chessPawn className='text-muted-foreground h-5 w-5' />
              <span className='text-2xl font-bold'>{score}</span>
            </div>
            <span className='text-muted-foreground text-sm'>
              {attempts.length} attempts
            </span>
          </div>

          {/* Attempt history */}
          <div className='bg-card flex flex-col overflow-hidden rounded-lg border lg:flex-1'>
            <div className='flex-1 overflow-y-auto p-2'>
              <div className='grid grid-cols-8 gap-1'>
                {attempts.slice(-16).map((attempt, i) => (
                  <div
                    key={i}
                    className={`flex aspect-square flex-col items-center justify-center rounded text-xs ${
                      attempt.correct
                        ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                        : 'bg-red-500/20 text-red-600 dark:text-red-400'
                    }`}
                  >
                    {attempt.correct ? (
                      <Icons.check className='h-3 w-3' />
                    ) : (
                      <Icons.close className='h-3 w-3' />
                    )}
                    <span className='text-[10px]'>{attempt.target}</span>
                  </div>
                ))}
              </div>
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
                onClick={() => setGameStatus('results')}
              >
                End Training
              </Button>
            </div>
          </div>
        </div>

        <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      </div>
    </ChessboardProvider>
  );
}
