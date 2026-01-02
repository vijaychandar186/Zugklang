'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { BOARD_THEMES, BoardThemeName } from '@/constants/board-themes';
import { cn } from '@/lib/utils';

type ThemeSelectorProps = {
  currentTheme: BoardThemeName;
  onThemeChange: (themeName: BoardThemeName) => void;
};

export function BoardThemeSelector({
  currentTheme,
  onThemeChange
}: ThemeSelectorProps) {
  return (
    <div className='space-y-3'>
      <Label>Board Theme</Label>
      <TooltipProvider>
        <div className='grid grid-cols-3 gap-2'>
          {BOARD_THEMES.map((boardTheme) => (
            <Tooltip key={boardTheme.name}>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    'h-10 w-full overflow-hidden p-0',
                    currentTheme === boardTheme.name &&
                      'ring-primary ring-2 ring-offset-2'
                  )}
                  onClick={() => onThemeChange(boardTheme.name)}
                >
                  <div className='flex h-full w-full'>
                    <div className='h-full w-1/2' style={boardTheme.dark} />
                    <div className='h-full w-1/2' style={boardTheme.light} />
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
  );
}
