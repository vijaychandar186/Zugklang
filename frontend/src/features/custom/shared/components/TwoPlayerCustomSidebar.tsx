'use client';
import { useState, type ComponentType, type ReactNode } from 'react';
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
  setupDialog: ComponentType<SetupDialogProps>;
  /** Optional panel rendered between the header and move history (e.g. CardPanel, DicePanel). */
  activePanel?: ReactNode;
  /** Optional statistics node shown in the game-over panel dialog. */
  statsNode?: ReactNode;
  statsTitle?: string;
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
  statsTitle
}: TwoPlayerCustomSidebarProps) {
  const router = useRouter();
  const [newGameOpen, setNewGameOpen] = useState(false);
  const isPlayMode = mode === 'play';
  const canGoBack = viewingIndex > 0;
  const canGoForward = viewingIndex < positionHistory.length - 1;
  const canAbort = moves.length < 2;

  const { isPlaying, togglePlay } = usePlayback({
    currentIndex: viewingIndex,
    totalItems: positionHistory.length,
    onNext: onGoToNext
  });

  const handleResign = () => {
    if (soundEnabled) playSound('game-end');
    const winner = turn === 'w' ? 'Black' : 'White';
    onSetGameResult(`${winner} wins — opponent resigned`);
    onSetGameOver(true);
  };

  const handleAbort = () => {
    if (soundEnabled) playSound('game-end');
    onSetGameResult('Game Aborted');
    onSetGameOver(true);
  };

  const handleDrawTrigger = () => {
    if (soundEnabled) playSound('draw-offer');
  };

  const handleAcceptDraw = () => {
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
        {/* ── Header ────────────────────────────────────────────────────── */}
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
                  isLocalGame
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

        {/* ── Mode-specific panel (CardPanel, DicePanel, info text, …) ── */}
        {activePanel}

        {/* ── Move history ───────────────────────────────────────────────── */}
        <ScrollArea className='h-[180px] lg:h-0 lg:min-h-0 lg:flex-1'>
          <div className='px-4 py-2'>
            <MoveHistory
              moves={moves}
              viewingIndex={viewingIndex}
              onMoveClick={onGoToMove}
            />
          </div>
        </ScrollArea>

        {/* ── Navigation controls ────────────────────────────────────────── */}
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

        {/* ── Play-mode footer ───────────────────────────────────────────── */}
        {isPlayMode && (
          <div className='bg-muted/50 space-y-2 border-t p-2'>
            {(gameOver || !gameStarted) && (
              <GameOverPanel
                gameResult={gameResult || 'No active game'}
                onNewGame={() => setNewGameOpen(true)}
                statsNode={gameOver ? statsNode : undefined}
                statsTitle={statsTitle}
              />
            )}

            {/* ── Action bar ─────────────────────────────────────────────── */}
            <div className='flex items-center gap-1'>
              <SettingsButton />
              <FlipBoardButton onFlip={onFlipBoard} />
              <EngineToggleButton
                isOn={isAnalysisOn}
                disabled={!isAnalysisReady}
                onToggle={handleToggleAnalysis}
                tooltip={
                  isAnalysisOn ? 'Turn Off Analysis' : 'Turn On Analysis'
                }
              />
              <div className='ml-auto flex items-center gap-1'>
                <GameActionButtons
                  gameOver={gameOver}
                  gameStarted={gameStarted}
                  canAbort={canAbort}
                  isLocalGame
                  onDrawTrigger={handleDrawTrigger}
                  onDrawConfirm={handleAcceptDraw}
                  onResign={handleResign}
                  onAbort={handleAbort}
                />
              </div>
            </div>
          </div>
        )}
      </SidebarPanel>

      <SetupDialogComponent open={newGameOpen} onOpenChange={setNewGameOpen} />
    </>
  );
}
