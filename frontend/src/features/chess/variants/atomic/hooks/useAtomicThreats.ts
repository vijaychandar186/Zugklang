'use client';
import { useMemo } from 'react';
import type { Chess, ChessJSColor } from '@/lib/chess/chess';
import type { ChessVariant } from '@/features/chess/config/variants';
import {
  computePassiveThreats,
  computeExplosionZone
} from '../utils/atomicThreats';
export type AtomicOverlay = {
  square: string;
  type: 'impact' | 'threat';
  left: string;
  top: string;
};
function squareToCoords(
  square: string,
  boardFlipped: boolean
): {
  x: number;
  y: number;
} {
  const file = square.charCodeAt(0) - 97;
  const rank = parseInt(square[1]) - 1;
  const x = boardFlipped ? 7 - file : file;
  const y = boardFlipped ? rank : 7 - rank;
  return { x, y };
}
export function useAtomicThreats({
  game,
  variant,
  playerColor,
  boardFlipped,
  selectedSquare,
  captureTargets,
  currentFEN
}: {
  game: Chess;
  variant: ChessVariant;
  playerColor: ChessJSColor;
  boardFlipped: boolean;
  selectedSquare: string | null;
  captureTargets: string[];
  currentFEN: string;
}): AtomicOverlay[] {
  return useMemo(() => {
    if (variant !== 'atomic') return [];
    const overlays: AtomicOverlay[] = [];
    const usedSquares = new Set<string>();
    if (selectedSquare && captureTargets.length > 0) {
      for (const target of captureTargets) {
        const zone = computeExplosionZone(game, target);
        const { x: tx, y: ty } = squareToCoords(zone.target, boardFlipped);
        overlays.push({
          square: zone.target,
          type: 'threat',
          left: `${tx * 12.5 + 9}%`,
          top: `${ty * 12.5 - 1.5}%`
        });
        usedSquares.add(zone.target);
        for (const sq of zone.collateral) {
          if (!usedSquares.has(sq)) {
            const { x, y } = squareToCoords(sq, boardFlipped);
            overlays.push({
              square: sq,
              type: 'impact',
              left: `${x * 12.5 + 9}%`,
              top: `${y * 12.5 - 1.5}%`
            });
            usedSquares.add(sq);
          }
        }
      }
    } else {
      const threats = computePassiveThreats(game, playerColor);
      for (const sq of threats.impact) {
        const { x, y } = squareToCoords(sq, boardFlipped);
        overlays.push({
          square: sq,
          type: 'threat',
          left: `${x * 12.5 + 9}%`,
          top: `${y * 12.5 - 1.5}%`
        });
        usedSquares.add(sq);
      }
      for (const sq of threats.threat) {
        if (!usedSquares.has(sq)) {
          const { x, y } = squareToCoords(sq, boardFlipped);
          overlays.push({
            square: sq,
            type: 'impact',
            left: `${x * 12.5 + 9}%`,
            top: `${y * 12.5 - 1.5}%`
          });
          usedSquares.add(sq);
        }
      }
    }
    return overlays;
  }, [
    currentFEN,
    variant,
    playerColor,
    boardFlipped,
    selectedSquare,
    captureTargets
  ]);
}
