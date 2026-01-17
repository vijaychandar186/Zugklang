// Win percentage calculations based on Lichess formula
// Source: https://github.com/lichess-org/lila/blob/master/modules/analyse/src/main/WinPercent.scala

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
// Source: https://lichess.org/forum/general-chess-discussion/how-to-estimate-your-elo-for-a-game-using-acpl

export function getEloFromAverageCpl(averageCpl: number): number {
  return Math.round(3100 * Math.exp(-0.01 * averageCpl));
}

export function getAverageCplFromElo(elo: number): number {
  return -100 * Math.log(Math.min(elo, 3100) / 3100);
}

export function computeEstimatedElo(
  winPercentages: number[],
  whiteElo?: number,
  blackElo?: number
): { white: number; black: number } | undefined {
  if (winPercentages.length < 2) {
    return undefined;
  }

  // Calculate average CPL for each player
  let whiteCplTotal = 0;
  let blackCplTotal = 0;
  let whiteMoves = 0;
  let blackMoves = 0;

  for (let i = 1; i < winPercentages.length; i++) {
    const prev = winPercentages[i - 1];
    const curr = winPercentages[i];
    const isWhiteMove = i % 2 === 1;

    // Calculate win percentage loss (clamped to 0)
    const loss = isWhiteMove
      ? Math.max(0, prev - curr)
      : Math.max(0, curr - prev);

    // Convert back to approximate centipawn loss (rough inverse of win% formula)
    const cpl = loss * 10; // Simplified conversion

    if (isWhiteMove) {
      whiteCplTotal += Math.min(cpl, 100);
      whiteMoves++;
    } else {
      blackCplTotal += Math.min(cpl, 100);
      blackMoves++;
    }
  }

  const whiteCpl = whiteMoves > 0 ? whiteCplTotal / whiteMoves : 0;
  const blackCpl = blackMoves > 0 ? blackCplTotal / blackMoves : 0;

  const whiteEstimated = getEloFromRatingAndCpl(whiteCpl, whiteElo ?? blackElo);
  const blackEstimated = getEloFromRatingAndCpl(blackCpl, blackElo ?? whiteElo);

  return { white: whiteEstimated, black: blackEstimated };
}

function getEloFromRatingAndCpl(
  gameCpl: number,
  rating: number | undefined
): number {
  const eloFromCpl = getEloFromAverageCpl(gameCpl);
  if (!rating) return eloFromCpl;

  const expectedCpl = getAverageCplFromElo(rating);
  const cplDiff = gameCpl - expectedCpl;
  if (cplDiff === 0) return eloFromCpl;

  if (cplDiff > 0) {
    return Math.round(rating * Math.exp(-0.005 * cplDiff));
  } else {
    return Math.round(rating / Math.exp(-0.005 * -cplDiff));
  }
}
