function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Lichess win percentage formula
const MULTIPLIER = -0.00368208;

export function getWinPercentageFromCp(cp: number): number {
  const cpClamped = clamp(cp, -1000, 1000);
  const winChances = 2 / (1 + Math.exp(MULTIPLIER * cpClamped)) - 1;
  return 50 + 50 * winChances;
}

export function getWinPercentageFromMate(mate: number): number {
  return mate > 0 ? 100 : 0;
}

export function getWinPercentage(
  cp: number | null | undefined,
  mate: number | null | undefined
): number {
  if (mate !== null && mate !== undefined) {
    return getWinPercentageFromMate(mate);
  }
  if (cp !== null && cp !== undefined) {
    return getWinPercentageFromCp(cp);
  }
  return 50;
}

export type Evaluation = {
  type: 'cp' | 'mate';
  value: number;
};

export function getWinPercentageFromEval(evaluation: Evaluation): number {
  if (evaluation.type === 'mate') {
    return getWinPercentageFromMate(evaluation.value);
  }
  return getWinPercentageFromCp(evaluation.value);
}

// Move classification based on win percentage difference
// Thresholds from Chesskit reference implementation
export type MoveClassification =
  | 'blunder'
  | 'mistake'
  | 'miss'
  | 'inaccuracy'
  | 'good'
  | 'excellent'
  | 'best'
  | 'brilliant'
  | 'great'
  | 'forced'
  | 'book';

export function classifyMoveByWinPercentage(
  prevWinPercentage: number,
  currWinPercentage: number,
  isWhiteMove: boolean,
  isPlayedBestMove: boolean,
  isForced: boolean
): MoveClassification {
  if (isForced) {
    return 'forced';
  }

  if (isPlayedBestMove) {
    return 'best';
  }

  // Win percentage diff from the moving player's perspective
  // Positive = good for player, negative = bad for player
  const winPercentageDiff =
    (currWinPercentage - prevWinPercentage) * (isWhiteMove ? 1 : -1);

  if (winPercentageDiff < -20) return 'blunder';
  if (winPercentageDiff < -10) return 'mistake';
  if (winPercentageDiff < -7) return 'miss';
  if (winPercentageDiff < -5) return 'inaccuracy';
  if (winPercentageDiff < -2) return 'good';
  return 'excellent';
}

// Accuracy calculation using harmonic mean of move scores
const CLASSIFICATION_SCORES: Record<MoveClassification, number> = {
  blunder: 0,
  mistake: 0.15,
  miss: 0.25,
  inaccuracy: 0.35,
  good: 0.55,
  excellent: 0.85,
  best: 1,
  great: 1,
  brilliant: 1,
  book: 0.9,
  forced: 1
};

export function getClassificationScore(
  classification: MoveClassification
): number {
  return CLASSIFICATION_SCORES[classification] ?? 0.5;
}

export function calculateAccuracy(
  classifications: MoveClassification[]
): number {
  if (classifications.length === 0) return 0;

  const scores = classifications.map(getClassificationScore);
  const sum = scores.reduce((acc, score) => acc + score, 0);
  return (sum / classifications.length) * 100;
}

// Estimated Elo calculation based on average centipawn loss
// Reference: Lichess uses ACPL to estimate playing strength
// Note: This is a rough estimate - higher ACPL = lower rating

export function getEloFromAverageCpl(averageCpl: number): number {
  // A more realistic formula that gives reasonable ratings:
  // - CPL 0 = ~2800 (perfect play)
  // - CPL 10 = ~2400 (GM level)
  // - CPL 25 = ~2000 (Expert level)
  // - CPL 50 = ~1500 (Club level)
  // - CPL 100 = ~1000 (Beginner)
  // - CPL 200+ = ~600 (Very beginner)
  
  // Clamp CPL to reasonable range
  const clampedCpl = Math.max(0, Math.min(300, averageCpl));
  
  // Exponential decay from ~2800 to ~500
  const baseElo = 2800;
  const minElo = 500;
  const decayFactor = 0.015;
  
  const elo = minElo + (baseElo - minElo) * Math.exp(-decayFactor * clampedCpl);
  return Math.round(elo);
}

export function getAverageCplFromElo(elo: number): number {
  // Inverse of the above formula
  const clampedElo = Math.max(500, Math.min(2800, elo));
  return -Math.log((clampedElo - 500) / 2300) / 0.015;
}

