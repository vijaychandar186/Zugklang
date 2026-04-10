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
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { TimeControl, TimeControlMode } from '@/features/game/types/rules';
import { useFourPlayerStore } from '../store';

interface FourPlayerGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStart: () => void;
}

export function FourPlayerGameDialog({
  open,
  onOpenChange,
  onStart
}: FourPlayerGameDialogProps) {
  const currentTimeControl = useFourPlayerStore((s) => s.timeControl);
  const autoRotateBoard = useFourPlayerStore((s) => s.autoRotateBoard);

  const [rotateOnMove, setRotateOnMove] = useState(autoRotateBoard);
  const [timerMode, setTimerMode] = useState<TimeControlMode>(
    currentTimeControl?.mode || 'unlimited'
  );
  const [minutes, setMinutes] = useState(currentTimeControl?.minutes || 10);
  const [increment, setIncrement] = useState(
    currentTimeControl?.increment || 0
  );

  useEffect(() => {
    if (open) {
      setRotateOnMove(autoRotateBoard);
      setTimerMode(currentTimeControl?.mode || 'unlimited');
      setMinutes(currentTimeControl?.minutes || 10);
      setIncrement(currentTimeControl?.increment || 0);
    }
  }, [open, autoRotateBoard, currentTimeControl]);

  const handleStart = () => {
    const timeControl: TimeControl = {
      mode: timerMode,
      minutes: timerMode === 'timed' ? minutes : 0,
      increment: timerMode === 'timed' ? increment : 0
    };

    useFourPlayerStore.getState().setTimeControl(timeControl);
    useFourPlayerStore.getState().setAutoRotateBoard(rotateOnMove);

    onStart();
    onOpenChange(false);
  };

  const formatTimeLabel = (mins: number) => {
    if (mins < 60) return `${mins} min`;
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (remainingMins === 0) return `${hours} hr`;
    return `${hours} hr ${remainingMins} min`;
  };

  const formatIncrementLabel = (secs: number) => {
    if (secs === 0) return 'No increment';
    if (secs < 60) return `+${secs} sec`;
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    if (remainingSecs === 0) return `+${mins} min`;
    return `+${mins} min ${remainingSecs} sec`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-center text-xl'>
            Four Player Chess
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-6 py-4'>
          <div className='flex items-center justify-between rounded-lg border p-4'>
            <div className='space-y-0.5'>
              <Label htmlFor='rotate-on-move'>Rotate board on each move</Label>
              <p className='text-muted-foreground text-sm'>
                Automatically rotate to face the current player
              </p>
            </div>
            <Switch
              id='rotate-on-move'
              checked={rotateOnMove}
              onCheckedChange={setRotateOnMove}
            />
          </div>

          <div className='space-y-3'>
            <Label className='block text-center'>Time Control</Label>
            <Select
              value={timerMode}
              onValueChange={(v) => setTimerMode(v as TimeControlMode)}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select time control' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='unlimited'>Unlimited</SelectItem>
                <SelectItem value='timed'>Time Controlled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {timerMode === 'timed' && (
            <>
              <div className='space-y-3'>
                <Label className='block text-center'>
                  Time per player: {formatTimeLabel(minutes)}
                </Label>
                <Slider
                  value={[minutes]}
                  onValueChange={(v) => setMinutes(v[0])}
                  min={1}
                  max={180}
                  step={1}
                  className='w-full'
                />
                <div className='text-muted-foreground flex justify-between text-xs'>
                  <span>1 min</span>
                  <span>3 hours</span>
                </div>
              </div>

              <div className='space-y-3'>
                <Label className='block text-center'>
                  Increment: {formatIncrementLabel(increment)}
                </Label>
                <Slider
                  value={[increment]}
                  onValueChange={(v) => setIncrement(v[0])}
                  min={0}
                  max={180}
                  step={1}
                  className='w-full'
                />
                <div className='text-muted-foreground flex justify-between text-xs'>
                  <span>No increment</span>
                  <span>3 min</span>
                </div>
              </div>
            </>
          )}

          <div className='rounded-lg border p-3'>
            <p className='text-muted-foreground text-center text-xs'>
              Turn order: Red → Blue → Yellow → Green
              <br />
              Earn points by capturing pieces and checkmating opponents!
            </p>
          </div>

          <Button className='w-full' size='lg' onClick={handleStart}>
            Start Game
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
