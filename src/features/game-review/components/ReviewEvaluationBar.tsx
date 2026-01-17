'use client';

import { useMemo, useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useCurrentPositionData } from '@/features/game-review/stores/useGameReviewStore';
import { EVALUATION_CONFIG } from '@/features/analysis/config/defaults';
import type { Advantage } from '@/features/analysis/types/core';

// Helper to calculate bar percentage - follows the logic from the original implementation
function calcBarPercentage(
  cp: number | null,
  mate: number | null,
  isMateScore: boolean
): number {
  // Handle mate scores
  if (isMateScore && mate !== null) {
    if (mate === 0) {
      // Checkmate - fully one color
      return 50;
    }
    // Mate in X moves - show near the edge
    return mate > 0 ? EVALUATION_CONFIG.mateAdvantageWhite : EVALUATION_CONFIG.mateAdvantageBlack;
  }

  // Handle centipawn scores
  if (cp === null) {
    return EVALUATION_CONFIG.equalPosition;
  }

  // Original implementation: height = clamp(360 - evaluation.value / 3, 40, 680) / 720
  // This translates to: percentage = 100 - clamp(50 - cp/3 * 100/720, 5.5, 94.4)
  // Simplified: use sigmoid for smooth transitions
  const percentage =
    (1 /
      (1 +
        Math.exp(
          -(cp / EVALUATION_CONFIG.centipawnDivisor) *
            EVALUATION_CONFIG.sigmoidCoefficient
        ))) *
    100;

  return Math.min(
    Math.max(percentage, EVALUATION_CONFIG.clampMin),
    EVALUATION_CONFIG.clampMax
  );
}

function formatScore(cp: number | null, mate: number | null): string {
  if (mate !== null) {
    return `M${Math.abs(mate)}`;
  }
  if (cp !== null) {
    return (Math.abs(cp) / 100).toFixed(1);
  }
  return '0.0';
}

type ReviewEvaluationBarProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

export function ReviewEvaluationBar({
  className,
  size = 'lg'
}: ReviewEvaluationBarProps) {
  const { evaluation } = useCurrentPositionData();
  
  // Use refs to track previous values for smooth transitions
  const prevValueRef = useRef<{ cp: number | null; mate: number | null }>({ cp: null, mate: null });
  const [displayValues, setDisplayValues] = useState<{ cp: number | null; mate: number | null }>({ cp: null, mate: null });

  // Update display values when evaluation changes (debounced to avoid jumping)
  useEffect(() => {
    if (!evaluation) {
      setDisplayValues({ cp: 0, mate: null });
      prevValueRef.current = { cp: 0, mate: null };
      return;
    }

    const newCp = evaluation.type === 'cp' ? evaluation.value : null;
    const newMate = evaluation.type === 'mate' ? evaluation.value : null;

    // Only update if there's an actual change
    if (prevValueRef.current.cp !== newCp || prevValueRef.current.mate !== newMate) {
      setDisplayValues({ cp: newCp, mate: newMate });
      prevValueRef.current = { cp: newCp, mate: newMate };
    }
  }, [evaluation]);

  const { cp, mate } = displayValues;
  const isMateScore = mate !== null;
  
  const barPercentage = useMemo(
    () => calcBarPercentage(cp, mate, isMateScore),
    [cp, mate, isMateScore]
  );

  const whiteHeight = barPercentage;
  const blackHeight = 100 - barPercentage;
  const displayScore = formatScore(cp, mate);
  
  const advantage: Advantage = useMemo(() => {
    if (isMateScore) {
      return mate! > 0 ? 'white' : 'black';
    }
    if (cp === null || cp === 0) return 'equal';
    return cp > 0 ? 'white' : 'black';
  }, [cp, mate, isMateScore]);

  const sizeClasses = {
    sm: 'h-[200px] w-5',
    md: 'h-[400px] w-6',
    lg: 'h-[calc(100vw-5rem)] max-h-[380px] w-7 sm:h-[400px] sm:max-h-none lg:h-[560px]'
  };

  return (
    <div
      className={cn(
        'relative flex flex-col overflow-hidden rounded-sm',
        sizeClasses[size],
        className
      )}
    >
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
