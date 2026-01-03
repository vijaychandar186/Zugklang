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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  useGameStore,
  TimeControl,
  TimeControlMode
} from '@/hooks/stores/useGameStore';

type PlayAsOption = 'random' | 'white' | 'black';

type GameSelectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function GameSelectionDialog({
  open,
  onOpenChange
}: GameSelectionDialogProps) {
  const stockfishLevel = useGameStore((s) => s.stockfishLevel);
  const currentTimeControl = useGameStore((s) => s.timeControl);
  const startGame = useGameStore((s) => s.startGame);

  const [depth, setDepth] = useState(stockfishLevel);
  const [playAs, setPlayAs] = useState<PlayAsOption>('random');

  // Timer mode
  const [timerMode, setTimerMode] = useState<TimeControlMode>(
    currentTimeControl.mode
  );

  // Timed mode settings (same for both)
  const [minutes, setMinutes] = useState(currentTimeControl.minutes || 10);
  const [increment, setIncrement] = useState(currentTimeControl.increment || 0);

  // Custom mode settings (different per player)
  const [whiteMinutes, setWhiteMinutes] = useState(
    currentTimeControl.whiteMinutes ?? 10
  );
  const [whiteIncrement, setWhiteIncrement] = useState(
    currentTimeControl.whiteIncrement ?? 0
  );
  const [blackMinutes, setBlackMinutes] = useState(
    currentTimeControl.blackMinutes ?? 10
  );
  const [blackIncrement, setBlackIncrement] = useState(
    currentTimeControl.blackIncrement ?? 0
  );

  useEffect(() => {
    if (open) {
      setDepth(stockfishLevel);
      setPlayAs('random');
      setTimerMode(currentTimeControl.mode);
      setMinutes(currentTimeControl.minutes || 10);
      setIncrement(currentTimeControl.increment || 0);
      setWhiteMinutes(currentTimeControl.whiteMinutes ?? 10);
      setWhiteIncrement(currentTimeControl.whiteIncrement ?? 0);
      setBlackMinutes(currentTimeControl.blackMinutes ?? 10);
      setBlackIncrement(currentTimeControl.blackIncrement ?? 0);
    }
  }, [open, stockfishLevel, currentTimeControl]);

  const handleStart = () => {
    // Resolve random color
    const resolvedColor: 'white' | 'black' =
      playAs === 'random' ? (Math.random() < 0.5 ? 'white' : 'black') : playAs;

    const timeControl: TimeControl = {
      mode: timerMode,
      minutes: timerMode === 'timed' ? minutes : 0,
      increment: timerMode === 'timed' ? increment : 0,
      whiteMinutes: timerMode === 'custom' ? whiteMinutes : undefined,
      whiteIncrement: timerMode === 'custom' ? whiteIncrement : undefined,
      blackMinutes: timerMode === 'custom' ? blackMinutes : undefined,
      blackIncrement: timerMode === 'custom' ? blackIncrement : undefined
    };
    startGame(depth, resolvedColor, timeControl);
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
              onValueChange={(v) => setPlayAs(v as PlayAsOption)}
              className='flex justify-center gap-6'
            >
              <div className='flex items-center space-x-2'>
                <RadioGroupItem value='random' id='random' />
                <Label htmlFor='random' className='cursor-pointer'>
                  Random
                </Label>
              </div>
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
                <SelectItem value='custom'>Custom (per player)</SelectItem>
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
                  White (Player 1)
                </Label>
                <div className='space-y-3'>
                  <Label className='block text-center text-sm'>
                    Time: {formatTimeLabel(whiteMinutes)}
                  </Label>
                  <Slider
                    value={[whiteMinutes]}
                    onValueChange={(v) => setWhiteMinutes(v[0])}
                    min={1}
                    max={180}
                    step={1}
                    className='w-full'
                  />
                  <Label className='block text-center text-sm'>
                    Increment: {formatIncrementLabel(whiteIncrement)}
                  </Label>
                  <Slider
                    value={[whiteIncrement]}
                    onValueChange={(v) => setWhiteIncrement(v[0])}
                    min={0}
                    max={180}
                    step={1}
                    className='w-full'
                  />
                </div>
              </div>

              <div className='rounded-lg border p-4'>
                <Label className='mb-3 block text-center font-medium'>
                  Black (Player 2)
                </Label>
                <div className='space-y-3'>
                  <Label className='block text-center text-sm'>
                    Time: {formatTimeLabel(blackMinutes)}
                  </Label>
                  <Slider
                    value={[blackMinutes]}
                    onValueChange={(v) => setBlackMinutes(v[0])}
                    min={1}
                    max={180}
                    step={1}
                    className='w-full'
                  />
                  <Label className='block text-center text-sm'>
                    Increment: {formatIncrementLabel(blackIncrement)}
                  </Label>
                  <Slider
                    value={[blackIncrement]}
                    onValueChange={(v) => setBlackIncrement(v[0])}
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
