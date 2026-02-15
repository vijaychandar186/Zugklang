'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TEAM_INFO, TEAMS } from '../config/teams';

type FourPlayerGameDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStart: () => void;
};

export function FourPlayerGameDialog({
  open,
  onOpenChange,
  onStart
}: FourPlayerGameDialogProps) {
  const handleStart = () => {
    onStart();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-center text-xl'>
            4-Player Chess
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4 py-4'>
          <p className='text-muted-foreground text-center text-sm'>
            Play 4-player chess on a 14×14 board. Red starts, then Blue, Yellow,
            and Green take turns.
          </p>
          <div className='flex justify-center gap-3'>
            {TEAMS.map((team) => {
              const info = TEAM_INFO[team];
              return (
                <div key={team} className='flex items-center gap-1.5 text-xs'>
                  <div
                    className='h-3 w-3 rounded-full'
                    style={{ backgroundColor: info.cssVar }}
                  />
                  {info.label}
                </div>
              );
            })}
          </div>
          <Button className='w-full' size='lg' onClick={handleStart}>
            Start Game
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
