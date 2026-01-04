'use client';

import {
  useEngineAnalysis,
  useAnalysisState
} from '@/hooks/stores/useAnalysisStore';
import { EvaluationBar, type EvaluationBarProps } from './EvaluationBar';

type EvaluationBarConnectedProps = Omit<
  EvaluationBarProps,
  'advantage' | 'cp' | 'mate' | 'isActive'
>;

/**
 * A connected evaluation bar that automatically pulls data from the analysis store.
 * This component handles the connection to the Stockfish analysis engine.
 */
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
