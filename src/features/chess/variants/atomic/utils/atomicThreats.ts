import type { Chess, ChessJSColor } from '@/lib/chess';

export type AtomicThreatInfo = {
  impact: string[];
  threat: string[];
};

export type ExplosionZone = {
  target: string;
  collateral: string[];
};

export function computePassiveThreats(
  game: Chess,
  defendingColor: ChessJSColor
): AtomicThreatInfo {
  const attackingColor: ChessJSColor = defendingColor === 'w' ? 'b' : 'w';
  const attackedSquares = game.getSquaresAttackedBy(attackingColor);

  const impact: string[] = [];
  const threatSet = new Set<string>();

  for (const sq of attackedSquares) {
    const piece = game.get(sq);
    if (piece && piece.color === defendingColor) {
      impact.push(sq);

      const adjacent = game.getAdjacentOccupied(sq, true);
      for (const adjSq of adjacent) {
        if (adjSq !== sq) {
          threatSet.add(adjSq);
        }
      }
    }
  }

  const impactSet = new Set(impact);
  const threat = [...threatSet].filter((sq) => !impactSet.has(sq));

  return { impact, threat };
}

export function computeExplosionZone(
  game: Chess,
  captureSquare: string
): ExplosionZone {
  const collateral = game.getAdjacentOccupied(captureSquare, true);

  return {
    target: captureSquare,
    collateral: collateral.filter((sq) => sq !== captureSquare)
  };
}
