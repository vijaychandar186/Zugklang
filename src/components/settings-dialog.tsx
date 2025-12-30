'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useBoardStore } from '@/lib/store';
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BOARD_THEMES = [
  {
    dark: { backgroundColor: 'var(--chart-3)' },
    light: { backgroundColor: 'var(--secondary)' },
    label: 'Default'
  },
  {
    dark: { backgroundColor: 'var(--chart-1)' },
    light: { backgroundColor: 'var(--muted)' },
    label: 'Blue'
  },
  {
    dark: { backgroundColor: 'var(--chart-2)' },
    light: { backgroundColor: 'var(--card)' },
    label: 'Teal'
  },
  {
    dark: { backgroundColor: 'var(--chart-4)' },
    light: { backgroundColor: 'var(--popover)' },
    label: 'Gold'
  },
  {
    dark: { backgroundColor: 'var(--chart-5)' },
    light: { backgroundColor: 'var(--accent)' },
    label: 'Orange'
  },
  {
    dark: { backgroundColor: 'var(--primary)' },
    light: { backgroundColor: 'var(--secondary)' },
    label: 'Mono'
  }
];

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const setBoardTheme = useBoardStore((state) => state.setTheme);
  const { theme, setTheme } = useTheme();

  const handleBoardThemeChange = (
    darkSquareStyle: React.CSSProperties,
    lightSquareStyle: React.CSSProperties
  ) => {
    setBoardTheme({ darkSquareStyle, lightSquareStyle });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className='space-y-6'>
          <div className='space-y-3'>
            <Label>Board Theme</Label>
            <TooltipProvider>
              <div className='grid grid-cols-3 gap-2'>
                {BOARD_THEMES.map((boardTheme, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <Button
                        variant='outline'
                        className='h-10 w-full overflow-hidden p-0'
                        onClick={() =>
                          handleBoardThemeChange(
                            boardTheme.dark,
                            boardTheme.light
                          )
                        }
                      >
                        <div className='flex h-full w-full'>
                          <div
                            className='h-full w-1/2'
                            style={boardTheme.dark}
                          />
                          <div
                            className='h-full w-1/2'
                            style={boardTheme.light}
                          />
                        </div>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{boardTheme.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </div>
          <div className='space-y-3'>
            <Label>Appearance</Label>
            <div className='flex gap-2'>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setTheme('system')}
                className='flex-1'
              >
                <Monitor className='mr-2 h-4 w-4' />
                System
              </Button>
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setTheme('light')}
                className='flex-1'
              >
                <Sun className='mr-2 h-4 w-4' />
                Light
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setTheme('dark')}
                className='flex-1'
              >
                <Moon className='mr-2 h-4 w-4' />
                Dark
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
