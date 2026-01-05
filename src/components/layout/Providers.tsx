'use client';

import { ThemeProvider, useTheme } from 'next-themes';
import { Toaster } from 'sonner';
import { useEffect, useRef } from 'react';
import { useChessStore } from '@/features/chess/stores/useChessStore';
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
  const boardThemeName = useChessStore((s) => s.boardThemeName);

  useEffect(() => {
    document.documentElement.setAttribute('data-board-scheme', boardThemeName);
  }, [boardThemeName]);

  return null;
}

function StoreInitializer({
  initialBoardTheme,
  initialPlayAs
}: {
  initialBoardTheme: BoardThemeName;
  initialPlayAs: 'white' | 'black' | undefined;
}) {
  const initialized = useRef(false);
  if (!initialized.current) {
    useChessStore.setState({
      boardThemeName: initialBoardTheme,
      ...(initialPlayAs && { playAs: initialPlayAs })
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

export function Providers({
  children,
  initialBoardTheme,
  initialPlayAs
}: ProvidersProps) {
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
        initialPlayAs={
          initialPlayAs === 'white' || initialPlayAs === 'black'
            ? initialPlayAs
            : undefined
        }
      />
      <ThemeCookieSync />
      <BoardSchemeSync />
      <Toaster position='top-center' richColors />
      {children}
    </ThemeProvider>
  );
}
