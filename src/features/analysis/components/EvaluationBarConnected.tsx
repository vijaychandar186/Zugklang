'use client';

import { useRef, useEffect, useState } from 'react';
import {
  useEngineAnalysis,
  useAnalysisState
} from '@/features/chess/stores/useAnalysisStore';
import { EvaluationBar, type EvaluationBarProps } from './EvaluationBar';
import type { Advantage } from '@/features/analysis/types/core';

type EvaluationBarConnectedProps = Omit<
  EvaluationBarProps,
  'advantage' | 'cp' | 'mate' | 'isActive'
>;

type StableEvaluation = {
  advantage: Advantage;
  cp: number | null;
  mate: number | null;
};

/**
 * Stabilized evaluation bar that doesn't flicker when position changes.
 * Holds onto the last valid evaluation until a new real evaluation arrives,
 * preventing the bar from jumping to 0 during position transitions.
 */
export function EvaluationBarConnected(props: EvaluationBarConnectedProps) {
  const { advantage, cp, mate } = useEngineAnalysis();
  const { isAnalysisOn, currentSearchDepth } = useAnalysisState();

  // Store the last valid (non-reset) evaluation
  const [stableEval, setStableEval] = useState<StableEvaluation>({
    advantage: 'equal',
    cp: null,
    mate: null
  });

  // Track if we've received a real evaluation for the current position
  const hasReceivedEvalRef = useRef(false);

  useEffect(() => {
    // When depth resets to 0, it means position changed - wait for new eval
    if (currentSearchDepth === 0) {
      hasReceivedEvalRef.current = false;
      return;
    }

    // Only update stable eval when we have real data at sufficient depth.
    // Early depths (1-7) produce unstable evaluations that cause flickering.
    // Wait for depth >= 8 before showing the new evaluation.
    const hasRealEval = cp !== null || mate !== null;
    const MIN_STABLE_DEPTH = 8;

    if (hasRealEval && currentSearchDepth >= MIN_STABLE_DEPTH) {
      hasReceivedEvalRef.current = true;
      setStableEval({ advantage, cp, mate });
    }
  }, [advantage, cp, mate, currentSearchDepth]);

  // Reset stable eval when analysis is turned off
  useEffect(() => {
    if (!isAnalysisOn) {
      setStableEval({ advantage: 'equal', cp: null, mate: null });
      hasReceivedEvalRef.current = false;
    }
  }, [isAnalysisOn]);

  return (
    <EvaluationBar
      advantage={stableEval.advantage}
      cp={stableEval.cp}
      mate={stableEval.mate}
      isActive={isAnalysisOn}
      {...props}
    />
  );
}
