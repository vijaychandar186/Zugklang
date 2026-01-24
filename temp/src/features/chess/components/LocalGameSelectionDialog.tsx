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
import { TimeControl, TimeControlMode } from '@/features/game/types/rules';

type LocalGameSelectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LocalGameSelectionDialog({
  open,
  onOpenChange
}: LocalGameSelectionDialogProps) {
  const currentTimeControl = useChessStore((s) => s.timeControl);
  const autoFlipBoard = useChessStore((s) => s.autoFlipBoard);
  const startLocalGame = useChessStore((s) => s.startLocalGame);
  const setAutoFlipBoard = useChessStore((s) => s.setAutoFlipBoard);

  const [timerMode, setTimerMode] = useState<TimeControlMode>(
    currentTimeControl.mode
  );
  const [flipOnMove, setFlipOnMove] = useState(autoFlipBoard);

  const [minutes, setMinutes] = useState(currentTimeControl.minutes || 10);
  const [increment, setIncrement] = useState(currentTimeControl.increment || 0);

  const [player1Minutes, setPlayer1Minutes] = useState(10);
  const [player1Increment, setPlayer1Increment] = useState(0);
  const [player2Minutes, setPlayer2Minutes] = useState(10);
  const [player2Increment, setPlayer2Increment] = useState(0);

  useEffect(() => {
    if (open) {
      setFlipOnMove(autoFlipBoard);
      setTimerMode(currentTimeControl.mode);
      setMinutes(currentTimeControl.minutes || 10);
      setIncrement(currentTimeControl.increment || 0);
      setPlayer1Minutes(10);
      setPlayer1Increment(0);
      setPlayer2Minutes(10);
      setPlayer2Increment(0);
    }
  }, [open, autoFlipBoard, currentTimeControl]);

  const handleStart = () => {
    setAutoFlipBoard(flipOnMove);

    const timeControl: TimeControl = {
      mode: timerMode,
      minutes: timerMode === 'timed' ? minutes : 0,
      increment: timerMode === 'timed' ? increment : 0,
      whiteMinutes: timerMode === 'custom' ? player1Minutes : undefined,
      whiteIncrement: timerMode === 'custom' ? player1Increment : undefined,
      blackMinutes: timerMode === 'custom' ? player2Minutes : undefined,
      blackIncrement: timerMode === 'custom' ? player2Increment : undefined
    };
    startLocalGame(timeControl);
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
            Pass and Play
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-6 py-4'>
          <div className='flex items-center justify-between rounded-lg border p-4'>
            <div className='space-y-0.5'>
              <Label htmlFor='flip-on-move'>Flip board on each move</Label>
              <p className='text-muted-foreground text-sm'>
                Rotate the board after every move
              </p>
            </div>
            <Switch
              id='flip-on-move'
              checked={flipOnMove}
              onCheckedChange={setFlipOnMove}
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
                <SelectItem value='custom'>Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {timerMode === 'timed' && (
            <>
              <div className='space-y-3'>
                <Label className='block text-center'>
                  Time per side: {formatTimeLabel(minutes)}
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

          {timerMode === 'custom' && (
            <>
              <div className='rounded-lg border p-4'>
                <Label className='mb-3 block text-center font-medium'>
                  White
                </Label>
                <div className='space-y-3'>
                  <Label className='block text-center text-sm'>
                    Time: {formatTimeLabel(player1Minutes)}
                  </Label>
                  <Slider
                    value={[player1Minutes]}
                    onValueChange={(v) => setPlayer1Minutes(v[0])}
                    min={1}
                    max={180}
                    step={1}
                    className='w-full'
                  />
                  <Label className='block text-center text-sm'>
                    Increment: {formatIncrementLabel(player1Increment)}
                  </Label>
                  <Slider
                    value={[player1Increment]}
                    onValueChange={(v) => setPlayer1Increment(v[0])}
                    min={0}
                    max={180}
                    step={1}
                    className='w-full'
                  />
                </div>
              </div>

              <div className='rounded-lg border p-4'>
                <Label className='mb-3 block text-center font-medium'>
                  Black
                </Label>
                <div className='space-y-3'>
                  <Label className='block text-center text-sm'>
                    Time: {formatTimeLabel(player2Minutes)}
                  </Label>
                  <Slider
                    value={[player2Minutes]}
                    onValueChange={(v) => setPlayer2Minutes(v[0])}
                    min={1}
                    max={180}
                    step={1}
                    className='w-full'
                  />
                  <Label className='block text-center text-sm'>
                    Increment: {formatIncrementLabel(player2Increment)}
                  </Label>
                  <Slider
                    value={[player2Increment]}
                    onValueChange={(v) => setPlayer2Increment(v[0])}
                    min={0}
                    max={180}
                    step={1}
                    className='w-full'
                  />
                </div>
              </div>
            </>
          )}

          <Button className='w-full' size='lg' onClick={handleStart}>
            Start Game
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
