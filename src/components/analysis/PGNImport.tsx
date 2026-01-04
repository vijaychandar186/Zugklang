'use client';

import { useState } from 'react';
import { useAnalysisBoardActions } from '@/hooks/stores/useAnalysisBoardStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Icons } from '@/components/Icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { toast } from 'sonner';

export function PGNImport({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [pgnInput, setPgnInput] = useState('');
  const { loadPGN, loadFEN } = useAnalysisBoardActions();

  const handleImport = () => {
    const trimmed = pgnInput.trim();
    // ... (rest of function unchanged, just need to make sure I don't delete lines by mistake)
    if (!trimmed) {
      toast.error('Please enter a PGN or FEN string');
      return;
    }

    // Try to detect if it's a FEN (contains slashes and typically one line)
    const isFEN =
      trimmed.includes('/') &&
      !trimmed.includes('[') &&
      trimmed.split('\n').length === 1;

    if (isFEN) {
      const success = loadFEN(trimmed);
      if (success) {
        toast.success('FEN loaded successfully!');
        setOpen(false);
        setPgnInput('');
      } else {
        toast.error('Invalid FEN string');
      }
    } else {
      const success = loadPGN(trimmed);
      if (success) {
        toast.success('PGN loaded successfully!');
        setOpen(false);
        setPgnInput('');
      } else {
        toast.error('Invalid PGN format');
      }
    }
  };

  const samplePGN = `[Event "Sample Game"]
[Site "?"]
[Date "2024.01.01"]
[Round "?"]
[White "Player1"]
[Black "Player2"]
[Result "1-0"]

1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 1-0`;

  const sampleFEN =
    'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant='outline' size='sm' className='gap-2'>
            <Icons.upload className='h-4 w-4' />
            Import PGN/FEN
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Import Game or Position</DialogTitle>
          <DialogDescription>
            Paste a PGN (game notation) or FEN (position) string to load it into
            the analysis board.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <Textarea
            placeholder='Paste PGN or FEN here...'
            value={pgnInput}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setPgnInput(e.target.value)
            }
            className='min-h-[200px] font-mono text-sm'
          />

          <div className='flex gap-2'>
            <Button
              variant='secondary'
              size='sm'
              onClick={() => setPgnInput(samplePGN)}
              className='gap-2'
            >
              <Icons.fileText className='h-3 w-3' />
              Load Sample PGN
            </Button>
            <Button
              variant='secondary'
              size='sm'
              onClick={() => setPgnInput(sampleFEN)}
              className='gap-2'
            >
              <Icons.fileText className='h-3 w-3' />
              Load Sample FEN
            </Button>
            {pgnInput && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setPgnInput('')}
                className='gap-2'
              >
                <Icons.close className='h-3 w-3' />
                Clear
              </Button>
            )}
          </div>

          <div className='bg-muted space-y-2 rounded-lg p-3 text-sm'>
            <p className='font-semibold'>Examples:</p>
            <div className='text-muted-foreground space-y-1'>
              <p>
                <strong>PGN:</strong> Standard chess notation with moves like
                &quot;1. e4 e5 2. Nf3...&quot;
              </p>
              <p>
                <strong>FEN:</strong> Position string like
                &quot;rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0
                1&quot;
              </p>
            </div>
          </div>
        </div>

        <div className='flex justify-end gap-2'>
          <Button variant='outline' onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport}>Import</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
