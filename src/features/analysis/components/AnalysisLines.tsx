'use client';

import { Chess } from 'chess.js';
import {
  useEngineAnalysis,
  useAnalysisState,
  useAnalysisPosition,
  useAnalysisConfig
} from '@/features/chess/stores/useAnalysisStore';
import { AnalysisSettings } from '@/features/analysis/components/AnalysisSettings';
import { Skeleton } from '@/components/ui/skeleton';

function uciMovesToSan(fen: string, uciMoves: string[]): string[] {
  if (!fen || !uciMoves || uciMoves.length === 0) return [];

  const formattedMoves: string[] = [];
  const position = new Chess(fen);

  for (const uciMove of uciMoves) {
    const from = uciMove.substring(0, 2);
    const to = uciMove.substring(2, 4);
    const promotion = uciMove.length > 4 ? uciMove.substring(4, 5) : undefined;

    try {
      const move = position.move({ from, to, promotion });
      if (!move) break;
      formattedMoves.push(move.san);
    } catch {
      break;
    }
  }

  return formattedMoves;
}

export function AnalysisLines() {
  const { uciLines, lineEvaluations } = useEngineAnalysis();
  const { isAnalysisOn, isAnalyzing, currentSearchDepth } = useAnalysisState();
  const { currentFen } = useAnalysisPosition();
  const { multiPV } = useAnalysisConfig();

  const hasLines = uciLines.some((line) => line && line.length > 0);

  if (!isAnalysisOn) return null;

  return (
    <div className='flex flex-col'>
      <div className='flex items-center justify-between border-b px-3 py-2'>
        <span className='text-sm font-semibold'>Analysis</span>
        <div className='flex items-center gap-2'>
          <span className='text-muted-foreground text-xs'>
            {isAnalyzing ? `Depth ${currentSearchDepth}` : 'Ready'}
          </span>
          <AnalysisSettings />
        </div>
      </div>
      <div className='space-y-1 px-3 py-2'>
        {hasLines
          ? uciLines.map((line, idx) => {
              if (!line || line.length === 0) return null;
              const eval_ = lineEvaluations[idx];
              const sanMoves = uciMovesToSan(currentFen, line);

              const evalBgClass =
                eval_.advantage === 'equal'
                  ? 'bg-muted'
                  : eval_.advantage === 'white'
                    ? 'bg-[var(--eval-white)] text-[var(--eval-black)]'
                    : 'bg-[var(--eval-black)] text-[var(--eval-white)]';

              return (
                <div key={idx} className='flex items-center gap-2 text-xs'>
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${evalBgClass}`}
                  >
                    {eval_.formattedEvaluation}
                  </span>
                  <span className='text-muted-foreground truncate'>
                    {sanMoves.slice(0, 8).join(' ')}
                    {sanMoves.length > 8 && '...'}
                  </span>
                </div>
              );
            })
          : isAnalyzing
            ? Array.from({ length: multiPV }).map((_, idx) => (
                <div key={idx} className='flex items-center gap-2'>
                  <Skeleton className='h-4 w-10 shrink-0' />
                  <Skeleton className='h-4 w-full' />
                </div>
              ))
            : null}
      </div>
    </div>
  );
}
