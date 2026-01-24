'use client';

import { useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/Icons';

type FullscreenToggleProps = {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
};

export function FullscreenToggle({ enabled, onToggle }: FullscreenToggleProps) {
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        onToggle(true);
      } else {
        await document.exitFullscreen();
        onToggle(false);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, [onToggle]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      onToggle(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [onToggle]);

  return (
    <div className='flex items-center justify-between'>
      <Label>Fullscreen</Label>
      <Button
        variant='outline'
        size='sm'
        onClick={toggleFullscreen}
        className='gap-2'
      >
        {enabled ? (
          <>
            <Icons.fullscreen className='h-4 w-4' />
            <span>On</span>
          </>
        ) : (
          <>
            <Icons.exitFullscreen className='h-4 w-4' />
            <span>Off</span>
          </>
        )}
      </Button>
    </div>
  );
}
