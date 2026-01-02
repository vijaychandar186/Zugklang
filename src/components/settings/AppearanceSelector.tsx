'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/Icons';

type AppearanceSelectorProps = {
  theme: string | undefined;
  onThemeChange: (theme: string) => void;
};

export function AppearanceSelector({
  theme,
  onThemeChange
}: AppearanceSelectorProps) {
  return (
    <div className='space-y-3'>
      <Label>Appearance</Label>
      <div className='flex gap-2'>
        <Button
          variant={theme === 'system' ? 'default' : 'outline'}
          size='sm'
          onClick={() => onThemeChange('system')}
          className='flex-1'
        >
          <Icons.system className='mr-2 h-4 w-4' />
          System
        </Button>
        <Button
          variant={theme === 'light' ? 'default' : 'outline'}
          size='sm'
          onClick={() => onThemeChange('light')}
          className='flex-1'
        >
          <Icons.sun className='mr-2 h-4 w-4' />
          Light
        </Button>
        <Button
          variant={theme === 'dark' ? 'default' : 'outline'}
          size='sm'
          onClick={() => onThemeChange('dark')}
          className='flex-1'
        >
          <Icons.moon className='mr-2 h-4 w-4' />
          Dark
        </Button>
      </div>
    </div>
  );
}
