'use client';
import { useTheme } from 'next-themes';
import { useScheme } from '@/components/layout/Providers';
import { useChessStore } from '@/features/chess/stores/useChessStore';
import { BoardThemeName } from '@/features/chess/types/theme';
import {
  PieceThemeName,
  SoundThemeName
} from '@/features/chess/config/media-themes';
import { BoardThemeSelector } from './ThemeSelector';
import { AppearanceSelector } from './AppearanceSelector';
import { SoundToggle } from './SoundToggle';
import { Board3dToggle } from './Board3dToggle';
import { FullscreenToggle } from './FullscreenToggle';
import { SchemeSelector } from './SchemeSelector';
import { PieceThemeSelector } from './PieceThemeSelector';
import { SoundThemeSelector } from './SoundThemeSelector';
type SettingsContentProps = {
  show3dToggle?: boolean;
  hideFullscreenOnMobile?: boolean;
  showThemeAssetSelectors?: boolean;
  showExtendedBoardThemes?: boolean;
};
export function SettingsContent({
  show3dToggle = true,
  hideFullscreenOnMobile = false,
  showThemeAssetSelectors = false,
  showExtendedBoardThemes = false
}: SettingsContentProps) {
  const setBoardTheme = useChessStore((s) => s.setBoardTheme);
  const currentBoardTheme = useChessStore((s) => s.boardThemeName);
  const currentPieceTheme = useChessStore((s) => s.pieceThemeName);
  const currentSoundTheme = useChessStore((s) => s.soundThemeName);
  const setPieceTheme = useChessStore((s) => s.setPieceTheme);
  const setSoundTheme = useChessStore((s) => s.setSoundTheme);
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
  const handlePieceThemeChange = (themeName: PieceThemeName) => {
    setPieceTheme(themeName);
  };
  const handleSoundThemeChange = (themeName: SoundThemeName) => {
    setSoundTheme(themeName);
  };
  return (
    <div className='space-y-6'>
      <BoardThemeSelector
        currentTheme={currentBoardTheme}
        onThemeChange={handleBoardThemeChange}
        showExtendedThemes={showExtendedBoardThemes}
      />
      {showThemeAssetSelectors && (
        <PieceThemeSelector
          currentTheme={currentPieceTheme}
          onThemeChange={handlePieceThemeChange}
        />
      )}
      {showThemeAssetSelectors && (
        <SoundThemeSelector
          currentTheme={currentSoundTheme}
          onThemeChange={handleSoundThemeChange}
        />
      )}
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
