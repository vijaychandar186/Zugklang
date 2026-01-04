'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/Icons';

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
            <Icons.volumeOn className='h-4 w-4' />
            <span>On</span>
          </>
        ) : (
          <>
            <Icons.volumeOff className='h-4 w-4' />
            <span>Off</span>
          </>
        )}
      </Button>
    </div>
  );
}
