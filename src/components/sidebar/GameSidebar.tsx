'use client';

import { PageContainer } from '@/components/layout/PageContainer';
import { useGameSidebar } from '@/hooks/useGameSidebar';
import { SettingsDialog } from '@/components/settings/SettingsDialog';
import { GameSelectionDialog } from '@/components/view/GameSelectionDialog';
import { MoveHistory } from './MoveHistory';
import { NavigationControls } from './NavigationControls';
import { SidebarActions } from './SidebarActions';
import { GameOverPanel } from './GameOverPanel';

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
    handleRematch,
    flipBoard
  } = useGameSidebar();

  return (
    <>
      <div className='bg-card flex h-full flex-col rounded-lg border'>
        {/* Moves Section */}
        <div className='flex min-h-0 flex-1 flex-col overflow-hidden'>
          <div className='shrink-0 border-b px-4 py-3'>
            <h3 className='font-semibold'>Moves</h3>
          </div>
          <PageContainer className='h-0 flex-grow'>
            <div className='px-4 py-2'>
              <MoveHistory
                moves={moves}
                viewingIndex={viewingIndex}
                onMoveClick={goToMove}
              />
            </div>
          </PageContainer>

          <NavigationControls
            viewingIndex={viewingIndex}
            totalPositions={positionHistory.length}
            canGoBack={canGoBack}
            canGoForward={canGoForward}
            onGoToStart={goToStart}
            onGoToEnd={goToEnd}
            onGoToPrev={goToPrev}
            onGoToNext={goToNext}
          />
        </div>

        {/* Bottom Actions */}
        <div className='bg-muted/50 space-y-2 border-t p-2'>
          {gameOver && (
            <GameOverPanel gameResult={gameResult} onRematch={handleRematch} />
          )}
          <SidebarActions
            moves={moves}
            gameOver={gameOver}
            copiedMoves={copiedMoves}
            copiedPGN={copiedPGN}
            onCopyMoves={handleCopyMoves}
            onCopyPGN={handleCopyPGN}
            onOpenSettings={() => setSettingsOpen(true)}
            onOpenNewGame={() => setNewGameOpen(true)}
            onFlipBoard={flipBoard}
            onResign={handleResign}
          />
        </div>
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <GameSelectionDialog open={newGameOpen} onOpenChange={setNewGameOpen} />
    </>
  );
}
