const TAU = 0.5;
const EPSILON = 0.000001;
const SCALE = 173.7178;
export interface GlickoPlayer {
  rating: number;
  rd: number;
  sigma: number;
}
export interface GlickoResult {
  white: GlickoPlayer;
  black: GlickoPlayer;
  whiteDelta: number;
  blackDelta: number;
}
const RATING_ANCHOR = 700;
const PUZZLE_ANCHOR = 1000;
function toGlicko2(rating: number, rd: number) {
  return {
    mu: (rating - RATING_ANCHOR) / SCALE,
    phi: rd / SCALE
  };
}
function fromGlicko2(mu: number, phi: number) {
  return {
    rating: Math.round(mu * SCALE + RATING_ANCHOR),
    rd: Math.round(phi * SCALE)
  };
}
function g(phi: number): number {
  return 1 / Math.sqrt(1 + (3 * phi * phi) / (Math.PI * Math.PI));
}
function E(mu: number, muJ: number, phiJ: number): number {
  return 1 / (1 + Math.exp(-g(phiJ) * (mu - muJ)));
}
function computeV(mu: number, muJ: number, phiJ: number): number {
  const gPhi = g(phiJ);
  const e = E(mu, muJ, phiJ);
  return 1 / (gPhi * gPhi * e * (1 - e));
}
function computeDelta(
  v: number,
  mu: number,
  muJ: number,
  phiJ: number,
  score: number
): number {
  const gPhi = g(phiJ);
  const e = E(mu, muJ, phiJ);
  return v * gPhi * (score - e);
}
function newSigma(
  phi: number,
  sigma: number,
  v: number,
  delta: number
): number {
  const a = Math.log(sigma * sigma);
  const phiSq = phi * phi;
  const deltaSq = delta * delta;
  function f(x: number): number {
    const ex = Math.exp(x);
    const d = phiSq + v + ex;
    return (
      (ex * (deltaSq - phiSq - v - ex)) / (2 * d * d) - (x - a) / (TAU * TAU)
    );
  }
  let A = a;
  let B: number;
  if (deltaSq > phiSq + v) {
    B = Math.log(deltaSq - phiSq - v);
  } else {
    let k = 1;
    while (f(a - k * TAU) < 0) k++;
    B = a - k * TAU;
  }
  let fA = f(A);
  let fB = f(B);
  while (Math.abs(B - A) > EPSILON) {
    const C = A + ((A - B) * fA) / (fB - fA);
    const fC = f(C);
    if (fC * fB <= 0) {
      A = B;
      fA = fB;
    } else {
      fA = fA / 2;
    }
    B = C;
    fB = fC;
  }
  return Math.exp(A / 2);
}
export function updatePuzzleRating(
  player: GlickoPlayer,
  puzzleRating: number,
  solved: boolean
): {
  updated: GlickoPlayer;
  delta: number;
} {
  const p = {
    mu: (player.rating - PUZZLE_ANCHOR) / SCALE,
    phi: player.rd / SCALE
  };
  const opp = {
    mu: (puzzleRating - PUZZLE_ANCHOR) / SCALE,
    phi: 100 / SCALE
  };
  const outcome: 1 | 0 = solved ? 1 : 0;
  const v = computeV(p.mu, opp.mu, opp.phi);
  const delta = computeDelta(v, p.mu, opp.mu, opp.phi, outcome);
  const sigma1 = newSigma(p.phi, player.sigma, v, delta);
  const phiStar = Math.sqrt(p.phi * p.phi + sigma1 * sigma1);
  const phi1 = 1 / Math.sqrt(1 / (phiStar * phiStar) + 1 / v);
  const mu1 =
    p.mu + phi1 * phi1 * g(opp.phi) * (outcome - E(p.mu, opp.mu, opp.phi));
  const newRating = Math.round(mu1 * SCALE + PUZZLE_ANCHOR);
  const newRd = Math.max(30, Math.round(phi1 * SCALE));
  const updated: GlickoPlayer = { rating: newRating, rd: newRd, sigma: sigma1 };
  return { updated, delta: newRating - player.rating };
}
export function updateRatings(
  white: GlickoPlayer,
  black: GlickoPlayer,
  outcome: 1 | 0 | 0.5
): GlickoResult {
  const w = toGlicko2(white.rating, white.rd);
  const b = toGlicko2(black.rating, black.rd);
  const vW = computeV(w.mu, b.mu, b.phi);
  const deltaW = computeDelta(vW, w.mu, b.mu, b.phi, outcome);
  const sigmaW1 = newSigma(w.phi, white.sigma, vW, deltaW);
  const phiStarW = Math.sqrt(w.phi * w.phi + sigmaW1 * sigmaW1);
  const phiW1 = 1 / Math.sqrt(1 / (phiStarW * phiStarW) + 1 / vW);
  const muW1 =
    w.mu + phiW1 * phiW1 * g(b.phi) * (outcome - E(w.mu, b.mu, b.phi));
  const blackScore = 1 - outcome;
  const vB = computeV(b.mu, w.mu, w.phi);
  const deltaB = computeDelta(vB, b.mu, w.mu, w.phi, blackScore);
  const sigmaB1 = newSigma(b.phi, black.sigma, vB, deltaB);
  const phiStarB = Math.sqrt(b.phi * b.phi + sigmaB1 * sigmaB1);
  const phiB1 = 1 / Math.sqrt(1 / (phiStarB * phiStarB) + 1 / vB);
  const muB1 =
    b.mu + phiB1 * phiB1 * g(w.phi) * (blackScore - E(b.mu, w.mu, w.phi));
  const newWhite = fromGlicko2(muW1, phiW1);
  const newBlack = fromGlicko2(muB1, phiB1);
  return {
    white: {
      rating: newWhite.rating,
      rd: Math.max(30, newWhite.rd),
      sigma: sigmaW1
    },
    black: {
      rating: newBlack.rating,
      rd: Math.max(30, newBlack.rd),
      sigma: sigmaB1
    },
    whiteDelta: newWhite.rating - white.rating,
    blackDelta: newBlack.rating - black.rating
  };
}
