'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { useBoardStore } from '@/lib/store';

interface GameSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GameSelectionDialog({
  open,
  onOpenChange
}: GameSelectionDialogProps) {
  const stockfishLevel = useBoardStore((state) => state.stockfishLevel);
  const currentPlayAs = useBoardStore((state) => state.playAs);
  const startGame = useBoardStore((state) => state.startGame);

  const [depth, setDepth] = useState(stockfishLevel);
  const [playAs, setPlayAs] = useState<'white' | 'black'>(currentPlayAs);

  useEffect(() => {
    if (open) {
      setDepth(stockfishLevel);
      setPlayAs(currentPlayAs);
    }
  }, [open, stockfishLevel, currentPlayAs]);

  const handleStart = () => {
    startGame(depth, playAs);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-center text-xl'>
            Play vs Computer
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-6 py-4'>
          <div className='space-y-3'>
            <Label className='block text-center'>Engine Depth: {depth}</Label>
            <Slider
              value={[depth]}
              onValueChange={(v) => setDepth(v[0])}
              min={1}
              max={20}
              step={1}
              className='w-full'
            />
            <div className='text-muted-foreground flex justify-between text-xs'>
              <span>Easier</span>
              <span>Harder</span>
            </div>
          </div>
          <div className='space-y-3'>
            <Label className='block text-center'>Play as</Label>
            <RadioGroup
              value={playAs}
              onValueChange={(v) => setPlayAs(v as 'white' | 'black')}
              className='flex justify-center gap-6'
            >
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='white' id='white' />
                <Label htmlFor='white' className='cursor-pointer'>
                  White
                </Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='black' id='black' />
                <Label htmlFor='black' className='cursor-pointer'>
                  Black
                </Label>
              </div>
            </RadioGroup>
          </div>
          <Button className='w-full' size='lg' onClick={handleStart}>
            Start Game
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
