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
      <div
        className={`shrink-0 ${shouldShowEval ? 'w-5 sm:w-7' : 'hidden w-0 sm:block sm:w-7'}`}
      >
        {shouldShowEval && <EvaluationBar />}
      </div>
      <div
        className={`shrink-0 ${shouldShowEval ? 'flex-1 sm:w-[min(92vw,420px)] sm:flex-none lg:w-[min(70vw,calc(100dvh-180px),820px)] xl:w-[min(68vw,calc(100dvh-180px),920px)] 2xl:w-[min(66vw,calc(100dvh-180px),1020px)]' : 'w-full sm:w-[min(92vw,420px)] lg:w-[min(70vw,calc(100dvh-180px),820px)] xl:w-[min(68vw,calc(100dvh-180px),920px)] 2xl:w-[min(66vw,calc(100dvh-180px),1020px)]'}`}
        data-board-container
      >
        {children}
      </div>
    </div>
  );
}
