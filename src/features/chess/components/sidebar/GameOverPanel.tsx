'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { DepthDistributionChart } from '../DepthDistributionChart';

type GameOverPanelProps = {
  gameResult: string | null;
  onNewGame: () => void;
  moveDepths?: (number | null)[];
  showDepthDistribution?: boolean;
};

export function GameOverPanel({
  gameResult,
  onNewGame,
  moveDepths,
  showDepthDistribution = false
}: GameOverPanelProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className='flex flex-col gap-2 border-b pb-2'>
      <p className='text-center text-sm font-medium'>{gameResult}</p>

      <div className='flex gap-2'>
        <Button
          variant='default'
          size='sm'
          className='flex-1'
          onClick={onNewGame}
        >
          <Icons.newGame className='mr-2 h-4 w-4' />
          New Game
        </Button>

        {showDepthDistribution && moveDepths && moveDepths.length > 0 && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant='outline' size='sm'>
                <Icons.chartSpline className='h-4 w-4' />
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-md'>
              <DialogHeader>
                <DialogTitle>Engine Performance Statistics</DialogTitle>
              </DialogHeader>
              <DepthDistributionChart moveDepths={moveDepths} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
