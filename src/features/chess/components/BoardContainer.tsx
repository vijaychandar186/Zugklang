'use client';

import { ReactNode } from 'react';
import { EvaluationBarConnected as EvaluationBar } from '@/features/analysis/components/EvaluationBarConnected';
import { useAnalysisState } from '@/features/chess/stores/useAnalysisStore';

type BoardContainerProps = {
  children: ReactNode;
  showEvaluation?: boolean;
  className?: string;
};

export function BoardContainer({
  children,
  showEvaluation = true,
  className
}: BoardContainerProps) {
  const { isAnalysisOn } = useAnalysisState();

  const shouldShowEval = showEvaluation && isAnalysisOn;

  return (
    <div className={`flex items-start justify-center gap-2 ${className ?? ''}`}>
      <div className='w-7 shrink-0'>{shouldShowEval && <EvaluationBar />}</div>
      <div className='shrink-0'>{children}</div>
    </div>
  );
}
