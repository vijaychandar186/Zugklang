'use client';

import { useState, useEffect, useMemo } from 'react';
import { useChessStore } from '../stores/useChessStore';
import { useBoardTheme } from './useSquareInteraction';

export interface UseBoardMountingOptions {
  initialBoard3dEnabled?: boolean;
}

export interface UseBoardMountingReturn {
  isMounted: boolean;
  shouldShow3d: boolean;
  theme: {
    darkSquareStyle: { backgroundColor: string };
    lightSquareStyle: { backgroundColor: string };
  };
}

export function useBoardMounting({
  initialBoard3dEnabled
}: UseBoardMountingOptions = {}): UseBoardMountingReturn {
  const [isMounted, setIsMounted] = useState(false);
  const board3dEnabled = useChessStore((s) => s.board3dEnabled);
  const theme = useBoardTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const shouldShow3d = useMemo(
    () => (isMounted ? board3dEnabled : (initialBoard3dEnabled ?? false)),
    [isMounted, board3dEnabled, initialBoard3dEnabled]
  );

  return {
    isMounted,
    shouldShow3d,
    theme
  };
}
