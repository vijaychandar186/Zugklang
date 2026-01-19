'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Square, Box } from 'lucide-react';

type Board3dToggleProps = {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
};

export function Board3dToggle({ enabled, onToggle }: Board3dToggleProps) {
  return (
    <div className='space-y-3'>
      <Label>Board Type</Label>
      <div className='flex gap-2'>
        <Button
          variant={!enabled ? 'default' : 'outline'}
          size='sm'
          onClick={() => onToggle(false)}
          className='flex-1'
        >
          <Square className='mr-2 h-4 w-4' />
          2D
        </Button>
        <Button
          variant={enabled ? 'default' : 'outline'}
          size='sm'
          onClick={() => onToggle(true)}
          className='flex-1'
        >
          <Box className='mr-2 h-4 w-4' />
          3D
        </Button>
      </div>
    </div>
  );
}
