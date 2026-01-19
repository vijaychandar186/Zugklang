'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useChessStore } from '@/features/chess/stores/useChessStore';
import { useTheme } from 'next-themes';
import { BoardThemeSelector } from './ThemeSelector';
import { AppearanceSelector } from './AppearanceSelector';
import { SoundToggle } from './SoundToggle';
import { Board3dToggle } from './Board3dToggle';
import { FullscreenToggle } from './FullscreenToggle';
import { BoardThemeName } from '@/features/chess/types/theme';

type SettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const setBoardTheme = useChessStore((s) => s.setBoardTheme);
  const currentBoardTheme = useChessStore((s) => s.boardThemeName);
  const soundEnabled = useChessStore((s) => s.soundEnabled);
  const setSoundEnabled = useChessStore((s) => s.setSoundEnabled);
  const board3dEnabled = useChessStore((s) => s.board3dEnabled);
  const setBoard3dEnabled = useChessStore((s) => s.setBoard3dEnabled);
  const fullscreenEnabled = useChessStore((s) => s.fullscreenEnabled);
  const setFullscreenEnabled = useChessStore((s) => s.setFullscreenEnabled);
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
          <Board3dToggle
            enabled={board3dEnabled}
            onToggle={setBoard3dEnabled}
          />
          <div className='hidden sm:block'>
            <FullscreenToggle
              enabled={fullscreenEnabled}
              onToggle={setFullscreenEnabled}
            />
          </div>
          <AppearanceSelector theme={theme} onThemeChange={setTheme} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
