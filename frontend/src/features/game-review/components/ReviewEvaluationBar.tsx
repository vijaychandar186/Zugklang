'use client';

import { useMemo, useRef, useEffect, useState } from 'react';
import { useCurrentPositionData } from '@/features/game-review/stores/useGameReviewStore';
import {
  useAnalysisState,
  useEngineAnalysis
} from '@/features/chess/stores/useAnalysisStore';
import {
  EvaluationBar,
  getWinPercentage,
  formatEvalLabel,
  type EvaluationBarProps
} from '@/features/analysis/components/EvaluationBar';

type ReviewEvaluationBarProps = Omit<
  EvaluationBarProps,
  'whitePercentage' | 'label' | 'isActive'
>;

type EvalState = {
  cp: number | null;
  mate: number | null;
};

export function ReviewEvaluationBar(props: ReviewEvaluationBarProps) {
  const { evaluation: reviewEvaluation } = useCurrentPositionData();
  const { isAnalysisOn } = useAnalysisState();
  const engineAnalysis = useEngineAnalysis();

  const prevValueRef = useRef<EvalState>({ cp: null, mate: null });
  const [displayValues, setDisplayValues] = useState<EvalState>({
    cp: 0,
    mate: null
  });

  const liveEvaluation = useMemo(() => {
    if (!isAnalysisOn) return null;
    const { cp, mate } = engineAnalysis;
    if (cp === null && mate === null) return null;
    return {
      type: mate !== null ? 'mate' : 'cp',
      value: mate !== null ? mate : (cp ?? 0)
    } as { type: 'cp' | 'mate'; value: number };
  }, [isAnalysisOn, engineAnalysis]);

  const evaluation = liveEvaluation || reviewEvaluation;

  useEffect(() => {
    if (!evaluation) {
      if (
        prevValueRef.current.cp === null &&
        prevValueRef.current.mate === null
      ) {
        setDisplayValues({ cp: 0, mate: null });
      }
      return;
    }

    const newCp = evaluation.type === 'cp' ? evaluation.value : null;
    const newMate = evaluation.type === 'mate' ? evaluation.value : null;

    if (
      prevValueRef.current.cp !== newCp ||
      prevValueRef.current.mate !== newMate
    ) {
      setDisplayValues({ cp: newCp, mate: newMate });
      prevValueRef.current = { cp: newCp, mate: newMate };
    }
  }, [evaluation]);

  const { cp, mate } = displayValues;

  const whitePercentage = useMemo(() => getWinPercentage(cp, mate), [cp, mate]);

  const label = useMemo(() => formatEvalLabel(cp, mate), [cp, mate]);

  return (
    <EvaluationBar
      whitePercentage={whitePercentage}
      label={label}
      isActive={true}
      {...props}
    />
  );
}
