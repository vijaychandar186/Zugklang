'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/Icons';
import {
  useAnalysisConfig,
  useAnalysisActions
} from '@/hooks/stores/useAnalysisStore';

const MAX_THREADS =
  typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
const MAX_HASH = 512;
const MAX_LINES = 5;
const MAX_SEARCH_TIME = 30;

export function AnalysisSettings() {
  const {
    multiPV,
    searchTime,
    threads,
    hashSize,
    showBestMoveArrow,
    showThreatArrow
  } = useAnalysisConfig();
  const {
    setMultiPV,
    setSearchTime,
    setThreads,
    setHashSize,
    setShowBestMoveArrow,
    setShowThreatArrow
  } = useAnalysisActions();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon' className='h-6 w-6'>
          <Icons.settings className='h-3.5 w-3.5' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Engine Settings</DialogTitle>
          <DialogDescription>
            Configure the analysis engine parameters.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-6 pt-2'>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <Label>Search time</Label>
              <span className='text-muted-foreground font-mono text-sm'>
                {searchTime}s
              </span>
            </div>
            <Slider
              value={[searchTime]}
              onValueChange={([value]) => setSearchTime(value)}
              min={1}
              max={MAX_SEARCH_TIME}
              step={1}
            />
          </div>

          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <Label>Multiple lines</Label>
              <span className='text-muted-foreground font-mono text-sm'>
                {multiPV}/{MAX_LINES}
              </span>
            </div>
            <Slider
              value={[multiPV]}
              onValueChange={([value]) => setMultiPV(value)}
              min={1}
              max={MAX_LINES}
              step={1}
            />
          </div>

          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <Label>Threads</Label>
              <span className='text-muted-foreground font-mono text-sm'>
                {threads}/{MAX_THREADS}
              </span>
            </div>
            <Slider
              value={[threads]}
              onValueChange={([value]) => setThreads(value)}
              min={1}
              max={MAX_THREADS}
              step={1}
            />
          </div>

          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <Label>Memory</Label>
              <span className='text-muted-foreground font-mono text-sm'>
                {hashSize}MB
              </span>
            </div>
            <Slider
              value={[hashSize]}
              onValueChange={([value]) => setHashSize(value)}
              min={16}
              max={MAX_HASH}
              step={16}
            />
          </div>
        </div>
        <div className='flex flex-col gap-4 border-t pt-4'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='show-best-arrows'>Show Best Move Arrows</Label>
            <Button
              id='show-best-arrows'
              variant={showBestMoveArrow ? 'default' : 'outline'}
              size='sm'
              onClick={() => setShowBestMoveArrow(!showBestMoveArrow)}
              className='h-7 w-12'
            >
              {showBestMoveArrow ? 'On' : 'Off'}
            </Button>
          </div>
          <div className='flex items-center justify-between'>
            <Label htmlFor='show-threat-arrows'>Show Threat Arrows</Label>
            <Button
              id='show-threat-arrows'
              variant={showThreatArrow ? 'default' : 'outline'}
              size='sm'
              onClick={() => setShowThreatArrow(!showThreatArrow)}
              className='h-7 w-12'
            >
              {showThreatArrow ? 'On' : 'Off'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
