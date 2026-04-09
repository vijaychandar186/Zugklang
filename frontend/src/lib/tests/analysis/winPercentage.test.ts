import { describe, it, expect } from 'vitest';
import {
  getWinPercentageFromCp,
  getWinPercentageFromMate,
  getWinPercentage,
  getWinPercentageFromEval,
  classifyMoveByWinPercentage,
  getClassificationScore,
  calculateAccuracy,
  getEloFromAverageCpl,
  getAverageCplFromElo,
  computeEstimatedEloFromPositions
} from '@/lib/analysis/winPercentage';
import type { MoveClassification, Evaluation } from '@/lib/analysis/winPercentage';

describe('getWinPercentageFromCp', () => {
  it('returns ~50% for 0 centipawns', () => {
    expect(getWinPercentageFromCp(0)).toBeCloseTo(50, 0);
  });

  it('returns > 90% for a large positive eval', () => {
    expect(getWinPercentageFromCp(1000)).toBeGreaterThan(90);
  });

  it('returns < 10% for a large negative eval', () => {
    expect(getWinPercentageFromCp(-1000)).toBeLessThan(10);
  });

  it('clamps values at +1000 (no difference beyond that)', () => {
    expect(getWinPercentageFromCp(1000)).toBe(getWinPercentageFromCp(2000));
  });

  it('clamps values at -1000', () => {
    expect(getWinPercentageFromCp(-1000)).toBe(getWinPercentageFromCp(-2000));
  });

  it('is symmetric around 50%', () => {
    const pos = getWinPercentageFromCp(300);
    const neg = getWinPercentageFromCp(-300);
    expect(pos + neg).toBeCloseTo(100, 5);
  });
});

describe('getWinPercentageFromMate', () => {
  it('returns 100 for positive mate (white has mate)', () => {
    expect(getWinPercentageFromMate(3)).toBe(100);
    expect(getWinPercentageFromMate(1)).toBe(100);
  });

  it('returns 0 for negative mate (black has mate)', () => {
    expect(getWinPercentageFromMate(-3)).toBe(0);
    expect(getWinPercentageFromMate(-1)).toBe(0);
  });
});

describe('getWinPercentage', () => {
  it('uses mate when both cp and mate are provided', () => {
    expect(getWinPercentage(0, 5)).toBe(100);
    expect(getWinPercentage(500, -3)).toBe(0);
  });

  it('uses cp when mate is null', () => {
    expect(getWinPercentage(0, null)).toBeCloseTo(50, 0);
  });

  it('returns 50 when both are null/undefined', () => {
    expect(getWinPercentage(null, null)).toBe(50);
    expect(getWinPercentage(undefined, undefined)).toBe(50);
  });
});

describe('getWinPercentageFromEval', () => {
  it('handles cp type', () => {
    expect(getWinPercentageFromEval({ type: 'cp', value: 0 })).toBeCloseTo(
      50,
      0
    );
  });

  it('handles mate type', () => {
    expect(getWinPercentageFromEval({ type: 'mate', value: 2 })).toBe(100);
    expect(getWinPercentageFromEval({ type: 'mate', value: -2 })).toBe(0);
  });
});

describe('classifyMoveByWinPercentage', () => {
  it('classifies as forced when isForced=true', () => {
    expect(classifyMoveByWinPercentage(50, 20, true, false, true)).toBe(
      'forced'
    );
  });

  it('classifies as best when isPlayedBestMove=true', () => {
    expect(classifyMoveByWinPercentage(50, 20, true, true, false)).toBe('best');
  });

  it('classifies blunder (> 20% drop)', () => {
    // White move: prev=70, curr=40 → diff = (40-70)*1 = -30 → blunder
    expect(classifyMoveByWinPercentage(70, 40, true, false, false)).toBe(
      'blunder'
    );
  });

  it('classifies mistake (> 10% drop)', () => {
    // White move: prev=60, curr=48 → diff = -12 → mistake
    expect(classifyMoveByWinPercentage(60, 48, true, false, false)).toBe(
      'mistake'
    );
  });

  it('classifies inaccuracy (> 5% drop)', () => {
    // White move: prev=55, curr=49 → diff = -6 → inaccuracy
    expect(classifyMoveByWinPercentage(55, 49, true, false, false)).toBe(
      'inaccuracy'
    );
  });

  it('classifies excellent (small drop)', () => {
    // White move: prev=55, curr=54 → diff = -1 → excellent
    expect(classifyMoveByWinPercentage(55, 54, true, false, false)).toBe(
      'excellent'
    );
  });

  it('inverts sign for black moves', () => {
    // Black move: prev=50, curr=80 → diff = (80-50)*-1 = -30 < -20 → blunder
    expect(classifyMoveByWinPercentage(50, 80, false, false, false)).toBe(
      'blunder'
    );
  });
});

