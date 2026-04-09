'use client';
import { useEffect, useState, type ComponentType, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { MoveHistory } from '@/features/chess/components/sidebar/MoveHistory';
import { ShareGameDialog } from '@/features/chess/components/sidebar/ShareGameDialog';
import { NavigationControls } from '@/features/chess/components/sidebar/NavigationControls';
import { GameOverPanel } from '@/features/chess/components/sidebar/GameOverPanel';
import { SidebarPanel } from '@/features/chess/components/sidebar/SidebarPanel';
import { SidebarHeader } from '@/features/chess/components/sidebar/SidebarHeader';
import { GameActionButtons } from '@/features/chess/components/sidebar/GameActionButtons';
import { SettingsButton } from '@/features/chess/components/actions/SettingsButton';
import { FlipBoardButton } from '@/features/chess/components/actions/FlipBoardButton';
import { EngineToggleButton } from '@/features/chess/components/actions/EngineToggleButton';
import { usePlayback } from '@/features/chess/hooks/usePlayback';
import { playSound } from '@/features/game/utils/sounds';
import type { ChessMode } from '@/features/chess/stores/useChessStore';
import type { TwoPlayerMultiplayerSidebarProps } from '@/features/chess/types/game-engine-contract';
interface SetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
interface TwoPlayerCustomSidebarProps {
  mode: ChessMode;
  moves: string[];
  viewingIndex: number;
  positionHistory: string[];
  gameOver: boolean;
  gameResult: string | null;
  gameStarted: boolean;
  turn: 'w' | 'b';
  soundEnabled: boolean;
  isAnalysisOn: boolean;
  isAnalysisReady: boolean;
  onGoToStart: () => void;
  onGoToEnd: () => void;
  onGoToPrev: () => void;
  onGoToNext: () => void;
  onGoToMove: (index: number) => void;
  onSetGameOver: (value: boolean) => void;
  onSetGameResult: (value: string | null) => void;
  onFlipBoard: () => void;
  onStartAnalysis: () => void;
  onEndAnalysis: () => void;
  setupDialog?: ComponentType<SetupDialogProps>;
  activePanel?: ReactNode;
  statsNode?: ReactNode;
  statsTitle?: string;
  multiplayer?: TwoPlayerMultiplayerSidebarProps;
}
export function TwoPlayerCustomSidebar({
  mode,
  moves,
  viewingIndex,
  positionHistory,
  gameOver,
  gameResult,
  gameStarted,
  turn,
  soundEnabled,
  isAnalysisOn,
  isAnalysisReady,
  onGoToStart,
  onGoToEnd,
  onGoToPrev,
  onGoToNext,
  onGoToMove,
  onSetGameOver,
  onSetGameResult,
  onFlipBoard,
  onStartAnalysis,
  onEndAnalysis,
  setupDialog: SetupDialogComponent,
  activePanel,
  statsNode,
  statsTitle,
  multiplayer
}: TwoPlayerCustomSidebarProps) {
  const router = useRouter();
  const [newGameOpen, setNewGameOpen] = useState(false);
  const [rematchSent, setRematchSent] = useState(false);
  const isMultiplayer = !!multiplayer;
  const isPlayMode = mode === 'play';
  const canGoBack = viewingIndex > 0;
  const canGoForward = viewingIndex < positionHistory.length - 1;
  const canAbort = moves.length < 2;
  const isLiveGame = isMultiplayer && gameStarted && !gameOver;
  useEffect(() => {
    if (multiplayer?.rematchDeclined) setRematchSent(false);
  }, [multiplayer?.rematchDeclined]);
  useEffect(() => {
    if (!gameOver) setRematchSent(false);
  }, [gameOver]);
  const { isPlaying, togglePlay } = usePlayback({
    currentIndex: viewingIndex,
    totalItems: positionHistory.length,
    onNext: onGoToNext
  });
  const handleResign = () => {
    if (soundEnabled) playSound('game-end');
    if (isMultiplayer) {
      multiplayer!.onResign();
      return;
    }
    const winner = turn === 'w' ? 'Black' : 'White';
    onSetGameResult(`${winner} wins — opponent resigned`);
    onSetGameOver(true);
  };
  const handleAbort = () => {
    if (soundEnabled) playSound('game-end');
    if (isMultiplayer) {
      multiplayer!.onAbort();
      return;
    }
    onSetGameResult('Game Aborted');
    onSetGameOver(true);
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
    onSetGameResult('Draw by agreement');
    onSetGameOver(true);
  };
  const handleToggleAnalysis = () => {
    if (isAnalysisOn) onEndAnalysis();
    else onStartAnalysis();
  };
  return (
    <>
      <SidebarPanel fullHeight>
        <SidebarHeader
          title='Moves'
          actions={
            isPlayMode ? (
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
                  isLocalGame={!isMultiplayer}
                  moves={moves}
                  positionHistory={positionHistory}
                  viewingIndex={viewingIndex}
                  gameOver={gameOver}
                  gameResult={gameResult}
                  playAs='white'
                  trigger={
                    <Button variant='ghost' size='icon' className='h-8 w-8'>
                      <Icons.share className='h-4 w-4' />
                    </Button>
                  }
                />
              </>
            ) : undefined
          }
        />

        {activePanel}

        {isMultiplayer && multiplayer!.drawOffered && !gameOver && (
          <div className='shrink-0 space-y-2 border-b bg-blue-500/10 px-4 py-3'>
            <p className='text-center text-sm font-medium text-blue-600 dark:text-blue-400'>
              Opponent offers a draw
            </p>
            <div className='flex gap-2'>
              <Button
                size='sm'
                className='flex-1 bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                onClick={multiplayer!.onAcceptDraw}
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

        <ScrollArea className='h-[180px] lg:h-0 lg:min-h-0 lg:flex-1'>
          <div className='px-4 py-2'>
            <MoveHistory
              moves={moves}
              viewingIndex={viewingIndex}
              onMoveClick={onGoToMove}
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
          onGoToStart={onGoToStart}
          onGoToEnd={onGoToEnd}
          onGoToPrev={onGoToPrev}
          onGoToNext={onGoToNext}
        />

        {(isPlayMode || isMultiplayer) && (
          <div className='bg-muted/50 space-y-2 border-t p-2'>
            {(gameOver || !gameStarted) && (
              <GameOverPanel
                gameResult={gameResult || 'No active game'}
                onNewGame={
                  isMultiplayer
                    ? multiplayer!.onFindNewGame
                    : () => setNewGameOpen(true)
                }
                ratingDelta={
                  isMultiplayer && gameOver
                    ? multiplayer!.ratingDelta
                    : undefined
                }
                statsNode={gameOver ? statsNode : undefined}
                statsTitle={statsTitle}
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
              <FlipBoardButton onFlip={onFlipBoard} />

              <EngineToggleButton
                isOn={isAnalysisOn}
                disabled={!isAnalysisReady || isLiveGame}
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
                  isLocalGame={!isMultiplayer}
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

      {!isMultiplayer && SetupDialogComponent && (
        <SetupDialogComponent
          open={newGameOpen}
          onOpenChange={setNewGameOpen}
        />
      )}
    </>
  );
}
