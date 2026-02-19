'use client';

import { useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { MoveHistory } from '@/features/chess/components/sidebar/MoveHistory';
import { NavigationControls } from '@/features/chess/components/sidebar/NavigationControls';
import { GameOverPanel } from '@/features/chess/components/sidebar/GameOverPanel';
import { SettingsDialog } from '@/features/settings/components/SettingsDialog';
import {
  useChessState,
  useChessActions
} from '@/features/chess/stores/useChessStore';
import {
  useAnalysisState,
  useAnalysisActions
} from '@/features/chess/stores/useAnalysisStore';
import { usePlayback } from '@/features/chess/hooks/usePlayback';
import {
  useClipboard,
  formatMovesText,
  formatPGN
} from '@/features/chess/hooks/useClipboard';
import { playSound } from '@/features/game/utils/sounds';
import { CrazyhousePocket } from '@/features/chess/components/CrazyhousePocket';
import { useState, useEffect } from 'react';
import type { PieceSymbol } from '@/lib/chess/chess';
import type { MultiplayerStatus } from '../types';

interface MultiplayerSidebarProps {
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
}

export function MultiplayerSidebar({
  status,
  drawOffered,
  rematchOffered,
  rematchDeclined,
  onAbort,
  onResign,
  onOfferDraw,
  onAcceptDraw,
  onDeclineDraw,
  onOfferRematch,
  onAcceptRematch,
  onDeclineRematch,
  onFindNewGame
}: MultiplayerSidebarProps) {
  const router = useRouter();

  const {
    moves,
    moveDepths,
    viewingIndex,
    positionHistory,
    gameOver,
    gameResult,
    gameStarted,
    playAs,
    soundEnabled,
    game,
    variant,
    selectedDropPiece
  } = useChessState();

  const {
    goToStart,
    goToEnd,
    goToPrev,
    goToNext,
    goToMove,
    flipBoard,
    setGameOver,
    setGameResult,
    setSelectedDropPiece
  } = useChessActions();

  const { isAnalysisOn, isInitialized } = useAnalysisState();
  const { startAnalysis, endAnalysis } = useAnalysisActions();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [rematchSent, setRematchSent] = useState(false);

  // Reset "Rematch Sent" feedback when the offer is declined or a new game starts
  useEffect(() => {
    if (rematchDeclined) setRematchSent(false);
  }, [rematchDeclined]);

  useEffect(() => {
    if (!gameOver) setRematchSent(false);
  }, [gameOver]);

  const canGoBack = viewingIndex > 0;
  const canGoForward = viewingIndex < positionHistory.length - 1;
  const canAbort = moves.length < 4;

  const { copy, isCopied } = useClipboard();
  const { isPlaying, togglePlay } = usePlayback({
    currentIndex: viewingIndex,
    totalItems: positionHistory.length,
    onNext: goToNext
  });

  const handleCopyMoves = () => copy(formatMovesText(moves), 'moves');
  const handleCopyPGN = () =>
    copy(
      formatPGN(moves, { gameOver, gameResult, playAs, isLocalGame: false }),
      'pgn'
    );
  const handleCopyFEN = () => {
    const fen = positionHistory[viewingIndex] || positionHistory[0];
    copy(fen, 'fen');
  };

  const handleResign = () => {
    if (soundEnabled) playSound('game-end');
    setGameResult('You resigned');
    setGameOver(true);
    onResign();
  };

  const handleAbort = () => {
    if (soundEnabled) playSound('game-end');
    setGameResult('Game Aborted');
    setGameOver(true);
    onAbort();
  };

  const handleAcceptDraw = () => {
    if (soundEnabled) playSound('game-end');
    setGameResult('Draw by agreement');
    setGameOver(true);
    onAcceptDraw();
  };

  const handleToggleAnalysis = () => {
    if (isAnalysisOn) endAnalysis();
    else startAnalysis();
  };

  const isCrazyhouse = variant === 'crazyhouse';
  const isGameActive = gameStarted && !gameOver;

  const emptyPocket = { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 };
  const whitePocket = isCrazyhouse ? game.getPocket('w') : emptyPocket;
  const blackPocket = isCrazyhouse ? game.getPocket('b') : emptyPocket;

  const handlePocketSelect = (role: PieceSymbol) => {
    if (!isGameActive) return;
    setSelectedDropPiece(selectedDropPiece === role ? null : role);
  };

  const isPlaying_ = status === 'playing' || (gameStarted && !gameOver);

  return (
    <>
      <div className='bg-card flex min-h-[300px] flex-col rounded-lg border lg:h-full'>
        {/* Header */}
        <div className='flex shrink-0 items-center justify-between border-b px-4 py-3'>
          <h3 className='font-semibold'>Moves</h3>
          <div className='flex items-center gap-1'>
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
                    onClick={handleCopyFEN}
                    variant='outline'
                    className='h-auto justify-between py-3'
                  >
                    <div className='flex flex-col items-start'>
                      <span className='font-medium'>Copy FEN</span>
                      <span className='text-muted-foreground text-xs'>
                        Current position
                      </span>
                    </div>
                    {isCopied('fen') ? (
                      <Icons.check className='h-4 w-4 [color:var(--success)]' />
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
                    {isCopied('pgn') ? (
                      <Icons.check className='h-4 w-4 [color:var(--success)]' />
                    ) : (
                      <Icons.copy className='text-muted-foreground h-4 w-4' />
                    )}
                  </Button>
                  <Button
                    onClick={handleCopyMoves}
                    variant='outline'
                    className='h-auto justify-between py-3'
                  >
                    <div className='flex flex-col items-start'>
                      <span className='font-medium'>Copy Moves</span>
                      <span className='text-muted-foreground text-xs'>
                        Simple move list
                      </span>
                    </div>
                    {isCopied('moves') ? (
                      <Icons.check className='h-4 w-4 [color:var(--success)]' />
                    ) : (
                      <Icons.copy className='text-muted-foreground h-4 w-4' />
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Draw offer banner */}
        {drawOffered && !gameOver && (
          <div className='shrink-0 space-y-2 border-b bg-blue-500/10 px-4 py-3'>
            <p className='text-center text-sm font-medium text-blue-600 dark:text-blue-400'>
              Opponent offers a draw
            </p>
            <div className='flex gap-2'>
              <Button
                size='sm'
                className='flex-1 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                onClick={handleAcceptDraw}
              >
                Accept
              </Button>
              <Button
                size='sm'
                variant='outline'
                className='flex-1'
                onClick={onDeclineDraw}
              >
                Decline
              </Button>
            </div>
          </div>
        )}

        {/* Crazyhouse pockets */}
        {isCrazyhouse && (
          <div className='flex shrink-0 flex-col gap-2 border-b px-4 py-2'>
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground text-xs font-medium'>
                {playAs === 'black' ? 'Your' : "Opponent's"} pocket
              </span>
              <CrazyhousePocket
                color='black'
                pocket={blackPocket}
                selectedRole={
                  game.turn() === 'b' && playAs === 'black'
                    ? selectedDropPiece
                    : null
                }
                onPieceSelect={handlePocketSelect}
                isActive={
                  isGameActive && game.turn() === 'b' && playAs === 'black'
                }
              />
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground text-xs font-medium'>
                {playAs === 'white' ? 'Your' : "Opponent's"} pocket
              </span>
              <CrazyhousePocket
                color='white'
                pocket={whitePocket}
                selectedRole={
                  game.turn() === 'w' && playAs === 'white'
                    ? selectedDropPiece
                    : null
                }
                onPieceSelect={handlePocketSelect}
                isActive={
                  isGameActive && game.turn() === 'w' && playAs === 'white'
                }
              />
            </div>
          </div>
        )}

        {/* Move list */}
        <ScrollArea className='h-[180px] lg:h-0 lg:min-h-0 lg:flex-1'>
          <div className='px-4 py-2'>
            <MoveHistory
              moves={moves}
              moveDepths={moveDepths}
              viewingIndex={viewingIndex}
              onMoveClick={goToMove}
              showDepthTooltips={false}
            />
          </div>
        </ScrollArea>

        {/* Navigation */}
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
        <div className='bg-muted/50 space-y-2 border-t p-2'>
          {(gameOver || !gameStarted) && (
            <GameOverPanel
              gameResult={gameResult || 'No active game'}
              onNewGame={onFindNewGame}
            />
          )}

          {/* Rematch offer received */}
          {gameOver && rematchOffered && (
            <div className='space-y-2 rounded-md border bg-purple-500/10 px-3 py-2'>
              <p className='text-center text-sm font-medium text-purple-600 dark:text-purple-400'>
                Opponent wants a rematch
              </p>
              <div className='flex gap-2'>
                <Button
                  size='sm'
                  className='flex-1 bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600'
                  onClick={onAcceptRematch}
                >
                  Accept
                </Button>
                <Button
                  size='sm'
                  variant='outline'
                  className='flex-1'
                  onClick={onDeclineRematch}
                >
                  Decline
                </Button>
              </div>
            </div>
          )}

          {/* We offered rematch, waiting */}
          {gameOver &&
            !rematchOffered &&
            !rematchDeclined &&
            status !== 'matched' &&
            status !== 'rejoined' && (
              <Button
                size='sm'
                variant={rematchSent ? 'default' : 'outline'}
                className='w-full'
                disabled={rematchSent}
                onClick={() => {
                  setRematchSent(true);
                  onOfferRematch();
                }}
              >
                {rematchSent ? 'Rematch Sent ✓' : 'Rematch'}
              </Button>
            )}

          {/* Opponent declined */}
          {gameOver && rematchDeclined && (
            <p className='text-muted-foreground text-center text-xs'>
              Opponent declined the rematch
            </p>
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
                <Button variant='ghost' size='icon' onClick={flipBoard}>
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
                  disabled={!isInitialized || isPlaying_}
                >
                  <Icons.engine className='h-4 w-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isPlaying_
                  ? 'Analysis unavailable during game'
                  : isAnalysisOn
                    ? 'Turn Off Analysis'
                    : 'Turn On Analysis'}
              </TooltipContent>
            </Tooltip>

            <div className='ml-auto flex items-center gap-1'>
              {/* Draw offer */}
              <AlertDialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-400'
                        disabled={gameOver || !gameStarted || !isPlaying_}
                      >
                        <Icons.handshake className='h-4 w-4' />
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>Offer Draw</TooltipContent>
                </Tooltip>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Offer Draw</AlertDialogTitle>
                    <AlertDialogDescription>
                      Send a draw offer to your opponent?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onOfferDraw}
                      className='bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                    >
                      Offer Draw
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Resign / Abort */}
              <AlertDialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive'
                        disabled={gameOver || !gameStarted}
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
                        ? 'Are you sure you want to abort?'
                        : 'Are you sure you want to resign? Your opponent wins.'}
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
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
