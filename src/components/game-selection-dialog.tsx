'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useBoardStore } from '@/lib/store';
import { Difficulty, DIFFICULTY_DEPTH } from '@/utils/types';

interface GameSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GameSelectionDialog({
  open,
  onOpenChange
}: GameSelectionDialogProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [playAs, setPlayAs] = useState<'white' | 'black'>('white');
  const startGame = useBoardStore((state) => state.startGame);

  const handleStart = () => {
    const depth = DIFFICULTY_DEPTH[difficulty];
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
            <Label className='block text-center'>Difficulty</Label>
            <RadioGroup
              value={difficulty}
              onValueChange={(v) => setDifficulty(v as Difficulty)}
              className='flex justify-center gap-4'
            >
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='easy' id='easy' />
                <Label htmlFor='easy' className='cursor-pointer'>
                  Easy
                </Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='medium' id='medium' />
                <Label htmlFor='medium' className='cursor-pointer'>
                  Medium
                </Label>
              </div>
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='hard' id='hard' />
                <Label htmlFor='hard' className='cursor-pointer'>
                  Hard
                </Label>
              </div>
            </RadioGroup>
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
