'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export type ImportType = 'pgn' | 'fen' | 'moves';

export interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (input: string, type: ImportType) => void;
  title?: string;
  description?: string;
  acceptFEN?: boolean;
  placeholder?: string;
}

export function detectInputType(input: string): ImportType {
  const fenPattern =
    /^[rnbqkpRNBQKP1-8]+\/[rnbqkpRNBQKP1-8]+\/[rnbqkpRNBQKP1-8]+\/[rnbqkpRNBQKP1-8]+\/[rnbqkpRNBQKP1-8]+\/[rnbqkpRNBQKP1-8]+\/[rnbqkpRNBQKP1-8]+\/[rnbqkpRNBQKP1-8]+/;
  if (fenPattern.test(input)) {
    return 'fen';
  }
  if (
    input.includes('[Event ') ||
    input.includes('[White ') ||
    input.includes('[Black ')
  ) {
    return 'pgn';
  }
  if (/\d+\./.test(input)) {
    return 'pgn';
  }
  return 'moves';
}

export function ImportDialog({
  open,
  onOpenChange,
  onImport,
  title = 'Import Position or Game',
  description = 'Paste a PGN, FEN, or move list to analyze.',
  acceptFEN = true,
  placeholder = 'Paste PGN, FEN, or moves here...'
}: ImportDialogProps) {
  const [input, setInput] = useState('');

  const handleImport = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) {
      toast.error('Please enter content to import');
      return;
    }

    const type = detectInputType(trimmed);

    if (type === 'fen' && !acceptFEN) {
      toast.error('FEN import is not supported here');
      return;
    }

    onImport(trimmed, type);
    setInput('');
    onOpenChange(false);
  }, [input, acceptFEN, onImport, onOpenChange]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className='space-y-4 py-4'>
          <Textarea
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className='min-h-[200px] font-mono text-sm'
          />
          <div className='flex flex-wrap gap-2'>
            <Button
              variant='secondary'
              size='sm'
              onClick={() =>
                setInput('1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7')
              }
            >
              Sample PGN
            </Button>
            {acceptFEN && (
              <Button
                variant='secondary'
                size='sm'
                onClick={() =>
                  setInput(
                    'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3'
                  )
                }
              >
                Sample FEN
              </Button>
            )}
            <Button
              variant='secondary'
              size='sm'
              onClick={() => setInput('e4 e5 Nf3 Nc6 Bb5 a6')}
            >
              Sample Moves
            </Button>
            {input && (
              <Button variant='ghost' size='sm' onClick={() => setInput('')}>
                <Icons.close className='mr-1 h-3 w-3' />
                Clear
              </Button>
            )}
          </div>
        </div>
        <div className='flex justify-end gap-2'>
          <Button variant='outline' onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleImport}>Import</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
