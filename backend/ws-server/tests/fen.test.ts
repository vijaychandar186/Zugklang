import { describe, expect, test } from 'bun:test';
import { generateChess960Fen, getStartingFen } from '../utils/fen';
function pieceAt(backRank: string, piece: string): number[] {
  const indexes: number[] = [];
  for (let i = 0; i < backRank.length; i++) {
    if (backRank[i] === piece) indexes.push(i);
  }
  return indexes;
}
describe('fen utilities', () => {
  test('returns fixed start FENs for known variants', () => {
    expect(getStartingFen('standard')).toBe(
      'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    );
    expect(getStartingFen('racingKings')).toBe(
      '8/8/8/8/8/8/krbnNBRK/qrbnNBRQ w KQkq - 0 1'
    );
    expect(getStartingFen('horde')).toBe(
      'rnbqkbnr/pppppppp/8/1PP2PP1/PPPPPPPP/PPPPPPPP/PPPPPPPP/PPPPPPPP w kq - 0 1'
    );
  });
  test('generates valid chess960 constraints', () => {
    for (let i = 0; i < 100; i++) {
      const fen = generateChess960Fen();
      const [board] = fen.split(' ');
      const [backRankBlack] = board!.split('/');
      expect(backRankBlack).toBeDefined();
      expect(backRankBlack!.length).toBe(8);
      const bishops = pieceAt(backRankBlack!, 'b');
      const king = pieceAt(backRankBlack!, 'k')[0];
      const rooks = pieceAt(backRankBlack!, 'r');
      expect(bishops.length).toBe(2);
      expect(bishops[0]! % 2).not.toBe(bishops[1]! % 2);
      expect(rooks.length).toBe(2);
      expect(king).toBeGreaterThan(rooks[0]!);
      expect(king).toBeLessThan(rooks[1]!);
    }
  });
});
