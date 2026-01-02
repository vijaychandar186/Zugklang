'use client';

import { ThemeProvider, useTheme } from 'next-themes';
import { Toaster } from 'sonner';
import { useEffect } from 'react';
import { useGameStore } from '@/hooks/stores/useGameStore';

function ThemeCookieSync() {
  const { theme } = useTheme();

  useEffect(() => {
    if (theme) {
      document.cookie = `theme=${theme};path=/;max-age=31536000`;
    }
  }, [theme]);

  return null;
}

function BoardSchemeSync() {
  const boardThemeName = useGameStore((s) => s.boardThemeName);

  useEffect(() => {
    // Sync data attribute for SSR on next page load
    document.documentElement.setAttribute('data-board-scheme', boardThemeName);
  }, [boardThemeName]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='dark'
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <ThemeCookieSync />
      <BoardSchemeSync />
      <Toaster position='top-center' richColors />
      {children}
    </ThemeProvider>
  );
}
