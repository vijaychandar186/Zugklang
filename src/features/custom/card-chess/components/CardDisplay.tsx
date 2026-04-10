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

// Map our card representation to the library's component names
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
    '10': '0', // Library uses '0' for 10
    J: 'j',
    Q: 'q',
    K: 'k'
  };

  const rank = rankMap[card.rank];

  // Component name format: first letter is suit (uppercase), second is rank (lowercase)
  // E.g., "Ha" for Ace of Hearts, "S0" for 10 of Spades
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
      // Show card back when drawing or no card
      return deck['B1'] as React.ComponentType<{ style?: React.CSSProperties }>;
    }

    const componentName = getCardComponentName(card);
    const component = deck[componentName as keyof typeof deck];

    if (!component) {
      console.warn(`Card component not found: ${componentName}`);
      return deck['B1'] as React.ComponentType<{ style?: React.CSSProperties }>;
    }

    return component as React.ComponentType<{ style?: React.CSSProperties }>;
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
        height: size * 1.4, // Standard playing card ratio (5:7)
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
