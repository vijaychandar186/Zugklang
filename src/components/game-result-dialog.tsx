'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User, Bot } from 'lucide-react';

interface GameResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameResult: string | null;
  onNewGame: () => void;
}

export function GameResultDialog({
  open,
  onOpenChange,
  gameResult,
  onNewGame
}: GameResultDialogProps) {
  const handleNewGame = () => {
    onNewGame();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-center text-2xl font-light'>
            {gameResult}
          </DialogTitle>
        </DialogHeader>
        <div className='flex items-center justify-center gap-8 py-4'>
          <div className='flex flex-col items-center gap-2'>
            <div className='bg-muted flex h-14 w-14 items-center justify-center rounded-full'>
              <Bot className='h-7 w-7' />
            </div>
            <span className='text-muted-foreground text-sm'>Stockfish</span>
          </div>
          <span className='text-lg font-medium'>vs</span>
          <div className='flex flex-col items-center gap-2'>
            <div className='bg-muted flex h-14 w-14 items-center justify-center rounded-full'>
              <User className='h-7 w-7' />
            </div>
            <span className='text-muted-foreground text-sm'>Player</span>
          </div>
        </div>
        <DialogFooter className='justify-center sm:justify-center'>
          <Button variant='outline' onClick={handleNewGame}>
            New Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
