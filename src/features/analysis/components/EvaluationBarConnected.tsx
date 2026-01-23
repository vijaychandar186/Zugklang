'use client';

import { useEffect, useState, useRef } from 'react';
import {
  useEngineAnalysis,
  useAnalysisState,
  useAnalysisPosition
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

const MIN_STABLE_DEPTH = 8;

const MAX_PERCENTAGE_JUMP = 30;

export function EvaluationBarConnected(props: EvaluationBarConnectedProps) {
  const { cp: rawCp, mate: rawMate, advantage } = useEngineAnalysis();
  const { isAnalysisOn, currentSearchDepth } = useAnalysisState();
  const { currentFen } = useAnalysisPosition();

  const lastStableEval = useRef<EvalBarState>({
    whitePercentage: 50,
    label: '0.0'
  });

  const hasStableEvalForPosition = useRef(false);
  const lastFen = useRef<string | null>(null);

  const [evalBar, setEvalBar] = useState<EvalBarState>({
    whitePercentage: 50,
    label: '0.0'
  });

  useEffect(() => {
    if (currentFen !== lastFen.current) {
      lastFen.current = currentFen;
      hasStableEvalForPosition.current = false;
    }
  }, [currentFen]);

  useEffect(() => {
    if (currentSearchDepth < MIN_STABLE_DEPTH) {
      return;
    }

    const hasRealEval = rawCp !== null || rawMate !== null;
    if (!hasRealEval) {
      return;
    }

    let cp = rawCp;
    let mate = rawMate;

    if (mate !== null) {
      const mateValue = Math.max(mate, 1);
      mate = advantage === 'black' ? -mateValue : mateValue;
      cp = null;
    } else if (cp !== null && advantage === 'black') {
      cp = -cp;
    }

    let newWhitePercentage = getWinPercentage(cp, mate);
    const newLabel = formatEvalLabel(cp, mate);

    if (hasStableEvalForPosition.current) {
      const currentPercentage = lastStableEval.current.whitePercentage;
      const diff = newWhitePercentage - currentPercentage;

      if (Math.abs(diff) > MAX_PERCENTAGE_JUMP) {
        newWhitePercentage =
          currentPercentage +
          (diff > 0 ? MAX_PERCENTAGE_JUMP : -MAX_PERCENTAGE_JUMP);
      }
    }

    hasStableEvalForPosition.current = true;

    lastStableEval.current = {
      whitePercentage: newWhitePercentage,
      label: newLabel
    };

    setEvalBar({ whitePercentage: newWhitePercentage, label: newLabel });
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
