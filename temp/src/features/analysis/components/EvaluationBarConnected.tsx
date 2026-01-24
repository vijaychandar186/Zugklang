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

// Require higher depth for stability - low depth evaluations are unreliable
const MIN_STABLE_DEPTH = 8;

// Maximum percentage change allowed per update to prevent wild swings
const MAX_PERCENTAGE_JUMP = 30;

export function EvaluationBarConnected(props: EvaluationBarConnectedProps) {
  const { cp: rawCp, mate: rawMate, advantage } = useEngineAnalysis();
  const { isAnalysisOn, currentSearchDepth } = useAnalysisState();
  const { currentFen } = useAnalysisPosition();

  // Track the last stable evaluation to prevent resets
  const lastStableEval = useRef<EvalBarState>({
    whitePercentage: 50,
    label: '0.0'
  });

  // Track if we've received at least one stable eval for this position
  const hasStableEvalForPosition = useRef(false);
  const lastFen = useRef<string | null>(null);

  // Keep the last valid evaluation - never reset
  const [evalBar, setEvalBar] = useState<EvalBarState>({
    whitePercentage: 50,
    label: '0.0'
  });

  // Reset stability tracking when position changes
  useEffect(() => {
    if (currentFen !== lastFen.current) {
      lastFen.current = currentFen;
      hasStableEvalForPosition.current = false;
      // Don't reset evalBar - keep showing the last known value
    }
  }, [currentFen]);

  useEffect(() => {
    // Don't update if depth is too low - wait for more stable evaluation
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

    let newWhitePercentage = getWinPercentage(cp, mate);
    const newLabel = formatEvalLabel(cp, mate);

    // If this is NOT the first stable eval for this position,
    // clamp the change to prevent wild swings
    if (hasStableEvalForPosition.current) {
      const currentPercentage = lastStableEval.current.whitePercentage;
      const diff = newWhitePercentage - currentPercentage;

      // If the jump is too large (e.g., going from white winning to black winning),
      // clamp it to a smoother transition
      if (Math.abs(diff) > MAX_PERCENTAGE_JUMP) {
        newWhitePercentage =
          currentPercentage +
          (diff > 0 ? MAX_PERCENTAGE_JUMP : -MAX_PERCENTAGE_JUMP);
      }
    }

    // Mark that we have a stable eval for this position
    hasStableEvalForPosition.current = true;

    // Store as last stable eval
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
