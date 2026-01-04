'use client';

import { useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { AnalysisBoard } from '@/components/analysis/AnalysisBoard';
import { BoardContainer } from '@/components/board/BoardContainer';
import { AnalysisLines } from '@/components/analysis/AnalysisLines';
import { AnalysisSidebar } from '@/components/analysis/AnalysisSidebar';
import { useAnalysisBoardState } from '@/hooks/stores/useAnalysisBoardStore';
import {
  useAnalysisState,
  useAnalysisActions
} from '@/hooks/stores/useAnalysisStore';

export default function AnalysisPage() {
  const { currentFEN } = useAnalysisBoardState();
  const { isAnalysisOn, isInitialized } = useAnalysisState();
  const { initializeEngine, setPosition, cleanup, startAnalysis } =
    useAnalysisActions();

  // Initialize analysis engine on mount
  useEffect(() => {
    initializeEngine();
    return () => cleanup();
  }, []);

  // Auto-start analysis when initialized
  useEffect(() => {
    if (isInitialized) {
      startAnalysis();
    }
  }, [isInitialized, startAnalysis]);

  // Sync position with engine
  useEffect(() => {
    if (!currentFEN) return;
    const fenTurn = currentFEN.split(' ')[1] as 'w' | 'b';
    setPosition(currentFEN, fenTurn);
  }, [currentFEN, setPosition]);

  return (
    <PageContainer scrollable={false} className='h-dvh w-full overflow-hidden'>
      <div className='flex h-full w-full flex-col gap-4 overflow-y-auto p-4 lg:flex-row lg:items-center lg:justify-center lg:overflow-hidden lg:p-6'>
        {/* Main Board Area */}
        <div className='flex shrink-0 flex-col items-center gap-4'>
          <BoardContainer>
            <AnalysisBoard />
          </BoardContainer>
        </div>

        {/* Sidebar Area */}
        <div className='flex h-[400px] w-full max-w-[560px] flex-col gap-2 lg:h-[560px] lg:w-80 lg:shrink-0'>
          {isAnalysisOn && (
            <div className='bg-card shrink-0 rounded-lg border'>
              <AnalysisLines />
            </div>
          )}
          <div className='min-h-0 flex-1 overflow-hidden rounded-lg border'>
            <AnalysisSidebar />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
