'use client';

import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export interface ExportMenuProps {
  getFEN: () => string;
  getPGN: () => string;
  getMoves?: () => string;
  className?: string;
}

export function ExportMenu({
  getFEN,
  getPGN,
  getMoves,
  className
}: ExportMenuProps) {
  const copyFEN = useCallback(() => {
    const fen = getFEN();
    navigator.clipboard.writeText(fen);
    toast.success('FEN copied');
  }, [getFEN]);

  const copyPGN = useCallback(() => {
    const pgn = getPGN();
    navigator.clipboard.writeText(pgn || '[No moves]');
    toast.success('PGN copied');
  }, [getPGN]);

  const copyMoves = useCallback(() => {
    if (!getMoves) {
      toast.error('No moves to copy');
      return;
    }
    const moves = getMoves();
    navigator.clipboard.writeText(moves || 'No moves');
    toast.success('Moves copied');
  }, [getMoves]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className={className}>
          <Icons.share className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={copyFEN}>
          <Icons.copy className='mr-2 h-4 w-4' />
          Copy FEN
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyPGN}>
          <Icons.fileText className='mr-2 h-4 w-4' />
          Copy PGN
        </DropdownMenuItem>
        {getMoves && (
          <DropdownMenuItem onClick={copyMoves}>
            <Icons.arrowRight className='mr-2 h-4 w-4' />
            Copy Moves
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
