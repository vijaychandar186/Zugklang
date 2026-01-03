'use client';

import { useMemo } from 'react';
import {
  useEngineAnalysis,
  useAnalysisState,
  Advantage
} from '@/hooks/stores/useAnalysisStore';

const calcBarPercentage = (
  advantage: Advantage,
  cp: number | null,
  mate: number | null
): number => {
  if (advantage === 'equal') {
    return 50;
  }

  if (mate !== null) {
    return advantage === 'white' ? 100 : 0;
  }

  if (cp === null) {
    return 50;
  }

  const coefficient = 0.2;
  const adjustedCp = advantage === 'white' ? cp : -cp;
  const percentage =
    (1 / (1 + Math.exp(-(adjustedCp / 100) * coefficient))) * 100;

  return Math.min(Math.max(percentage, 2), 98);
};

export function EvaluationBar() {
  const { advantage, cp, mate } = useEngineAnalysis();
  const { isAnalysisOn } = useAnalysisState();

  const barPercentage = useMemo(
    () => calcBarPercentage(advantage, cp, mate),
    [advantage, cp, mate]
  );

  // For vertical bar: white is at bottom, black at top
  const whiteHeight = barPercentage;
  const blackHeight = 100 - barPercentage;

  const displayScore = useMemo(() => {
    if (!isAnalysisOn) return '';
    if (mate !== null) {
      return `M${mate}`;
    }
    if (cp !== null) {
      return (cp / 100).toFixed(1);
    }
    return '0.0';
  }, [isAnalysisOn, cp, mate]);

  if (!isAnalysisOn) {
    return null;
  }

  return (
    <div className='relative flex h-[calc(100vw-2rem)] max-h-[380px] w-7 flex-col overflow-hidden rounded-sm sm:h-[400px] sm:max-h-none lg:h-[560px]'>
      {/* Black's side (top) */}
      <div
        className='relative transition-all duration-300 ease-out'
        style={{
          height: `${blackHeight}%`,
          backgroundColor: 'var(--eval-black)'
        }}
      >
        {advantage === 'black' && (
          <span
            className='absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold'
            style={{ color: 'var(--eval-white)' }}
          >
            {displayScore}
          </span>
        )}
      </div>
      {/* White's side (bottom) */}
      <div
        className='relative transition-all duration-300 ease-out'
        style={{
          height: `${whiteHeight}%`,
          backgroundColor: 'var(--eval-white)'
        }}
      >
        {advantage !== 'black' && (
          <span
            className='absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold'
            style={{ color: 'var(--eval-black)' }}
          >
            {displayScore}
          </span>
        )}
      </div>
    </div>
  );
}
