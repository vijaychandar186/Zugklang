'use client';

import { ReactNode } from 'react';
import { EvaluationBarConnected as EvaluationBar } from './EvaluationBarConnected';
import { useAnalysisState } from '@/hooks/stores/useAnalysisStore';

type BoardContainerProps = {
  children: ReactNode;
  showEvaluation?: boolean;
  className?: string;
};

/**
 * A shared container component that provides consistent layout for the chess board
 * with optional evaluation bar. This ensures the board doesn't shift when the
 * evaluation bar is toggled on/off.
 *
 * The evaluation bar space is always reserved (w-7) to prevent layout shift.
 */
export function BoardContainer({
  children,
  showEvaluation = true,
  className
}: BoardContainerProps) {
  const { isAnalysisOn } = useAnalysisState();

  // Only show eval bar when analysis is enabled and showEvaluation prop is true
  const shouldShowEval = showEvaluation && isAnalysisOn;

  return (
    <div className={`flex items-start justify-center gap-2 ${className ?? ''}`}>
      {/* Always reserve space for evaluation bar to prevent layout shift */}
      <div className='w-7 shrink-0'>{shouldShowEval && <EvaluationBar />}</div>
      <div className='shrink-0'>{children}</div>
    </div>
  );
}
