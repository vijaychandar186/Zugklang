'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { useGameSidebar } from '@/hooks/useGameSidebar';
import { SettingsDialog } from '@/components/settings/SettingsDialog';
import { GameSelectionDialog } from '@/components/view/GameSelectionDialog';
import { MoveHistory } from './MoveHistory';
import { NavigationControls } from './NavigationControls';
import { SidebarActions } from './SidebarActions';
import { GameOverPanel } from './GameOverPanel';
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

export function GameSidebar() {
  const {
    settingsOpen,
    setSettingsOpen,
    newGameOpen,
    setNewGameOpen,
    copiedMoves,
    copiedPGN,
    moves,
    viewingIndex,
    positionHistory,
    gameOver,
    gameResult,
    gameStarted,
    canGoBack,
    canGoForward,
    goToStart,
    goToEnd,
    goToPrev,
    goToNext,
    goToMove,
    handleCopyMoves,
    handleCopyPGN,
    handleResign,
    handleAbort,
    handleRematch,
    flipBoard,
    isPlaying,
    onTogglePlay
  } = useGameSidebar();

  return (
    <>
      <div className='bg-card flex h-full flex-col rounded-lg border'>
        {/* Moves Section */}
        <div className='flex shrink-0 items-center justify-between border-b px-4 py-3'>
          <h3 className='font-semibold'>Moves</h3>
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
          onTogglePlay={onTogglePlay}
          onGoToStart={goToStart}
          onGoToEnd={goToEnd}
          onGoToPrev={goToPrev}
          onGoToNext={goToNext}
        />

        {/* Bottom Actions */}
        <div className='bg-muted/50 space-y-2 border-t p-2'>
          {gameOver && (
            <GameOverPanel gameResult={gameResult} onRematch={handleRematch} />
          )}
          <SidebarActions
            moves={moves}
            gameOver={gameOver}
            onOpenSettings={() => setSettingsOpen(true)}
            onOpenNewGame={() => setNewGameOpen(true)}
            onFlipBoard={flipBoard}
            onResign={handleResign}
            onAbort={handleAbort}
            gameStarted={gameStarted}
          />
        </div>
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <GameSelectionDialog open={newGameOpen} onOpenChange={setNewGameOpen} />
    </>
  );
}
