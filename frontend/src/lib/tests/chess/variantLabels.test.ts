import { describe, it, expect } from 'vitest';
import { VARIANT_LABELS, formatVariantLabel } from '@/lib/chess/variantLabels';

describe('VARIANT_LABELS', () => {
  it('contains standard variant', () => {
    expect(VARIANT_LABELS.standard).toBe('Standard');
  });

  it('contains atomic variant', () => {
    expect(VARIANT_LABELS.atomic).toBe('Atomic');
  });

  it('contains antichess variant', () => {
    expect(VARIANT_LABELS.antichess).toBe('Antichess');
  });

  it('contains fischerRandom as 960', () => {
    expect(VARIANT_LABELS.fischerRandom).toBe('960');
  });

  it('contains custom variants', () => {
    expect(VARIANT_LABELS['dice-chess']).toBe('Dice Chess');
    expect(VARIANT_LABELS['card-chess']).toBe('Card Chess');
    expect(VARIANT_LABELS['four-player']).toBe('4-Player Chess');
    expect(VARIANT_LABELS['tri-d']).toBe('Tri-D Chess');
  });
});

describe('formatVariantLabel', () => {
  it('returns the display label for known variants', () => {
    expect(formatVariantLabel('standard')).toBe('Standard');
    expect(formatVariantLabel('atomic')).toBe('Atomic');
    expect(formatVariantLabel('racingKings')).toBe('Racing Kings');
  });

  it('returns the raw variant string for unknown variants', () => {
    expect(formatVariantLabel('unknownVariant')).toBe('unknownVariant');
    expect(formatVariantLabel('myCustomGame')).toBe('myCustomGame');
  });

  it('handles hyphenated custom variant keys', () => {
    expect(formatVariantLabel('tri-d')).toBe('Tri-D Chess');
  });
});
