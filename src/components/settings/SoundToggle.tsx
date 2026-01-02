'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Volume2, VolumeX } from 'lucide-react';

type SoundToggleProps = {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
};

export function SoundToggle({ enabled, onToggle }: SoundToggleProps) {
  return (
    <div className='flex items-center justify-between'>
      <Label>Sound Effects</Label>
      <Button
        variant='outline'
        size='sm'
        onClick={() => onToggle(!enabled)}
        className='gap-2'
      >
        {enabled ? (
          <>
            <Volume2 className='h-4 w-4' />
            <span>On</span>
          </>
        ) : (
          <>
            <VolumeX className='h-4 w-4' />
            <span>Off</span>
          </>
        )}
      </Button>
    </div>
  );
}
