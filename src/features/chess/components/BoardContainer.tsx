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
    <div
      className={`flex items-start justify-center gap-0 sm:gap-2 ${className ?? ''}`}
    >
      {/* Desktop: always reserve space. Mobile: only show when analysis is on */}
      <div
        className={`shrink-0 ${shouldShowEval ? 'w-7' : 'hidden w-0 sm:block sm:w-7'}`}
      >
        {shouldShowEval && <EvaluationBar />}
      </div>
      <div className='shrink-0' data-board-container>
        {children}
      </div>
    </div>
  );
}
