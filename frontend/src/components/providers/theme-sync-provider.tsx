'use client';
import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useChessStore } from '@/features/chess/stores/useChessStore';
import { COOKIE_CONFIG } from '@/features/chess/config/board';
export function ThemeCookieSyncProvider() {
  const { theme } = useTheme();
  useEffect(() => {
    if (theme) {
      document.cookie = `theme=${theme};path=/;max-age=${COOKIE_CONFIG.maxAge}`;
    }
  }, [theme]);
  return null;
}
export function BoardSchemeSyncProvider() {
  const boardThemeName = useChessStore((s) => s.boardThemeName);
  useEffect(() => {
    document.documentElement.setAttribute('data-board-scheme', boardThemeName);
  }, [boardThemeName]);
  return null;
}
