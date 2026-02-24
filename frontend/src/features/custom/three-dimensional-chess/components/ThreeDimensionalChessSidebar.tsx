'use client';
import { useState } from 'react';
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
import { SettingsDialog } from '@/features/settings/components/SettingsDialog';
import { useGameStore } from '../store/gameStore';
import { useCameraStore } from '../store/cameraStore';
import { ThreeDimensionalChessAttackBoardPanel } from './ThreeDimensionalChessAttackBoardPanel';
import { ThreeDimensionalChessSetupDialog } from './ThreeDimensionalChessSetupDialog';
import type { CameraView } from '../store/cameraStore';
import type { Move } from '../store/gameStore';

const CAMERA_VIEWS: { view: CameraView; label: string }[] = [
  { view: 'default', label: 'Default' },
  { view: 'side', label: 'Side' },
  { view: 'top', label: 'Top' },
  { view: 'front', label: 'Front' }
];

function formatMove(move: Move): string {
  if (move.type === 'board-move') {
    return `${move.boardId}: ${move.from}→${move.to}${move.rotation === 180 ? ' ↺' : ''}`;
  }
  if (move.type === 'castle') {
    return `Castle (${move.castleType})`;
  }
  return `${move.from}→${move.to}`;
}

function getMoveColor(move: Move): string {
  if (move.type === 'board-move') {
    return move.boardId.startsWith('W') ? 'text-blue-500' : 'text-purple-500';
  }
  const color = move.type === 'piece-move' ? move.piece.color : move.color;
  return color === 'white' ? 'text-foreground' : 'text-muted-foreground';
}

export function ThreeDimensionalChessSidebar() {
  const router = useRouter();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newGameOpen, setNewGameOpen] = useState(false);

  const moveHistory = useGameStore((s) => s.moveHistory);
  const currentTurn = useGameStore((s) => s.currentTurn);
  const isCheck = useGameStore((s) => s.isCheck);
  const isCheckmate = useGameStore((s) => s.isCheckmate);
  const isStalemate = useGameStore((s) => s.isStalemate);
  const winner = useGameStore((s) => s.winner);
  const gameOver = useGameStore((s) => s.gameOver);
  const undoMove = useGameStore((s) => s.undoMove);
  const resetGame = useGameStore((s) => s.resetGame);
  const deferredPromotions = useGameStore((s) => s.deferredPromotions);

  const currentView = useCameraStore((s) => s.currentView);
  const setView = useCameraStore((s) => s.setView);

  const canUndo = moveHistory.length > 0 && !gameOver;

  return (
    <>
      <div className='bg-card flex min-h-[300px] flex-col rounded-lg border lg:h-full'>
        {/* Header */}
        <div className='flex shrink-0 items-center justify-between border-b px-4 py-3'>
          <h3 className='font-semibold'>Three-dimensional Chess</h3>
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
          </div>
        </div>

        {/* Game Status */}
        <div className='shrink-0 border-b px-4 py-2'>
          {gameOver ? (
            <div className='space-y-1'>
              {isCheckmate && (
                <div className='text-sm font-semibold'>
                  Checkmate — <span className='capitalize'>{winner}</span> wins!
                </div>
              )}
              {isStalemate && (
                <div className='text-sm font-semibold'>Stalemate — Draw</div>
              )}
              {!isCheckmate && !isStalemate && (
                <div className='text-muted-foreground text-sm'>Game over</div>
              )}
              <Button
                size='sm'
                className='mt-1 h-7 w-full text-xs'
                onClick={() => setNewGameOpen(true)}
              >
                New Game
              </Button>
            </div>
          ) : (
            <div className='flex items-center justify-between'>
              <div className='text-sm'>
                <span className='text-muted-foreground'>Turn: </span>
                <span className='font-medium capitalize'>{currentTurn}</span>
                {isCheck && (
                  <span className='ml-2 text-xs font-semibold text-amber-500'>
                    CHECK
                  </span>
                )}
                {deferredPromotions.length > 0 && (
                  <span className='ml-2 text-xs text-blue-500'>
                    {deferredPromotions.length} promotion pending
                  </span>
                )}
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-7 w-7'
                    disabled={!canUndo}
                    onClick={undoMove}
                  >
                    <Icons.chevronLeft className='h-4 w-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Undo Move</TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>

        {/* Camera Controls */}
        <div className='shrink-0 border-b px-4 py-2'>
          <p className='text-muted-foreground mb-1.5 text-xs font-medium tracking-wider uppercase'>
            Camera
          </p>
          <div className='flex flex-wrap gap-1'>
            {CAMERA_VIEWS.map(({ view, label }) => (
              <Button
                key={view}
                size='sm'
                variant={currentView === view ? 'secondary' : 'ghost'}
                className='h-6 px-2 text-xs'
                onClick={() => setView(view)}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Attack Board Controls */}
        <div className='shrink-0 border-b'>
          <ThreeDimensionalChessAttackBoardPanel />
        </div>

        {/* Move History */}
        <ScrollArea className='h-[150px] lg:h-0 lg:min-h-0 lg:flex-1'>
          <div className='px-4 py-2'>
            <p className='text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase'>
              Move History
            </p>
            {moveHistory.length === 0 ? (
              <p className='text-muted-foreground text-xs italic'>
                No moves yet
              </p>
            ) : (
              <div className='space-y-0.5'>
                {moveHistory.map((move, idx) => (
                  <div key={idx} className='flex items-center gap-1.5 text-xs'>
                    <span className='text-muted-foreground w-5 shrink-0 text-right'>
                      {idx + 1}.
                    </span>
                    <span className={`font-mono ${getMoveColor(move)}`}>
                      {formatMove(move)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Bottom Controls */}
        <div className='bg-muted/50 shrink-0 border-t p-2'>
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

            <div className='ml-auto flex items-center gap-1'>
              <AlertDialog>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive'
                        disabled={moveHistory.length === 0}
                      >
                        <Icons.abort className='h-4 w-4' />
                      </Button>
                    </AlertDialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent>New Game</TooltipContent>
                </Tooltip>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Start New Game?</AlertDialogTitle>
                    <AlertDialogDescription>
                      The current game will be lost. Are you sure?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        resetGame();
                        setNewGameOpen(false);
                      }}
                      className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                    >
                      New Game
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <ThreeDimensionalChessSetupDialog
        open={newGameOpen}
        onOpenChange={setNewGameOpen}
      />
    </>
  );
}
