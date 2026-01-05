'use client';

import { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { MoveHistory } from './sidebar/MoveHistory';
import { NavigationControls } from './sidebar/NavigationControls';
import { GameOverPanel } from './sidebar/GameOverPanel';
import { SettingsDialog } from '@/features/settings/components/SettingsDialog';
import { GameSelectionDialog } from './GameSelectionDialog';
import { PGNImportDialog } from './sidebar/PGNImportDialog';
import {
  useChessState,
  useChessActions,
  ChessMode
} from '../stores/useChessStore';
import {
  useAnalysisState,
  useAnalysisActions
} from '../stores/useAnalysisStore';
import { playSound } from '@/features/game/utils/sounds';

interface ChessSidebarProps {
  mode: ChessMode;
}

export function ChessSidebar({ mode }: ChessSidebarProps) {
  const {
    moves,
    viewingIndex,
    positionHistory,
    gameOver,
    gameResult,
    gameStarted,
    playAs,
    playingAgainstStockfish,
    boardOrientation,
    soundEnabled,
    hasHydrated
  } = useChessState();

  const {
    goToStart,
    goToEnd,
    goToPrev,
    goToNext,
    goToMove,
    flipBoard,
    toggleBoardOrientation,
    setGameOver,
    setGameResult,
    resetToStarting,
    startPlayingFromPosition,
    stopPlayingFromPosition
  } = useChessActions();

  const { isAnalysisOn, isInitialized } = useAnalysisState();
  const { startAnalysis, endAnalysis } = useAnalysisActions();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newGameOpen, setNewGameOpen] = useState(false);
  const [copiedMoves, setCopiedMoves] = useState(false);
  const [copiedPGN, setCopiedPGN] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const hasAutoPlayed = useRef(false);

  const isPlayMode = mode === 'play';
  const isAnalysisMode = mode === 'analysis';

  const canGoBack = viewingIndex > 0;
  const canGoForward = viewingIndex < positionHistory.length - 1;
  const canAbort = moves.length < 4;
  const isGameActive = gameStarted && !gameOver;

  useEffect(() => {
    if (copiedMoves) {
      const timer = setTimeout(() => setCopiedMoves(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedMoves]);

  useEffect(() => {
    if (copiedPGN) {
      const timer = setTimeout(() => setCopiedPGN(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedPGN]);

  useEffect(() => {
    if (
      isAnalysisMode &&
      !hasAutoPlayed.current &&
      positionHistory.length > 1
    ) {
      hasAutoPlayed.current = true;
      setTimeout(() => {
        goToStart();
        setIsPlaying(true);
      }, 100);
    }
  }, [isAnalysisMode, positionHistory.length, goToStart]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        if (viewingIndex < positionHistory.length - 1) {
          goToNext();
        } else {
          setIsPlaying(false);
        }
      }, 600);
    }
    return () => clearInterval(interval);
  }, [isPlaying, viewingIndex, positionHistory.length, goToNext]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  // Auto-show game selection dialog when in play mode with no active game and no moves
  useEffect(() => {
    if (
      hasHydrated &&
      isPlayMode &&
      !gameStarted &&
      !gameOver &&
      moves.length === 0
    ) {
      setNewGameOpen(true);
    }
  }, [hasHydrated, isPlayMode, gameStarted, gameOver, moves.length]);

  const formatMovesText = () => {
    const pairs: string[] = [];
    for (let i = 0; i < moves.length; i += 2) {
      const moveNum = Math.floor(i / 2) + 1;
      const whiteMove = moves[i];
      const blackMove = moves[i + 1] || '';
      pairs.push(`${moveNum}. ${whiteMove}${blackMove ? ' ' + blackMove : ''}`);
    }
    return pairs.join(' ');
  };

  const formatPGN = () => {
    const date = new Date();
    const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    const result = gameOver
      ? gameResult?.includes('win')
        ? playAs === 'white'
          ? '1-0'
          : '0-1'
        : gameResult?.includes('resigned')
          ? playAs === 'white'
            ? '0-1'
            : '1-0'
          : '1/2-1/2'
      : '*';

    const headers = [
      '[Site "Zugklang"]',
      `[Date "${dateStr}"]`,
      `[White "${playAs === 'white' ? 'Player' : 'Stockfish'}"]`,
      `[Black "${playAs === 'black' ? 'Player' : 'Stockfish'}"]`,
      `[Result "${result}"]`
    ].join('\n');

    return `${headers}\n\n${formatMovesText()} ${result}`;
  };

  const handleCopyMoves = () => {
    navigator.clipboard.writeText(formatMovesText());
    setCopiedMoves(true);
  };

  const handleCopyPGN = () => {
    navigator.clipboard.writeText(formatPGN());
    setCopiedPGN(true);
  };

  const handleResign = () => {
    if (soundEnabled) playSound('game-end');
    setGameResult('You resigned');
    setGameOver(true);
  };

  const handleAbort = () => {
    if (soundEnabled) playSound('game-end');
    setGameResult('Game Aborted');
    setGameOver(true);
  };

  const handleNewGame = () => {
    setNewGameOpen(true);
  };

  const handleToggleAnalysis = () => {
    if (isAnalysisOn) {
      endAnalysis();
    } else {
      startAnalysis();
    }
  };

  const handlePlayFromPosition = (color: 'white' | 'black') => {
    startPlayingFromPosition(color);
  };

  const handleFlipBoard = () => {
    if (isPlayMode) {
      flipBoard();
    } else {
      toggleBoardOrientation();
    }
  };

  return (
    <>
      <div className='bg-card flex h-full flex-col rounded-lg border'>
        <div className='flex shrink-0 items-center justify-between border-b px-4 py-3'>
          <h3 className='font-semibold'>Moves</h3>
          <div className='flex items-center gap-1'>
            {isPlayMode && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant='ghost' size='icon' className='h-8 w-8'>
                    <Icons.share className='h-4 w-4' />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share Game</DialogTitle>
                    <DialogDescription>
                      Copy moves or PGN to clipboard.
                    </DialogDescription>
                  </DialogHeader>
                  <div className='flex flex-col gap-3 pt-2'>
                    <Button
                      onClick={handleCopyMoves}
                      variant='outline'
                      className='h-auto justify-between py-3'
                    >
                      <div className='flex flex-col items-start'>
                        <span className='font-medium'>Copy Moves List</span>
                        <span className='text-muted-foreground text-xs'>
                          Simple list of moves
                        </span>
                      </div>
                      {copiedMoves ? (
                        <Icons.check className='h-4 w-4 text-green-500' />
                      ) : (
                        <Icons.copy className='text-muted-foreground h-4 w-4' />
                      )}
                    </Button>
                    <Button
                      onClick={handleCopyPGN}
                      variant='outline'
                      className='h-auto justify-between py-3'
                    >
                      <div className='flex flex-col items-start'>
                        <span className='font-medium'>Copy PGN</span>
                        <span className='text-muted-foreground text-xs'>
                          Standard PGN format
                        </span>
                      </div>
                      {copiedPGN ? (
                        <Icons.check className='h-4 w-4 text-green-500' />
                      ) : (
                        <Icons.copy className='text-muted-foreground h-4 w-4' />
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {isAnalysisMode && (
              <PGNImportDialog>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8'
                  title='Import PGN/FEN'
                >
                  <Icons.upload className='h-4 w-4' />
                </Button>
              </PGNImportDialog>
            )}

            {!isPlayMode && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8'
                    title='Options'
                  >
                    <Icons.settings className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-56'>
                  <DropdownMenuLabel>View</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleFlipBoard}>
                    <Icons.flipBoard className='mr-2 h-4 w-4' />
                    Flip Board (
                    {isPlayMode
                      ? boardOrientation === 'white'
                        ? 'Black'
                        : 'White'
                      : boardOrientation === 'white'
                        ? 'Black'
                        : 'White'}
                    )
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Engine</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleToggleAnalysis}
                    disabled={!isInitialized}
                  >
                    <Icons.stockfish
                      className={`mr-2 h-4 w-4 ${isAnalysisOn ? 'text-green-500' : 'text-muted-foreground'}`}
                    />
                    {isAnalysisOn ? 'Disable Engine' : 'Enable Engine'}
                  </DropdownMenuItem>

                  {isAnalysisMode && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Play vs Stockfish</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {playingAgainstStockfish ? (
                        <DropdownMenuItem onClick={stopPlayingFromPosition}>
                          <Icons.stockfish className='mr-2 h-4 w-4' />
                          Stop Playing
                        </DropdownMenuItem>
                      ) : (
                        <>
                          <DropdownMenuItem
                            onClick={() => handlePlayFromPosition('white')}
                          >
                            <Icons.stockfish className='mr-2 h-4 w-4' />
                            Play as White
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handlePlayFromPosition('black')}
                          >
                            <Icons.stockfish className='mr-2 h-4 w-4' />
                            Play as Black
                          </DropdownMenuItem>
                        </>
                      )}

                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Reset Board</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={resetToStarting}>
                        <Icons.rematch className='mr-2 h-4 w-4' />
                        Starting Position
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <ScrollArea className='h-0 flex-grow'>
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

        {isPlayMode && (
          <div className='bg-muted/50 space-y-2 border-t p-2'>
            {gameOver && (
              <GameOverPanel
                gameResult={gameResult}
                onNewGame={handleNewGame}
              />
            )}
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
                  <Button variant='ghost' size='icon' onClick={handleFlipBoard}>
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
                  {isAnalysisOn ? 'Turn Off Analysis' : 'Turn On Analysis'}
                </TooltipContent>
              </Tooltip>

              <div className='ml-auto flex items-center gap-1'>
                <AlertDialog>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive'
                          disabled={gameOver || moves.length === 0}
                        >
                          {canAbort ? (
                            <Icons.abort className='h-4 w-4' />
                          ) : (
                            <Icons.flag className='h-4 w-4' />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      {canAbort ? 'Abort Game' : 'Resign Game'}
                    </TooltipContent>
                  </Tooltip>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {canAbort ? 'Abort Game?' : 'Resign Game?'}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {canAbort
                          ? 'Are you sure you want to abort? This game will not be counted.'
                          : 'Are you sure you want to resign? This will end the game and count as a loss.'}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={canAbort ? handleAbort : handleResign}
                        className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                      >
                        {canAbort ? 'Abort' : 'Resign'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        )}
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <GameSelectionDialog open={newGameOpen} onOpenChange={setNewGameOpen} />
    </>
  );
}
