'use client';

import { useRef } from 'react';
import { useChessStore } from '@/features/chess/stores/useChessStore';
import { type BoardThemeName } from '@/features/chess/config/board-themes';

interface ChessStoreInitializerProps {
  initialBoardTheme: BoardThemeName;
  initialPlayAs: 'white' | 'black' | undefined;
}

export function ChessStoreInitializer({
  initialBoardTheme,
  initialPlayAs
}: ChessStoreInitializerProps) {
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
