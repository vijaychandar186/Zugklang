'use client';
import { useEffect } from 'react';
import { useAnalysisActions } from '../stores/useAnalysisStore';
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
