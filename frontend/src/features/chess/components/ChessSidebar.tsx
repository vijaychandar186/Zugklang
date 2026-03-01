'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { MoveHistory } from './sidebar/MoveHistory';
import { ShareGameDialog } from './sidebar/ShareGameDialog';
import { NavigationControls } from './sidebar/NavigationControls';
import { GameOverPanel } from './sidebar/GameOverPanel';
import { SidebarPanel } from './sidebar/SidebarPanel';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { GameActionButtons } from './sidebar/GameActionButtons';
import { SettingsButton } from './actions/SettingsButton';
import { FlipBoardButton } from './actions/FlipBoardButton';
import { EngineToggleButton } from './actions/EngineToggleButton';
import { GameSelectionDialog } from './GameSelectionDialog';
import { LocalGameSelectionDialog } from './LocalGameSelectionDialog';
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
import { usePlayback } from '../hooks/usePlayback';
import { playSound } from '@/features/game/utils/sounds';
import { CrazyhousePocket } from './CrazyhousePocket';
import type { PieceSymbol } from '@/lib/chess/chess';
import type { MultiplayerStatus } from '@/features/multiplayer/types';
export interface MultiplayerSidebarProps {
  status: MultiplayerStatus;
  drawOffered: boolean;
  rematchOffered: boolean;
  rematchDeclined: boolean;
  onAbort: () => void;
  onResign: () => void;
  onOfferDraw: () => void;
  onAcceptDraw: () => void;
  onDeclineDraw: () => void;
  onOfferRematch: () => void;
  onAcceptRematch: () => void;
  onDeclineRematch: () => void;
  onFindNewGame: () => void;
  ratingDelta?: number | null;
}
interface ChessSidebarProps {
  mode: ChessMode;
  multiplayer?: MultiplayerSidebarProps;
}
export function ChessSidebar({ mode, multiplayer }: ChessSidebarProps) {
  const router = useRouter();
  const {
    moves,
    moveDepths,
    viewingIndex,
    positionHistory,
    gameOver,
    gameResult,
    gameStarted,
    gameType,
    playAs,
    playingAgainstStockfish,
    boardOrientation,
    soundEnabled,
    hasHydrated,
    game,
    currentFEN,
    variant,
    selectedDropPiece,
    engineConfig
  } = useChessState();
  const isLocalGame = gameType === 'local';
  const isPlayMode = mode === 'play';
  const isAnalysisMode = mode === 'analysis';
  const isMultiplayer = !!multiplayer;
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
    stopPlayingFromPosition,
    setSelectedDropPiece
  } = useChessActions();
  const { isAnalysisOn, isInitialized } = useAnalysisState();
  const { startAnalysis, endAnalysis } = useAnalysisActions();
  const [newGameOpen, setNewGameOpen] = useState(false);
  const [rematchSent, setRematchSent] = useState(false);
  const hasAutoPlayed = useRef(false);
  useEffect(() => {
    if (multiplayer?.rematchDeclined) setRematchSent(false);
  }, [multiplayer?.rematchDeclined]);
  useEffect(() => {
    if (!gameOver) setRematchSent(false);
  }, [gameOver]);
  useEffect(() => {
    if (
      isAnalysisMode &&
      !hasAutoPlayed.current &&
      positionHistory.length > 1
    ) {
      hasAutoPlayed.current = true;
      setTimeout(() => goToStart(), 100);
    }
  }, [isAnalysisMode, positionHistory.length, goToStart]);
  useEffect(() => {
    if (
      !isMultiplayer &&
      hasHydrated &&
      isPlayMode &&
      !gameStarted &&
      !gameOver &&
      moves.length === 0
    ) {
      setNewGameOpen(true);
    }
  }, [
    isMultiplayer,
    hasHydrated,
    isPlayMode,
    gameStarted,
    gameOver,
    moves.length
  ]);
  const canGoBack = viewingIndex > 0;
  const canGoForward = viewingIndex < positionHistory.length - 1;
  const canAbort = moves.length < 2;
  const isLiveGame =
    isMultiplayer &&
    (multiplayer!.status === 'playing' || (gameStarted && !gameOver));
  const { isPlaying, togglePlay } = usePlayback({
    currentIndex: viewingIndex,
    totalItems: positionHistory.length,
    onNext: goToNext
  });
  const handleResign = () => {
    if (soundEnabled) playSound('game-end');
    setGameResult('You resigned');
    setGameOver(true);
    multiplayer?.onResign();
  };
  const handleAbort = () => {
    if (soundEnabled) playSound('game-end');
    setGameResult('Game Aborted');
    setGameOver(true);
    multiplayer?.onAbort();
  };
  const handleDrawTrigger = () => {
    if (soundEnabled) playSound('draw-offer');
  };
  const handleDrawConfirm = () => {
    if (isMultiplayer) {
      multiplayer!.onOfferDraw();
      return;
    }
    if (soundEnabled) playSound('game-end');
    setGameResult('Draw by agreement');
    setGameOver(true);
  };
  const handleAcceptOpponentDraw = () => {
    if (soundEnabled) playSound('game-end');
    setGameResult('Draw by agreement');
    setGameOver(true);
    multiplayer!.onAcceptDraw();
  };
  const handleNewGame = () => {
    if (isMultiplayer) {
      multiplayer!.onFindNewGame();
    } else {
      setNewGameOpen(true);
    }
  };
  const handleToggleAnalysis = () => {
    if (isAnalysisOn) endAnalysis();
    else startAnalysis();
  };
  const handleFlipBoard = () => {
    if (isPlayMode) flipBoard();
    else toggleBoardOrientation();
  };
  const handlePlayFromPosition = (color: 'white' | 'black') => {
    startPlayingFromPosition(color);
  };
  const isCrazyhouse = variant === 'crazyhouse';
  const isGameActive = isPlayMode && gameStarted && !gameOver;
  const emptyPocket = { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 };
  const whitePocket = isCrazyhouse ? game.getPocket('w') : emptyPocket;
  const blackPocket = isCrazyhouse ? game.getPocket('b') : emptyPocket;
  const handlePocketSelect = (role: PieceSymbol) => {
    if (!isGameActive) return;
    setSelectedDropPiece(selectedDropPiece === role ? null : role);
  };
  return (
    <>
      <SidebarPanel fullHeight>
        <SidebarHeader
          title='Moves'
          actions={
            <>
              {isPlayMode && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8'
                        onClick={() => router.push('/')}
                      >
                        <Icons.home className='h-4 w-4' />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Home</TooltipContent>
                  </Tooltip>
                  <ShareGameDialog
                    isLocalGame={isLocalGame}
                    trigger={
                      <Button variant='ghost' size='icon' className='h-8 w-8'>
                        <Icons.share className='h-4 w-4' />
                      </Button>
                    }
                  />
                </>
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
                      {boardOrientation === 'white' ? 'Black' : 'White'})
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Engine</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleToggleAnalysis}
                      disabled={!isInitialized}
                    >
                      <Icons.stockfish
                        className={`mr-2 h-4 w-4 ${isAnalysisOn ? '[color:var(--success)]' : 'text-muted-foreground'}`}
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
                          Base Position
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          }
        />

        {isMultiplayer && multiplayer!.drawOffered && !gameOver && (
          <div className='shrink-0 space-y-2 border-b bg-blue-500/10 px-4 py-3'>
            <p className='text-center text-sm font-medium text-blue-600 dark:text-blue-400'>
              Opponent offers a draw
            </p>
            <div className='flex gap-2'>
              <Button
                size='sm'
                className='flex-1 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                onClick={handleAcceptOpponentDraw}
              >
                Accept
              </Button>
              <Button
                size='sm'
                variant='outline'
                className='flex-1'
                onClick={multiplayer!.onDeclineDraw}
              >
                Decline
              </Button>
            </div>
          </div>
        )}

        {isCrazyhouse && isPlayMode && (
          <div className='flex shrink-0 flex-col gap-2 border-b px-4 py-2'>
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground text-xs font-medium'>
                {isLocalGame
                  ? 'Black'
                  : playAs === 'black'
                    ? 'Your'
                    : "Opponent's"}{' '}
                pocket
              </span>
              <CrazyhousePocket
                color='black'
                pocket={blackPocket}
                selectedRole={
                  game.turn() === 'b' && (isLocalGame || playAs === 'black')
                    ? selectedDropPiece
                    : null
                }
                onPieceSelect={handlePocketSelect}
                isActive={
                  isGameActive &&
                  game.turn() === 'b' &&
                  (isLocalGame || playAs === 'black')
                }
              />
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground text-xs font-medium'>
                {isLocalGame
                  ? 'White'
                  : playAs === 'white'
                    ? 'Your'
                    : "Opponent's"}{' '}
                pocket
              </span>
              <CrazyhousePocket
                color='white'
                pocket={whitePocket}
                selectedRole={
                  game.turn() === 'w' && (isLocalGame || playAs === 'white')
                    ? selectedDropPiece
                    : null
                }
                onPieceSelect={handlePocketSelect}
                isActive={
                  isGameActive &&
                  game.turn() === 'w' &&
                  (isLocalGame || playAs === 'white')
                }
              />
            </div>
          </div>
        )}

        <ScrollArea className='h-[180px] lg:h-0 lg:min-h-0 lg:flex-1'>
          <div className='px-4 py-2'>
            <MoveHistory
              moves={moves}
              moveDepths={moveDepths}
              viewingIndex={viewingIndex}
              onMoveClick={goToMove}
              showDepthTooltips={
                !isMultiplayer &&
                engineConfig.mode === 'probabilistic' &&
                gameType === 'computer'
              }
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
            {(gameOver || !gameStarted) && (
              <GameOverPanel
                gameResult={gameResult || 'No active game'}
                onNewGame={handleNewGame}
                ratingDelta={
                  isMultiplayer && gameOver
                    ? multiplayer!.ratingDelta
                    : undefined
                }
                moveDepths={moveDepths}
                showDepthDistribution={
                  !isMultiplayer &&
                  gameOver &&
                  engineConfig.mode === 'probabilistic' &&
                  gameType === 'computer'
                }
              />
            )}

            {isMultiplayer && gameOver && multiplayer!.rematchOffered && (
              <div className='space-y-2 rounded-md border bg-purple-500/10 px-3 py-2'>
                <p className='text-center text-sm font-medium text-purple-600 dark:text-purple-400'>
                  Opponent wants a rematch
                </p>
                <div className='flex gap-2'>
                  <Button
                    size='sm'
                    className='flex-1 bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600'
                    onClick={multiplayer!.onAcceptRematch}
                  >
                    Accept
                  </Button>
                  <Button
                    size='sm'
                    variant='outline'
                    className='flex-1'
                    onClick={multiplayer!.onDeclineRematch}
                  >
                    Decline
                  </Button>
                </div>
              </div>
            )}

            {isMultiplayer &&
              gameOver &&
              !multiplayer!.rematchOffered &&
              !multiplayer!.rematchDeclined &&
              multiplayer!.status !== 'matched' &&
              multiplayer!.status !== 'rejoined' && (
                <Button
                  size='sm'
                  variant={rematchSent ? 'default' : 'outline'}
                  className='w-full'
                  disabled={rematchSent}
                  onClick={() => {
                    setRematchSent(true);
                    multiplayer!.onOfferRematch();
                  }}
                >
                  {rematchSent ? 'Rematch Sent ✓' : 'Rematch'}
                </Button>
              )}

            {isMultiplayer && gameOver && multiplayer!.rematchDeclined && (
              <p className='text-muted-foreground text-center text-xs'>
                Opponent declined the rematch
              </p>
            )}

            <div className='flex items-center gap-1'>
              <SettingsButton />
              <FlipBoardButton onFlip={handleFlipBoard} />
              <EngineToggleButton
                isOn={isAnalysisOn}
                disabled={!isInitialized || isLiveGame}
                onToggle={handleToggleAnalysis}
                tooltip={
                  isLiveGame
                    ? 'Analysis unavailable during game'
                    : isAnalysisOn
                      ? 'Turn Off Analysis'
                      : 'Turn On Analysis'
                }
              />
              <div className='ml-auto flex items-center gap-1'>
                <GameActionButtons
                  gameOver={gameOver}
                  gameStarted={gameStarted}
                  canAbort={canAbort}
                  isLocalGame={isLocalGame}
                  isMultiplayer={isMultiplayer}
                  isLiveGame={isLiveGame}
                  onDrawTrigger={handleDrawTrigger}
                  onDrawConfirm={handleDrawConfirm}
                  onResign={handleResign}
                  onAbort={handleAbort}
                />
              </div>
            </div>
          </div>
        )}
      </SidebarPanel>

      {!isMultiplayer &&
        (isLocalGame ? (
          <LocalGameSelectionDialog
            open={newGameOpen}
            onOpenChange={setNewGameOpen}
          />
        ) : (
          <GameSelectionDialog
            open={newGameOpen}
            onOpenChange={setNewGameOpen}
          />
        ))}
    </>
  );
}
