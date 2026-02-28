'use client';
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
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

/**
 * Shared draw-offer and resign/abort action buttons used by all two-player
 * game sidebars (standard chess, custom variants).
 *
 * Place inside a flex row; the buttons render inline without their own
 * background or border — the parent section provides those.
 */
export interface GameActionButtonsProps {
  gameOver: boolean;
  gameStarted: boolean;
  /** true when moves < 2 — shows abort instead of resign */
  canAbort: boolean;
  isLocalGame?: boolean;
  isMultiplayer?: boolean;
  /**
   * During a live multiplayer game the draw button should be enabled
   * (the game is in progress). Outside a live game (waiting, finished) it
   * should be disabled.  Has no effect when isMultiplayer is false.
   */
  isLiveGame?: boolean;
  /** Called when the draw trigger is clicked (before the confirm dialog). */
  onDrawTrigger?: () => void;
  /** Called when the draw is confirmed in the dialog. */
  onDrawConfirm: () => void;
  onResign: () => void;
  onAbort: () => void;
}

export function GameActionButtons({
  gameOver,
  gameStarted,
  canAbort,
  isLocalGame = false,
  isMultiplayer = false,
  isLiveGame = false,
  onDrawTrigger,
  onDrawConfirm,
  onResign,
  onAbort
}: GameActionButtonsProps) {
  return (
    <>
      {/* ── Draw offer ──────────────────────────────────────────────── */}
      <AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-400'
                disabled={
                  gameOver || !gameStarted || (isMultiplayer && !isLiveGame)
                }
                onClick={onDrawTrigger}
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
              {isMultiplayer
                ? 'Send a draw offer to your opponent?'
                : isLocalGame
                  ? 'Do both players agree to a draw?'
                  : 'Do you want to offer a draw to your opponent?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {!isMultiplayer && isLocalGame ? 'No' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onDrawConfirm}
              className='bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
            >
              {isMultiplayer
                ? 'Offer Draw'
                : isLocalGame
                  ? 'Yes, Draw'
                  : 'Offer Draw'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Abort / Resign ──────────────────────────────────────────── */}
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
                : isMultiplayer
                  ? 'Are you sure you want to resign? Your opponent wins.'
                  : 'Are you sure you want to resign? This will end the game and count as a loss.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={canAbort ? onAbort : onResign}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              {canAbort ? 'Abort' : 'Resign'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
