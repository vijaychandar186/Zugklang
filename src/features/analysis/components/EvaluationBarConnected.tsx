'use client';

import { useEffect, useState } from 'react';
import {
  useEngineAnalysis,
  useAnalysisState
} from '@/features/chess/stores/useAnalysisStore';
import {
  EvaluationBar,
  getWinPercentage,
  formatEvalLabel,
  type EvaluationBarProps
} from './EvaluationBar';

type EvaluationBarConnectedProps = Omit<
  EvaluationBarProps,
  'whitePercentage' | 'label' | 'isActive'
>;

type EvalBarState = {
  whitePercentage: number;
  label: string;
};

const MIN_STABLE_DEPTH = 6;

export function EvaluationBarConnected(props: EvaluationBarConnectedProps) {
  const { cp: rawCp, mate: rawMate, advantage } = useEngineAnalysis();
  const { isAnalysisOn, currentSearchDepth } = useAnalysisState();

  // Keep the last valid evaluation - never reset
  const [evalBar, setEvalBar] = useState<EvalBarState>({
    whitePercentage: 50,
    label: '0.0'
  });

  useEffect(() => {
    // Don't update if depth is too low
    if (currentSearchDepth < MIN_STABLE_DEPTH) {
      return;
    }

    const hasRealEval = rawCp !== null || rawMate !== null;
    if (!hasRealEval) {
      return;
    }

    // Convert unsigned cp/mate to signed (positive = white better, negative = black better)
    let cp = rawCp;
    let mate = rawMate;

    if (mate !== null) {
      // Ensure non-zero mate value and apply correct sign
      const mateValue = Math.max(mate, 1);
      mate = advantage === 'black' ? -mateValue : mateValue;
      cp = null;
    } else if (cp !== null && advantage === 'black') {
      cp = -cp;
    }

    const whitePercentage = getWinPercentage(cp, mate);
    const label = formatEvalLabel(cp, mate);

    setEvalBar({ whitePercentage, label });
  }, [rawCp, rawMate, advantage, currentSearchDepth]);

  return (
    <EvaluationBar
      whitePercentage={evalBar.whitePercentage}
      label={evalBar.label}
      isActive={isAnalysisOn}
      {...props}
    />
  );
}
