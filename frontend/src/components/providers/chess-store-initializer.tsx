'use client';
import { useEffect, useRef } from 'react';
import { useChessStore } from '@/features/chess/stores/useChessStore';
import { type BoardThemeName } from '@/features/chess/config/board-themes';
import { normalizePieceThemeName } from '@/features/chess/config/media-themes';
interface ChessStoreInitializerProps {
  initialBoardTheme: BoardThemeName;
  initialPlayAs: 'white' | 'black' | undefined;
  initialPieceTheme?: string;
}
export function ChessStoreInitializer({
  initialBoardTheme,
  initialPlayAs,
  initialPieceTheme
}: ChessStoreInitializerProps) {
  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current) return;
    useChessStore.setState({
      boardThemeName: initialBoardTheme,
      ...(initialPieceTheme && {
        pieceThemeName: normalizePieceThemeName(initialPieceTheme)
      }),
      ...(initialPlayAs && { playAs: initialPlayAs })
    });
    initialized.current = true;
  }, [initialBoardTheme, initialPieceTheme, initialPlayAs]);
  return null;
}
