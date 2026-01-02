'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useGameStore } from '@/hooks/stores/useGameStore';
import { useTheme } from 'next-themes';
import { BoardThemeSelector } from './ThemeSelector';
import { AppearanceSelector } from './AppearanceSelector';
import { SoundToggle } from './SoundToggle';
import { BoardThemeName } from '@/constants/board-themes';

type SettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const setBoardTheme = useGameStore((s) => s.setBoardTheme);
  const currentBoardTheme = useGameStore((s) => s.boardThemeName);
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const setSoundEnabled = useGameStore((s) => s.setSoundEnabled);
  const { theme, setTheme } = useTheme();

  const handleBoardThemeChange = (themeName: BoardThemeName) => {
    setBoardTheme(themeName);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className='space-y-6'>
          <BoardThemeSelector
            currentTheme={currentBoardTheme}
            onThemeChange={handleBoardThemeChange}
          />
          <SoundToggle enabled={soundEnabled} onToggle={setSoundEnabled} />
          <AppearanceSelector theme={theme} onThemeChange={setTheme} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
