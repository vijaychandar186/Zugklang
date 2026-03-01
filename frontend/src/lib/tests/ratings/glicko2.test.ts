import { describe, it, expect } from 'vitest';
import { updateRatings, updatePuzzleRating } from '@/lib/ratings/glicko2';
import type { GlickoPlayer } from '@/lib/ratings/glicko2';

const equalPlayers = (): { white: GlickoPlayer; black: GlickoPlayer } => ({
  white: { rating: 1500, rd: 200, sigma: 0.06 },
  black: { rating: 1500, rd: 200, sigma: 0.06 }
});

describe('updateRatings', () => {
  it('white rating increases when white wins (outcome=1)', () => {
    const { white, black } = equalPlayers();
    const result = updateRatings(white, black, 1);
    expect(result.white.rating).toBeGreaterThan(white.rating);
    expect(result.whiteDelta).toBeGreaterThan(0);
  });

  it('black rating decreases when white wins', () => {
    const { white, black } = equalPlayers();
    const result = updateRatings(white, black, 1);
    expect(result.black.rating).toBeLessThan(black.rating);
    expect(result.blackDelta).toBeLessThan(0);
  });

  it('white rating decreases when white loses (outcome=0)', () => {
    const { white, black } = equalPlayers();
    const result = updateRatings(white, black, 0);
    expect(result.white.rating).toBeLessThan(white.rating);
    expect(result.whiteDelta).toBeLessThan(0);
  });

  it('black rating increases when white loses', () => {
    const { white, black } = equalPlayers();
    const result = updateRatings(white, black, 0);
    expect(result.black.rating).toBeGreaterThan(black.rating);
    expect(result.blackDelta).toBeGreaterThan(0);
  });

  it('draw (outcome=0.5) with equal players produces small symmetric changes', () => {
    const { white, black } = equalPlayers();
    const result = updateRatings(white, black, 0.5);
    // Equal players drawing should keep ratings close to original
    expect(Math.abs(result.whiteDelta)).toBeLessThan(10);
    expect(Math.abs(result.blackDelta)).toBeLessThan(10);
  });

  it('rating deviation decreases after a game', () => {
    const { white, black } = equalPlayers();
    const result = updateRatings(white, black, 1);
    expect(result.white.rd).toBeLessThan(white.rd);
    expect(result.black.rd).toBeLessThan(black.rd);
  });

  it('rd never falls below 30', () => {
    const lowRd: GlickoPlayer = { rating: 1500, rd: 30, sigma: 0.06 };
    const result = updateRatings(lowRd, lowRd, 1);
    expect(result.white.rd).toBeGreaterThanOrEqual(30);
    expect(result.black.rd).toBeGreaterThanOrEqual(30);
  });

  it('higher-rated player gains less when winning against lower-rated', () => {
    const strong: GlickoPlayer = { rating: 2000, rd: 150, sigma: 0.06 };
    const weak: GlickoPlayer = { rating: 1000, rd: 150, sigma: 0.06 };
    const upsetResult = updateRatings(weak, strong, 1); // weak wins
    const normalResult = updateRatings(strong, weak, 1); // strong wins
    expect(upsetResult.whiteDelta).toBeGreaterThan(normalResult.whiteDelta);
  });
});

describe('updatePuzzleRating', () => {
  const player: GlickoPlayer = { rating: 1200, rd: 150, sigma: 0.06 };
  const puzzleRating = 1200;

  it('rating increases when puzzle is solved', () => {
    const result = updatePuzzleRating(player, puzzleRating, true);
    expect(result.updated.rating).toBeGreaterThan(player.rating);
    expect(result.delta).toBeGreaterThan(0);
  });

  it('rating decreases when puzzle is failed', () => {
    const result = updatePuzzleRating(player, puzzleRating, false);
    expect(result.updated.rating).toBeLessThan(player.rating);
    expect(result.delta).toBeLessThan(0);
  });

  it('rd never falls below 30', () => {
    const lowRdPlayer: GlickoPlayer = { rating: 1200, rd: 30, sigma: 0.06 };
    const result = updatePuzzleRating(lowRdPlayer, puzzleRating, true);
    expect(result.updated.rd).toBeGreaterThanOrEqual(30);
  });

  it('solving an easier puzzle gives smaller gain than a harder one', () => {
    const hardPuzzle = updatePuzzleRating(player, 1800, true);
    const easyPuzzle = updatePuzzleRating(player, 800, true);
    expect(hardPuzzle.delta).toBeGreaterThan(easyPuzzle.delta);
  });
});
