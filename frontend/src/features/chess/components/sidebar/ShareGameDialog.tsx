'use client';
import type { ReactNode } from 'react';
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
import { useChessState } from '@/features/chess/stores/useChessStore';
import {
  useClipboard,
  formatMovesText,
  formatPGN
} from '@/features/chess/hooks/useClipboard';

interface ShareGameDialogProps {
  /** Button / element that opens the dialog. */
  trigger: ReactNode;
  /** Pass true for local (hot-seat) games so PGN uses "White"/"Black" names. */
  isLocalGame?: boolean;
  /**
   * Explicit game data.  When provided, these values are used instead of
   * reading from the chess store.  Useful for custom-variant sidebars that
   * maintain their own state (card chess, dice chess, tri-d chess, …).
   */
  moves?: string[];
  positionHistory?: string[];
  viewingIndex?: number;
  gameOver?: boolean;
  gameResult?: string | null;
  playAs?: 'white' | 'black';
}

/**
 * Share-game dialog reused by ChessSidebar (all chess modes incl. multiplayer),
 * TwoPlayerCustomSidebar, and any future sidebar that needs FEN / PGN /
 * move-list copying.
 *
 * When called without explicit data props it falls back to the chess store
 * (standard chess modes).  Pass explicit data for custom variant modes.
 */
export function ShareGameDialog({
  trigger,
  isLocalGame = false,
  moves: movesProp,
  positionHistory: positionHistoryProp,
  viewingIndex: viewingIndexProp,
  gameOver: gameOverProp,
  gameResult: gameResultProp,
  playAs: playAsProp
}: ShareGameDialogProps) {
  const store = useChessState();
  const { copy, isCopied } = useClipboard();

  // Prefer explicit props, fall back to store values.
  const moves = movesProp ?? store.moves;
  const positionHistory = positionHistoryProp ?? store.positionHistory;
  const viewingIndex = viewingIndexProp ?? store.viewingIndex;
  const gameOver = gameOverProp ?? store.gameOver;
  const gameResult = gameResultProp ?? store.gameResult;
  const playAs = playAsProp ?? store.playAs;

  const handleCopyFEN = () => {
    const fen = positionHistory[viewingIndex] ?? positionHistory[0];
    if (fen) copy(fen, 'fen');
  };
  const handleCopyPGN = () =>
    copy(
      formatPGN(moves, { gameOver, gameResult, playAs, isLocalGame }),
      'pgn'
    );
  const handleCopyMoves = () => copy(formatMovesText(moves), 'moves');

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Game</DialogTitle>
          <DialogDescription>Copy moves or PGN to clipboard.</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-3 pt-2'>
          <Button
            onClick={handleCopyFEN}
            variant='outline'
            className='h-auto justify-between py-3'
          >
            <div className='flex flex-col items-start'>
              <span className='font-medium'>
                {isCopied('fen') ? 'Copied FEN' : 'Copy FEN'}
              </span>
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
              <span className='font-medium'>
                {isCopied('pgn') ? 'Copied PGN' : 'Copy PGN'}
              </span>
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
              <span className='font-medium'>
                {isCopied('moves') ? 'Copied Moves' : 'Copy Moves'}
              </span>
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
  );
}
