'use client';

import { ThemeProvider, useTheme } from 'next-themes';
import { Toaster } from 'sonner';
import { useEffect, useRef } from 'react';
import { useSettingsStore } from '@/features/settings/stores/useSettingsStore';
import {
  BoardThemeName,
  DEFAULT_BOARD_THEME
} from '@/features/chess/config/board-themes';
import { COOKIE_CONFIG } from '@/features/chess/config/board';

function ThemeCookieSync() {
  const { theme } = useTheme();

  useEffect(() => {
    if (theme) {
      document.cookie = `theme=${theme};path=/;max-age=${COOKIE_CONFIG.maxAge}`;
    }
  }, [theme]);

  return null;
}

function BoardSchemeSync() {
  const boardThemeName = useSettingsStore((s) => s.boardThemeName);

  useEffect(() => {
    document.documentElement.setAttribute('data-board-scheme', boardThemeName);
  }, [boardThemeName]);

  return null;
}

function StoreInitializer({
  initialBoardTheme
}: {
  initialBoardTheme: BoardThemeName;
}) {
  const initialized = useRef(false);
  if (!initialized.current) {
    useSettingsStore.setState({
      boardThemeName: initialBoardTheme
    });
    initialized.current = true;
  }
  return null;
}

interface ProvidersProps {
  children: React.ReactNode;
  initialBoardTheme?: string;
  initialPlayAs?: string;
}

export function Providers({ children, initialBoardTheme }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='dark'
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <StoreInitializer
        initialBoardTheme={
          (initialBoardTheme as BoardThemeName) || DEFAULT_BOARD_THEME
        }
      />
      <ThemeCookieSync />
      <BoardSchemeSync />
      <Toaster position='bottom-right' richColors duration={2000} />
      {children}
    </ThemeProvider>
  );
}
