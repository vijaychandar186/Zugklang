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
      className={`flex w-full items-stretch justify-center gap-1 sm:gap-2 ${className ?? ''}`}
    >
      {/* Evaluation bar: shown on all screen sizes when analysis is on */}
      {/* On mobile use smaller width (w-5) to leave room for the board */}
      <div
        className={`shrink-0 ${shouldShowEval ? 'w-5 sm:w-7' : 'hidden w-0 sm:block sm:w-7'}`}
      >
        {shouldShowEval && <EvaluationBar />}
      </div>
      {/* Board container - shrinks slightly on mobile when eval bar is visible */}
      <div
        className={`shrink-0 ${shouldShowEval ? 'flex-1 sm:w-[400px] sm:flex-none lg:w-[560px]' : 'w-full sm:w-[400px] lg:w-[560px]'}`}
        data-board-container
      >
        {children}
      </div>
    </div>
  );
}
