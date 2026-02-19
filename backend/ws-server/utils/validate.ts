const SQUARE_RE = /^[a-h][1-8]$/;
const PROMOTION_RE = /^[qrbn]$/;

export function isValidSquare(s: unknown): s is string {
  return typeof s === 'string' && SQUARE_RE.test(s);
}

export function isValidPromotion(s: unknown): s is string {
  return typeof s === 'string' && PROMOTION_RE.test(s);
}
