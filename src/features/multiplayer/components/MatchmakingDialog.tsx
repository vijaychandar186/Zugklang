'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Icons } from '@/components/Icons';
import type { TimeControl, TimeControlMode } from '@/features/game/types/rules';
import type { ChallengeColor, MultiplayerStatus } from '../types';

interface MatchmakingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: MultiplayerStatus;
  variantLabel: string;
  errorMessage: string | null;
  /** Set when we created a challenge and are waiting for a friend */
  pendingChallengeId: string | null;
  /** Set when the page was opened via a friend's challenge link */
  initialChallengeId?: string;
  onFindGame: (timeControl: TimeControl) => void;
  onCancel: () => void;
  onCreateChallenge: (timeControl: TimeControl, color: ChallengeColor) => void;
  onCancelChallenge: () => void;
}

type Mode = 'random' | 'friend';

export function MatchmakingDialog({
  open,
  onOpenChange,
  status,
  variantLabel,
  errorMessage,
  pendingChallengeId,
  initialChallengeId,
  onFindGame,
  onCancel,
  onCreateChallenge,
  onCancelChallenge
}: MatchmakingDialogProps) {
  const [mode, setMode] = useState<Mode>(
    initialChallengeId ? 'friend' : 'random'
  );
  const [timerMode, setTimerMode] = useState<TimeControlMode>('unlimited');
  const [minutes, setMinutes] = useState(10);
  const [increment, setIncrement] = useState(0);
  const [color, setColor] = useState<ChallengeColor>('random');
  const [linkCopied, setLinkCopied] = useState(false);

  const isMatched = status === 'matched';
  const isSearching = status === 'waiting' || status === 'connecting';
  const isWaitingForFriend =
    status === 'waiting' && pendingChallengeId !== null;
  const isRandomSearching = status === 'waiting' && pendingChallengeId === null;
  const isJoiningFriend =
    initialChallengeId != null && !isMatched && status !== 'error';

  useEffect(() => {
    if (!open) {
      setTimerMode('unlimited');
      setMinutes(10);
      setIncrement(0);
      setColor('random');
      setLinkCopied(false);
      if (!initialChallengeId) setMode('random');
    }
  }, [open, initialChallengeId]);

  const buildTimeControl = (): TimeControl => ({
    mode: timerMode,
    minutes: timerMode === 'timed' ? minutes : 0,
    increment: timerMode === 'timed' ? increment : 0
  });

  const handleFindGame = () => onFindGame(buildTimeControl());

  const handleCreateChallenge = () =>
    onCreateChallenge(buildTimeControl(), color);

  const handleCancelRandom = () => {
    onCancel();
    onOpenChange(false);
  };

  const handleCancelChallenge = () => {
    onCancelChallenge();
  };

  const shareLink = pendingChallengeId
    ? `${typeof window !== 'undefined' ? window.location.origin + window.location.pathname : ''}?challenge=${pendingChallengeId}`
    : '';

  const handleCopyLink = useCallback(() => {
    if (!shareLink) return;
    navigator.clipboard.writeText(shareLink).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  }, [shareLink]);

  const formatTimeLabel = (mins: number) => {
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
  };

  const formatIncrementLabel = (secs: number) => {
    if (secs === 0) return 'No increment';
    if (secs < 60) return `+${secs} sec`;
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return s === 0 ? `+${m} min` : `+${m} min ${s} sec`;
  };

  const timeControlSummary =
    timerMode === 'unlimited' ? 'Unlimited' : `${minutes}+${increment}`;

  const renderTimeControlPicker = () => (
    <div className='space-y-4'>
      <div className='space-y-2'>
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
            <SelectItem value='timed'>Timed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {timerMode === 'timed' && (
        <>
          <div className='space-y-2'>
            <Label className='block text-center'>
              Time per side: {formatTimeLabel(minutes)}
            </Label>
            <Slider
              value={[minutes]}
              onValueChange={(v) => setMinutes(v[0])}
              min={1}
              max={60}
              step={1}
            />
            <div className='text-muted-foreground flex justify-between text-xs'>
              <span>1 min</span>
              <span>60 min</span>
            </div>
          </div>

          <div className='space-y-2'>
            <Label className='block text-center'>
              Increment: {formatIncrementLabel(increment)}
            </Label>
            <Slider
              value={[increment]}
              onValueChange={(v) => setIncrement(v[0])}
              min={0}
              max={60}
              step={1}
            />
            <div className='text-muted-foreground flex justify-between text-xs'>
              <span>No increment</span>
              <span>60 sec</span>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v && !isSearching) onOpenChange(v);
      }}
    >
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-center text-xl'>
            Online Multiplayer
          </DialogTitle>
        </DialogHeader>

        {errorMessage && (
          <div className='border-destructive/50 bg-destructive/10 text-destructive rounded-md border px-4 py-3 text-sm'>
            {errorMessage}
          </div>
        )}

        {/* ── Matched ── */}
        {isMatched ? (
          <div className='flex flex-col items-center gap-4 py-6'>
            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10'>
              <Icons.check className='h-8 w-8 text-green-500' />
            </div>
            <p className='text-center font-semibold'>Opponent found!</p>
            <p className='text-muted-foreground text-center text-sm'>
              Starting game…
            </p>
          </div>
        ) : /* ── Joining a friend's game (opened via link) ── */
        isJoiningFriend ? (
          <div className='flex flex-col items-center gap-4 py-6'>
            <div className='bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full'>
              <Icons.spinner className='text-primary h-8 w-8 animate-spin' />
            </div>
            <p className='text-center font-semibold'>
              Joining your friend&apos;s game…
            </p>
            <p className='text-muted-foreground text-center text-sm'>
              {variantLabel}
            </p>
          </div>
        ) : /* ── Waiting for friend (created a challenge) ── */
        isWaitingForFriend ? (
          <div className='flex flex-col items-center gap-4 py-6'>
            <div className='bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full'>
              <Icons.spinner className='text-primary h-8 w-8 animate-spin' />
            </div>
            <p className='text-center font-semibold'>
              Waiting for your friend…
            </p>
            <p className='text-muted-foreground text-center text-sm'>
              {variantLabel} · {timeControlSummary}
            </p>

            <Button
              variant='outline'
              className='w-full gap-2'
              onClick={handleCopyLink}
            >
              {linkCopied ? (
                <Icons.check className='h-4 w-4 text-green-500' />
              ) : (
                <Icons.copy className='h-4 w-4' />
              )}
              {linkCopied ? 'Copied!' : 'Copy invite link'}
            </Button>

            <Button
              variant='outline'
              className='w-full'
              onClick={handleCancelChallenge}
            >
              Cancel
            </Button>
          </div>
        ) : /* ── Random match searching ── */
        isRandomSearching ? (
          <div className='flex flex-col items-center gap-4 py-6'>
            <div className='bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full'>
              <Icons.spinner className='text-primary h-8 w-8 animate-spin' />
            </div>
            <p className='text-center font-semibold'>
              Searching for an opponent…
            </p>
            <p className='text-muted-foreground text-center text-sm'>
              {variantLabel} · {timeControlSummary}
            </p>
            <Button
              variant='outline'
              className='mt-2 w-full'
              onClick={handleCancelRandom}
            >
              Cancel
            </Button>
          </div>
        ) : (
          /* ── Setup ── */
          <div className='space-y-5 py-2'>
            {/* Mode tabs */}
            <div className='flex rounded-lg border p-1'>
              <button
                className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  mode === 'random'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setMode('random')}
              >
                Random Match
              </button>
              <button
                className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  mode === 'friend'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setMode('friend')}
              >
                Play with Friend
              </button>
            </div>

            {mode === 'random' ? (
              <>
                <p className='text-muted-foreground text-center text-sm'>
                  Get matched with a random online opponent instantly.
                </p>
                {renderTimeControlPicker()}
                <Button className='w-full' size='lg' onClick={handleFindGame}>
                  <Icons.usersRound className='mr-2 h-4 w-4' />
                  Find Game
                </Button>
              </>
            ) : (
              <>
                <p className='text-muted-foreground text-center text-sm'>
                  Create a game link and share it with a friend.
                </p>
                {renderTimeControlPicker()}

                {/* Color picker */}
                <div className='space-y-2'>
                  <Label className='block text-center'>Play as</Label>
                  <div className='flex gap-2'>
                    {(['white', 'random', 'black'] as ChallengeColor[]).map(
                      (c) => (
                        <button
                          key={c}
                          onClick={() => setColor(c)}
                          className={`flex flex-1 flex-col items-center gap-1 rounded-lg border py-3 text-sm font-medium transition-colors ${
                            color === c
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                          }`}
                        >
                          <span className='text-xl leading-none'>
                            {c === 'white' ? '♔' : c === 'black' ? '♚' : '⇄'}
                          </span>
                          <span className='capitalize'>{c}</span>
                        </button>
                      )
                    )}
                  </div>
                </div>

                <Button
                  className='w-full'
                  size='lg'
                  onClick={handleCreateChallenge}
                >
                  <Icons.share className='mr-2 h-4 w-4' />
                  Create Game Link
                </Button>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
