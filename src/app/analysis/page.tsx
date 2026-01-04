'use client';

import { useEffect } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { AnalysisBoard } from '@/components/analysis/AnalysisBoard';
import { EvaluationBar } from '@/components/analysis/EvaluationBar';
import { AnalysisLines } from '@/components/analysis/AnalysisLines';
import { AnalysisSidebar } from '@/components/analysis/AnalysisSidebar';
import { BoardEditor } from '@/components/board/BoardEditor';
import {
  useAnalysisBoardState,
  useAnalysisBoardActions,
  usePositionEditor
} from '@/hooks/stores/useAnalysisBoardStore';
import {
  useAnalysisState,
  useAnalysisActions
} from '@/hooks/stores/useAnalysisStore';

export default function AnalysisPage() {
  const { mode, currentFEN } = useAnalysisBoardState();
  const { setMode } = useAnalysisBoardActions();
  const { editorFEN, setEditorFEN, applyEditorPosition } = usePositionEditor();
  const { isAnalysisOn, isInitialized } = useAnalysisState();
  const { initializeEngine, setPosition, cleanup, startAnalysis } =
    useAnalysisActions();

  // Initialize analysis engine on mount
  useEffect(() => {
    initializeEngine();
    return () => cleanup();
  }, []);

  // Auto-start analysis when initialized and in normal mode
  useEffect(() => {
    if (isInitialized && mode === 'normal') {
      startAnalysis();
    }
  }, [isInitialized, mode, startAnalysis]);

  // Sync position with engine
  useEffect(() => {
    if (!currentFEN) return;
    const fenTurn = currentFEN.split(' ')[1] as 'w' | 'b';
    setPosition(currentFEN, fenTurn);
  }, [currentFEN, setPosition]);

  const handleApplyPosition = () => {
    if (applyEditorPosition()) {
      setMode('normal');
    }
  };

  const handleCancelEditor = () => {
    setMode('normal');
  };

  const isPositionEditorMode = mode === 'position-editor';

  return (
    <PageContainer scrollable={false} className='h-dvh w-full overflow-hidden'>
      <div className='flex h-full w-full flex-col gap-4 overflow-y-auto p-4 lg:flex-row lg:items-center lg:justify-center lg:overflow-hidden lg:p-6'>
        {/* Main Board Area */}
        <div className='flex shrink-0 flex-col items-center gap-4'>
          {/* Board Display */}
          <div className='flex max-w-full items-start justify-center gap-2'>
            {/* Always reserve space for EvaluationBar to prevent layout shift */}
            <div className='w-7 shrink-0'>
              {isAnalysisOn && !isPositionEditorMode && <EvaluationBar />}
            </div>
            <div className='shrink-0'>
              <AnalysisBoard />
            </div>
          </div>
        </div>

        {/* Sidebar Area */}
        <div className='flex h-[400px] w-full max-w-[560px] flex-col gap-2 lg:h-[560px] lg:w-80 lg:shrink-0'>
          {/* Show board editor when in position-editor mode */}
          {isPositionEditorMode ? (
            <div className='bg-card min-h-0 flex-1 overflow-auto rounded-lg border p-3'>
              <BoardEditor
                fen={editorFEN}
                onFenChange={setEditorFEN}
                onApply={handleApplyPosition}
                onCancel={handleCancelEditor}
              />
            </div>
          ) : (
            <>
              {isAnalysisOn && (
                <div className='bg-card shrink-0 rounded-lg border'>
                  <AnalysisLines />
                </div>
              )}
              <div className='min-h-0 flex-1 overflow-hidden rounded-lg border'>
                <AnalysisSidebar />
              </div>
            </>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
