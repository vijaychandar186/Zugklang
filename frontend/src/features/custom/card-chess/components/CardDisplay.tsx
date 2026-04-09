'use client';
import { useMemo } from 'react';
import * as deck from '@letele/playing-cards';
import { cn } from '@/lib/utils';
import type { PlayingCard } from '../stores/useCardChessStore';
interface CardDisplayProps {
  card: PlayingCard | null;
  size?: number;
  disabled?: boolean;
  className?: string;
  isDrawing?: boolean;
}
function getCardComponentName(card: PlayingCard): string {
  const rankMap: Record<string, string> = {
    A: 'a',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    '10': '10',
    J: 'j',
    Q: 'q',
    K: 'k'
  };
  const rank = rankMap[card.rank];
  return `${card.suit}${rank}`;
}
export function CardDisplay({
  card,
  size = 120,
  disabled = false,
  className,
  isDrawing = false
}: CardDisplayProps) {
  const CardComponent = useMemo(() => {
    if (!card || isDrawing) {
      return deck['B1'] as React.ComponentType<{
        style?: React.CSSProperties;
      }>;
    }
    const componentName = getCardComponentName(card);
    const component = deck[componentName as keyof typeof deck];
    if (!component) {
      console.warn(`Card component not found: ${componentName}`);
      return deck['B1'] as React.ComponentType<{
        style?: React.CSSProperties;
      }>;
    }
    return component as React.ComponentType<{
      style?: React.CSSProperties;
    }>;
  }, [card, isDrawing]);
  return (
    <div
      className={cn(
        'inline-block transition-all duration-300',
        disabled && 'opacity-40 grayscale',
        isDrawing && 'animate-pulse',
        className
      )}
      style={{
        width: size,
        height: size * 1.4,
        position: 'relative'
      }}
    >
      <div
        className={cn(
          'overflow-hidden rounded-lg shadow-lg',
          'transition-transform duration-200',
          !disabled && !isDrawing && 'hover:scale-105'
        )}
        style={{ width: '100%', height: '100%' }}
      >
        <CardComponent style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
}
