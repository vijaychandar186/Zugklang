'use client';

import {
  useEngineAnalysis,
  useAnalysisState
} from '@/features/chess/stores/useAnalysisStore';
import { EvaluationBar, type EvaluationBarProps } from './EvaluationBar';

type EvaluationBarConnectedProps = Omit<
  EvaluationBarProps,
  'advantage' | 'cp' | 'mate' | 'isActive'
>;

export function EvaluationBarConnected(props: EvaluationBarConnectedProps) {
  const { advantage, cp, mate } = useEngineAnalysis();
  const { isAnalysisOn } = useAnalysisState();

  return (
    <EvaluationBar
      advantage={advantage}
      cp={cp}
      mate={mate}
      isActive={isAnalysisOn}
      {...props}
    />
  );
}