describe('getClassificationScore', () => {
  const cases: Array<[MoveClassification, number]> = [
    ['blunder', 0],
    ['mistake', 0.15],
    ['miss', 0.25],
    ['inaccuracy', 0.35],
    ['good', 0.55],
    ['excellent', 0.85],
    ['best', 1],
    ['brilliant', 1],
    ['great', 1],
    ['forced', 1],
    ['book', 0.9]
  ];

  it.each(cases)('%s → %s', (classification, score) => {
    expect(getClassificationScore(classification)).toBe(score);
  });
});

describe('calculateAccuracy', () => {
  it('returns 0 for empty array', () => {
    expect(calculateAccuracy([])).toBe(0);
  });

  it('returns 100% for all best moves', () => {
    expect(calculateAccuracy(['best', 'best', 'best'])).toBe(100);
  });

  it('returns 0% for all blunders', () => {
    expect(calculateAccuracy(['blunder', 'blunder'])).toBe(0);
  });

  it('averages correctly for mixed classifications', () => {
    // best(1) + blunder(0) = 0.5 avg → 50%
    expect(calculateAccuracy(['best', 'blunder'])).toBeCloseTo(50, 5);
  });
});

describe('getEloFromAverageCpl / getAverageCplFromElo', () => {
  it('0 cpl → high Elo (~2800)', () => {
    expect(getEloFromAverageCpl(0)).toBe(2800);
  });

  it('300 cpl → low Elo (near 500–600 range)', () => {
    const elo = getEloFromAverageCpl(300);
    expect(elo).toBeGreaterThanOrEqual(500);
    expect(elo).toBeLessThan(600);
  });

  it('roundtrip is approximately consistent', () => {
    const elo = 1500;
    const cpl = getAverageCplFromElo(elo);
    const backElo = getEloFromAverageCpl(cpl);
    expect(backElo).toBeCloseTo(elo, -1); // within ~10
  });

  it('clamps CPL at 300 for getEloFromAverageCpl', () => {
    expect(getEloFromAverageCpl(500)).toBe(getEloFromAverageCpl(300));
  });
});

describe('computeEstimatedEloFromPositions', () => {
  const cp = (value: number): Evaluation => ({ type: 'cp', value });
  const mate = (value: number): Evaluation => ({ type: 'mate', value });

  const pos = (fen: string, eval_: Evaluation) => ({
    fen,
    topLines: [{ evaluation: eval_ }]
  });

  it('returns undefined for empty array', () => {
    expect(computeEstimatedEloFromPositions([])).toBeUndefined();
  });

  it('returns undefined for single position', () => {
    expect(computeEstimatedEloFromPositions([pos('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', cp(30))])).toBeUndefined();
  });

  it('returns elo estimates for two positions', () => {
    const positions = [
      pos('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', cp(0)),
      pos('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', cp(30))
    ];
    const result = computeEstimatedEloFromPositions(positions);
    expect(result).toBeDefined();
    expect(typeof result!.white).toBe('number');
    expect(typeof result!.black).toBe('number');
  });

  it('returns undefined when no evaluations are present', () => {
    const positions = [
      { fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', topLines: [] },
      { fen: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', topLines: [] }
    ];
    expect(computeEstimatedEloFromPositions(positions)).toBeUndefined();
  });

  it('handles mate evaluations without crashing', () => {
    const positions = [
      pos('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', mate(3)),
      pos('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', mate(-3))
    ];
    const result = computeEstimatedEloFromPositions(positions);
    expect(result).toBeDefined();
  });

  it('handles negative mate (losing mate) evaluations', () => {
    const positions = [
      pos('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', mate(-2)),
      pos('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', cp(100))
    ];
    const result = computeEstimatedEloFromPositions(positions);
    expect(result).toBeDefined();
  });

  it('CPL is clamped to 500 max per move', () => {
    const positions = [
      pos('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', cp(2000)),
      pos('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1', cp(-3000))
    ];
    const result = computeEstimatedEloFromPositions(positions);
    expect(result).toBeDefined();
    expect(result!.white).toBeLessThan(1000);
  });
});
