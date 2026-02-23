'use client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  BOARD_THEMES,
  CORE_BOARD_THEME_NAMES
} from '@/features/chess/config/board-themes';
import { BoardThemeName } from '@/features/chess/types/theme';
import { cn } from '@/lib/utils';
type ThemeSelectorProps = {
  currentTheme: BoardThemeName;
  onThemeChange: (themeName: BoardThemeName) => void;
  showExtendedThemes?: boolean;
};
export function BoardThemeSelector({
  currentTheme,
  onThemeChange,
  showExtendedThemes = false
}: ThemeSelectorProps) {
  const visibleThemes = showExtendedThemes
    ? BOARD_THEMES
    : BOARD_THEMES.filter((theme) =>
        CORE_BOARD_THEME_NAMES.includes(theme.name)
      );

  return (
    <div className='space-y-3'>
      <Label>Board Theme</Label>
      <TooltipProvider>
        <div className='grid grid-cols-3 gap-2'>
          {visibleThemes.map((boardTheme) => (
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
