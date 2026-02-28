'use client';
import { useEffect } from 'react';
import { useAnalysisActions } from '../stores/useAnalysisStore';

/**
 * Initialises the analysis engine on mount, syncs the current FEN position,
 * and cleans up on unmount.
 *
 * Replaces the two boilerplate `useEffect` blocks that every game-view used
 * to inline for analysis support.
 */
export function useAnalysisSync(currentFEN: string) {
  const { initializeEngine, setPosition, cleanup } = useAnalysisActions();

  useEffect(() => {
    initializeEngine();
    return () => cleanup();
  }, [initializeEngine, cleanup]);

  useEffect(() => {
    if (!currentFEN) return;
    const turn = currentFEN.split(' ')[1] as 'w' | 'b';
    setPosition(currentFEN, turn);
  }, [currentFEN, setPosition]);
}
