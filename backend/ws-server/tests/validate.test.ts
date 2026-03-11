import { describe, expect, test } from 'bun:test';
import { isValidPromotion, isValidSquare } from '../utils/validate';
describe('validate utilities', () => {
  test('validates chess squares', () => {
    expect(isValidSquare('a1')).toBe(true);
    expect(isValidSquare('h8')).toBe(true);
    expect(isValidSquare('i4')).toBe(false);
    expect(isValidSquare('a9')).toBe(false);
    expect(isValidSquare(42)).toBe(false);
  });
  test('validates promotion pieces', () => {
    expect(isValidPromotion('q')).toBe(true);
    expect(isValidPromotion('r')).toBe(true);
    expect(isValidPromotion('b')).toBe(true);
    expect(isValidPromotion('n')).toBe(true);
    expect(isValidPromotion('k')).toBe(false);
    expect(isValidPromotion('')).toBe(false);
  });
});
