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
import { MoveHistory } from '@/features/chess/components/sidebar/MoveHistory';
import { NavigationControls } from '@/features/chess/components/sidebar/NavigationControls';
import { GameOverPanel } from '@/features/chess/components/sidebar/GameOverPanel';
import { SettingsDialog } from '@/features/settings/components/SettingsDialog';
import { usePlayback } from '@/features/chess/hooks/usePlayback';
import {
  useClipboard,
  formatMovesText,
  formatPGN
} from '@/features/chess/hooks/useClipboard';
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
  activePanel?: ReactNode;
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
  activePanel
}: TwoPlayerCustomSidebarProps) {
  const router = useRouter();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newGameOpen, setNewGameOpen] = useState(false);
  const isPlayMode = mode === 'play';
  const canGoBack = viewingIndex > 0;
  const canGoForward = viewingIndex < positionHistory.length - 1;
  const canAbort = moves.length < 4;
  const { copy, isCopied } = useClipboard();
  const { isPlaying, togglePlay } = usePlayback({
    currentIndex: viewingIndex,
    totalItems: positionHistory.length,
    onNext: onGoToNext
  });
  const handleCopyMoves = () => copy(formatMovesText(moves), 'moves');
  const handleCopyPGN = () =>
    copy(
      formatPGN(moves, {
        gameOver,
        gameResult,
        playAs: 'white',
        isLocalGame: true
      }),
      'pgn'
    );
  const handleCopyFEN = () => {
    const fen = positionHistory[viewingIndex] || positionHistory[0];
    copy(fen, 'fen');
  };
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
  const handleOfferDraw = () => {
    if (soundEnabled) playSound('draw-offer');
  };
  const handleAcceptDraw = () => {
    if (soundEnabled) playSound('game-end');
    onSetGameResult('Draw by agreement');
    onSetGameOver(true);
  };
  const handleToggleAnalysis = () => {
    if (isAnalysisOn) {
      onEndAnalysis();
      return;
    }
    onStartAnalysis();
  };
  return (
    <>
      <div className='bg-card flex min-h-[300px] flex-col rounded-lg border lg:h-full'>
        <div className='flex shrink-0 items-center justify-between border-b px-4 py-3'>
          <h3 className='font-semibold'>Moves</h3>
          <div className='flex items-center gap-1'>
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
              </>
            )}
          </div>
        </div>

        {activePanel}

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

        {isPlayMode && (
          <div className='bg-muted/50 space-y-2 border-t p-2'>
            {(gameOver || !gameStarted) && (
              <GameOverPanel
                gameResult={gameResult || 'No active game'}
                onNewGame={() => setNewGameOpen(true)}
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
                  <Button variant='ghost' size='icon' onClick={onFlipBoard}>
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
                    disabled={!isAnalysisReady}
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
                          className='bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-400'
                          disabled={gameOver || !gameStarted}
                          onClick={handleOfferDraw}
                        >
                          <Icons.handshake className='h-4 w-4' />
                        </Button>
                      </AlertDialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Offer Draw</TooltipContent>
                  </Tooltip>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Draw Offer</AlertDialogTitle>
                      <AlertDialogDescription>
                        Do both players agree to a draw?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>No</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleAcceptDraw}
                        className='bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
                      >
                        Yes, Draw
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

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
      <SetupDialogComponent open={newGameOpen} onOpenChange={setNewGameOpen} />
    </>
  );
}
