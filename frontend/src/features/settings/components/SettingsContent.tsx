'use client';

import { useTheme } from 'next-themes';
import { useScheme } from '@/components/layout/Providers';
import { useChessStore } from '@/features/chess/stores/useChessStore';
import { BoardThemeName } from '@/features/chess/types/theme';
import { BoardThemeSelector } from './ThemeSelector';
import { AppearanceSelector } from './AppearanceSelector';
import { SoundToggle } from './SoundToggle';
import { Board3dToggle } from './Board3dToggle';
import { FullscreenToggle } from './FullscreenToggle';
import { SchemeSelector } from './SchemeSelector';

type SettingsContentProps = {
  show3dToggle?: boolean;
  hideFullscreenOnMobile?: boolean;
};

export function SettingsContent({
  show3dToggle = true,
  hideFullscreenOnMobile = false
}: SettingsContentProps) {
  const setBoardTheme = useChessStore((s) => s.setBoardTheme);
  const currentBoardTheme = useChessStore((s) => s.boardThemeName);
  const soundEnabled = useChessStore((s) => s.soundEnabled);
  const setSoundEnabled = useChessStore((s) => s.setSoundEnabled);
  const board3dEnabled = useChessStore((s) => s.board3dEnabled);
  const setBoard3dEnabled = useChessStore((s) => s.setBoard3dEnabled);
  const fullscreenEnabled = useChessStore((s) => s.fullscreenEnabled);
  const setFullscreenEnabled = useChessStore((s) => s.setFullscreenEnabled);
  const { scheme, setScheme } = useScheme();
  const { theme, setTheme } = useTheme();

  const handleBoardThemeChange = (themeName: BoardThemeName) => {
    setBoardTheme(themeName);
  };

  return (
    <div className='space-y-6'>
      <BoardThemeSelector
        currentTheme={currentBoardTheme}
        onThemeChange={handleBoardThemeChange}
      />
      <SchemeSelector currentScheme={scheme} onSchemeChange={setScheme} />
      <SoundToggle enabled={soundEnabled} onToggle={setSoundEnabled} />
      {show3dToggle && (
        <Board3dToggle enabled={board3dEnabled} onToggle={setBoard3dEnabled} />
      )}
      <div className={hideFullscreenOnMobile ? 'hidden sm:block' : ''}>
        <FullscreenToggle
          enabled={fullscreenEnabled}
          onToggle={setFullscreenEnabled}
        />
      </div>
      <AppearanceSelector theme={theme} onThemeChange={setTheme} />
    </div>
  );
}
