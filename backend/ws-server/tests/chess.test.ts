import { describe, expect, test } from 'bun:test';
import { applyMove, buildPosition } from '../utils/chess';
import { getStartingFen } from '../utils/fen';
describe('chess utilities', () => {
  test('applies legal moves and advances the position', () => {
    const position = buildPosition('standard', getStartingFen('standard'));
    expect(applyMove(position, 'e2', 'e4')).toBe(true);
    expect(applyMove(position, 'e7', 'e5')).toBe(true);
  });
  test('rejects illegal moves', () => {
    const position = buildPosition('standard', getStartingFen('standard'));
    expect(applyMove(position, 'e2', 'e5')).toBe(false);
  });
});
