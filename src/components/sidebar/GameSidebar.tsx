'use client';

import { useGameSidebar } from '@/hooks/useGameSidebar';
import { SettingsDialog } from '@/components/settings/SettingsDialog';
import { GameSelectionDialog } from '@/components/view/GameSelectionDialog';
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
import { Sidebar } from './Sidebar';

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
      <Sidebar
        moves={moves}
        viewingIndex={viewingIndex}
        totalPositions={positionHistory.length}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        isPlaying={isPlaying}
        onMoveClick={goToMove}
        onTogglePlay={onTogglePlay}
        onGoToStart={goToStart}
        onGoToEnd={goToEnd}
        onGoToPrev={goToPrev}
        onGoToNext={goToNext}
        headerContent={
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
        }
        bottomContent={
          <>
            {gameOver && (
              <GameOverPanel
                gameResult={gameResult}
                onRematch={handleRematch}
              />
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
          </>
        }
      />

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <GameSelectionDialog open={newGameOpen} onOpenChange={setNewGameOpen} />
    </>
  );
}
