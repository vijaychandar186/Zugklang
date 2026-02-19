'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Icons } from '@/components/Icons';
import type { ReviewStatus } from '@/features/game-review/types';

type ReviewInputProps = {
  input: string;
  onInputChange: (value: string) => void;
  depth: number;
  onDepthChange: (value: number) => void;
  status: ReviewStatus;
  progress: number;
  errorMsg: string;
  onAnalyse: () => void;
};

export function ReviewInput({
  input,
  onInputChange,
  depth,
  onDepthChange,
  status,
  progress,
  errorMsg,
  onAnalyse
}: ReviewInputProps) {
  const isLoading =
    status === 'parsing' || status === 'evaluating' || status === 'reporting';

  const DepthIcon =
    depth <= 14 ? Icons.zap : depth <= 17 ? Icons.rabbit : Icons.turtle;

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Icons.fileText className='size-5' />
          Game Review
        </CardTitle>
        <CardDescription>Analyse your chess games</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-2'>
          <Label>PGN, FEN, or Moves</Label>
          <ScrollArea className='h-24 w-full rounded-md border'>
            <Textarea
              placeholder='Paste PGN, FEN, or moves here...'
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              className='min-h-24 resize-none border-0 font-mono text-xs focus-visible:ring-0'
            />
          </ScrollArea>
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Label>Search Depth</Label>
            <span className='flex items-center gap-1 font-mono text-sm'>
              {depth}
              {DepthIcon && <DepthIcon className='size-4' />}
            </span>
          </div>
          <Slider
            value={[depth]}
            onValueChange={([val]) => onDepthChange(val)}
            min={14}
            max={20}
            step={1}
          />
          <p className='text-muted-foreground text-xs'>
            Lower depths recommended for slower devices.
          </p>
        </div>

        {status === 'error' && errorMsg && (
          <div className='border-destructive bg-destructive/10 rounded-md border p-3'>
            <p className='text-destructive text-sm'>{errorMsg}</p>
          </div>
        )}

        {isLoading && (
          <div className='space-y-1'>
            <div className='text-muted-foreground flex justify-between text-xs'>
              <span className='capitalize'>{status}...</span>
              <span>{progress}%</span>
            </div>
            <div className='bg-secondary h-2 overflow-hidden rounded-full'>
              <div
                className='bg-primary h-full transition-all'
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <Button
          className='w-full'
          onClick={onAnalyse}
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? (
            <Icons.spinner className='mr-2 size-4 animate-spin' />
          ) : (
            <Icons.play className='mr-2 size-4' />
          )}
          Analyse
        </Button>
      </CardContent>
    </Card>
  );
}