export interface PositionEvaluation {
  evaluation: Evaluation;
  fen: string;
}

// Calculate estimated Elo from actual position evaluations
// This uses the actual centipawn values, not win percentages
export function computeEstimatedEloFromPositions(
  positions: Array<{ topLines?: Array<{ evaluation: Evaluation }>, fen: string }>
): { white: number; black: number } | undefined {
  if (positions.length < 2) {
    return undefined;
  }

  let whiteCplTotal = 0;
  let blackCplTotal = 0;
  let whiteMoves = 0;
  let blackMoves = 0;

  for (let i = 1; i < positions.length; i++) {
    const prevPos = positions[i - 1];
    const currPos = positions[i];
    
    const prevEval = prevPos.topLines?.[0]?.evaluation;
    const currEval = currPos.topLines?.[0]?.evaluation;
    
    if (!prevEval || !currEval) continue;
    
    // Determine who moved (position i contains the FEN AFTER the move)
    // A FEN with ' b ' means it's Black's turn, so the previous move was by White.
    // A FEN with ' w ' means it's White's turn, so the previous move was by Black.
    const isWhiteMove = currPos.fen.includes(' b ');
    
    // Get centipawn values (mate is treated as winning by a lot)
    const prevCp = prevEval.type === 'mate' 
      ? (prevEval.value > 0 ? 10000 : -10000)
      : prevEval.value;
    const currCp = currEval.type === 'mate' 
      ? (currEval.value > 0 ? 10000 : -10000)
      : currEval.value;
    
    // Calculate centipawn loss from the moving player's perspective
    // Positive = player lost advantage, negative = player gained advantage
    let cpl: number;
    if (isWhiteMove) {
      // White moved, so we compare from White's perspective
      // Loss = what we had - what we have now
      cpl = prevCp - currCp;
    } else {
      // Black moved, perspective is inverted
      cpl = currCp - prevCp;
    }
    
    // Only count actual losses (positive CPL)
    // Clamp to avoid extreme values skewing the average
    const clampedCpl = Math.max(0, Math.min(cpl, 500));
    
    if (isWhiteMove) {
      whiteCplTotal += clampedCpl;
      whiteMoves++;
    } else {
      blackCplTotal += clampedCpl;
      blackMoves++;
    }
  }

  if (whiteMoves === 0 && blackMoves === 0) {
    return undefined;
  }

  const whiteAcpl = whiteMoves > 0 ? whiteCplTotal / whiteMoves : 0;
  const blackAcpl = blackMoves > 0 ? blackCplTotal / blackMoves : 0;

  return {
    white: getEloFromAverageCpl(whiteAcpl),
    black: getEloFromAverageCpl(blackAcpl)
  };
}

// Keep the old function for backwards compatibility, but use direct CPL
export function computeEstimatedElo(
  winPercentages: number[],
  _whiteElo?: number,
  _blackElo?: number
): { white: number; black: number } | undefined {
  if (winPercentages.length < 2) {
    return undefined;
  }

  // Calculate average CPL for each player from win percentage changes
  let whiteCplTotal = 0;
  let blackCplTotal = 0;
  let whiteMoves = 0;
  let blackMoves = 0;

  for (let i = 1; i < winPercentages.length; i++) {
    const prev = winPercentages[i - 1];
    const curr = winPercentages[i];
    const isWhiteMove = i % 2 === 1;

    // Calculate win percentage loss
    // For white: losing means curr < prev
    // For black: losing means curr > prev (since higher win% favors white)
    const loss = isWhiteMove
      ? Math.max(0, prev - curr)
      : Math.max(0, curr - prev);

    // Convert win% loss to approximate CPL
    // A 1% win% loss is roughly 3-4 centipawns
    const cpl = loss * 3.5;

    if (isWhiteMove) {
      whiteCplTotal += Math.min(cpl, 500); // Cap extreme values
      whiteMoves++;
    } else {
      blackCplTotal += Math.min(cpl, 500);
      blackMoves++;
    }
  }

  if (whiteMoves === 0 && blackMoves === 0) {
    return undefined;
  }

  const whiteAcpl = whiteMoves > 0 ? whiteCplTotal / whiteMoves : 0;
  const blackAcpl = blackMoves > 0 ? blackCplTotal / blackMoves : 0;

  return {
    white: getEloFromAverageCpl(whiteAcpl),
    black: getEloFromAverageCpl(blackAcpl)
  };
}
