'use client';

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

type SidebarActionsProps = {
  moves: string[];
  gameOver: boolean;
  copiedMoves: boolean;
  copiedPGN: boolean;
  onCopyMoves: () => void;
  onCopyPGN: () => void;
  onOpenSettings: () => void;
  onOpenNewGame: () => void;
  onFlipBoard: () => void;
  onResign: () => void;
};

export function SidebarActions({
  moves,
  gameOver,
  copiedMoves,
  copiedPGN,
  onCopyMoves,
  onCopyPGN,
  onOpenSettings,
  onOpenNewGame,
  onFlipBoard,
  onResign
}: SidebarActionsProps) {
  return (
    <div className='flex items-center gap-1'>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            onClick={onCopyMoves}
            disabled={moves.length === 0}
          >
            {copiedMoves ? (
              <Icons.check
                className='h-4 w-4'
                style={{ color: 'var(--success)' }}
              />
            ) : (
              <Icons.copy className='h-4 w-4' />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copy Moves</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            onClick={onCopyPGN}
            disabled={moves.length === 0}
            className='text-xs'
          >
            {copiedPGN ? (
              <Icons.check
                className='h-4 w-4'
                style={{ color: 'var(--success)' }}
              />
            ) : (
              <>PGN</>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copy PGN</TooltipContent>
      </Tooltip>
      <Button
        variant='ghost'
        size='icon'
        onClick={onOpenSettings}
        title='Settings'
      >
        <Icons.settings className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='icon'
        onClick={onOpenNewGame}
        title='New Game'
      >
        <Icons.newGame className='h-4 w-4' />
      </Button>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            onClick={onFlipBoard}
            className='ml-auto'
          >
            <Icons.flipBoard className='h-4 w-4' />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Flip Board</TooltipContent>
      </Tooltip>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            className='bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive'
            disabled={gameOver || moves.length === 0}
          >
            <Icons.flag className='mr-2 h-4 w-4' />
            Resign
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resign Game?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to resign? This will end the game and count
              as a loss.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onResign}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Resign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
