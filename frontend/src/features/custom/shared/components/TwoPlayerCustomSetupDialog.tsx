'use client';
import { useState, useEffect, type ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useChessStore } from '@/features/chess/stores/useChessStore';
import type { TimeControl, TimeControlMode } from '@/features/game/types/rules';
type TwoPlayerCustomSetupDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  rules: ReactNode;
  onStartNewGame: (timeControl: TimeControl) => void;
};
const TIME_OPTIONS = [0.25, 0.5, 1, 1.5, 3, 5, 10, 15, 30, 60];
const INCREMENT_OPTIONS = [0, 1, 2, 3, 5, 10, 15, 30];
function formatTimeLabel(mins: number) {
  if (mins === 0.25) return '15 sec';
  if (mins === 0.5) return '30 sec';
  if (mins === 1) return '1 min';
  if (mins === 1.5) return '1.5 min';
  if (mins === 3) return '3 min';
  if (mins === 5) return '5 min';
  if (mins === 10) return '10 min';
  if (mins === 15) return '15 min';
  if (mins === 30) return '30 min';
  if (mins === 60) return '60 min';
  return `${mins} min`;
}
export function TwoPlayerCustomSetupDialog({
  open,
  onOpenChange,
  title,
  rules,
  onStartNewGame
}: TwoPlayerCustomSetupDialogProps) {
  const autoFlipBoard = useChessStore((s) => s.autoFlipBoard);
  const setAutoFlipBoard = useChessStore((s) => s.setAutoFlipBoard);
  const [flipOnMove, setFlipOnMove] = useState(autoFlipBoard);
  const [timerMode, setTimerMode] = useState<TimeControlMode>('unlimited');
  const [minutes, setMinutes] = useState(10);
  const [increment, setIncrement] = useState(0);
  useEffect(() => {
    if (open) {
      setFlipOnMove(autoFlipBoard);
      setTimerMode('unlimited');
      setMinutes(10);
      setIncrement(0);
    }
  }, [open, autoFlipBoard]);
  const handleStart = () => {
    setAutoFlipBoard(flipOnMove);
    onStartNewGame({
      mode: timerMode,
      minutes: timerMode === 'timed' ? minutes : 0,
      increment: timerMode === 'timed' ? increment : 0
    });
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className='space-y-6 py-4'>
          <div className='flex items-center justify-between rounded-lg border p-4'>
            <div className='space-y-0.5'>
              <Label htmlFor='flip-board' className='text-base'>
                Flip board on each move
              </Label>
              <p className='text-muted-foreground text-sm'>
                Automatically rotate to face the current player
              </p>
            </div>
            <Switch
              id='flip-board'
              checked={flipOnMove}
              onCheckedChange={setFlipOnMove}
            />
          </div>

          <div className='space-y-2'>
            <Label className='text-base font-semibold'>Time Control</Label>
            <Select
              value={timerMode}
              onValueChange={(v) => setTimerMode(v as TimeControlMode)}
            >
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='unlimited'>Unlimited</SelectItem>
                <SelectItem value='timed'>Timed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {timerMode === 'timed' && (
            <>
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <Label>Minutes per side</Label>
                  <span className='text-muted-foreground text-sm font-medium'>
                    {formatTimeLabel(minutes)}
                  </span>
                </div>
                <Slider
                  value={[TIME_OPTIONS.indexOf(minutes)]}
                  onValueChange={(v) => setMinutes(TIME_OPTIONS[v[0]])}
                  max={TIME_OPTIONS.length - 1}
                  step={1}
                />
              </div>

              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <Label>Increment (seconds)</Label>
                  <span className='text-muted-foreground text-sm font-medium'>
                    {increment}s
                  </span>
                </div>
                <Slider
                  value={[INCREMENT_OPTIONS.indexOf(increment)]}
                  onValueChange={(v) => setIncrement(INCREMENT_OPTIONS[v[0]])}
                  max={INCREMENT_OPTIONS.length - 1}
                  step={1}
                />
              </div>
            </>
          )}

          <div className='rounded-lg border p-4'>{rules}</div>

          <Button onClick={handleStart} className='w-full' size='lg'>
            Start Game
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
