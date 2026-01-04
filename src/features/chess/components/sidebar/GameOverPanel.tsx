'use client';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icons';

type GameOverPanelProps = {
  gameResult: string | null;
  onRematch: () => void;
};

export function GameOverPanel({ gameResult, onRematch }: GameOverPanelProps) {
  return (
    <div className='flex flex-col gap-2 border-b pb-2'>
      <p className='text-center text-sm font-medium'>{gameResult}</p>
      <Button
        variant='default'
        size='sm'
        className='w-full'
        onClick={onRematch}
      >
        <Icons.rematch className='mr-2 h-4 w-4' />
        Rematch
      </Button>
    </div>
  );
}
