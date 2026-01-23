function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

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

  const winPercentageDiff =
    (currWinPercentage - prevWinPercentage) * (isWhiteMove ? 1 : -1);

  if (winPercentageDiff < -20) return 'blunder';
  if (winPercentageDiff < -10) return 'mistake';
  if (winPercentageDiff < -7) return 'miss';
  if (winPercentageDiff < -5) return 'inaccuracy';
  if (winPercentageDiff < -2) return 'good';
  return 'excellent';
}

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

export function getEloFromAverageCpl(averageCpl: number): number {
  const clampedCpl = Math.max(0, Math.min(300, averageCpl));

  const baseElo = 2800;
  const minElo = 500;
  const decayFactor = 0.015;

  const elo = minElo + (baseElo - minElo) * Math.exp(-decayFactor * clampedCpl);
  return Math.round(elo);
}

export function getAverageCplFromElo(elo: number): number {
  const clampedElo = Math.max(500, Math.min(2800, elo));
  return -Math.log((clampedElo - 500) / 2300) / 0.015;
}

export interface PositionEvaluation {
  evaluation: Evaluation;
  fen: string;
}

export function computeEstimatedEloFromPositions(
  positions: Array<{
    topLines?: Array<{ evaluation: Evaluation }>;
    fen: string;
  }>
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

    const isWhiteMove = currPos.fen.includes(' b ');

    const prevCp =
      prevEval.type === 'mate'
        ? prevEval.value > 0
          ? 10000
          : -10000
        : prevEval.value;
    const currCp =
      currEval.type === 'mate'
        ? currEval.value > 0
          ? 10000
          : -10000
        : currEval.value;

    let cpl: number;
    if (isWhiteMove) {
      cpl = prevCp - currCp;
    } else {
      cpl = currCp - prevCp;
    }

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
