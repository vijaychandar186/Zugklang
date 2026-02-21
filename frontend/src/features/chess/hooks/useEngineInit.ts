'use client';

import { useEffect } from 'react';
import { useAnalysisActions } from '../stores/useAnalysisStore';

export function useEngineInit() {
  const { initializeEngine, cleanup } = useAnalysisActions();

  useEffect(() => {
    initializeEngine();
    return () => cleanup();
  }, [initializeEngine, cleanup]);
}
