export type ChessArrow = {
  startSquare: string;
  endSquare: string;
  color: string;
};

export type ArrowColorKey =
  | 'userPrimary'
  | 'userSecondary'
  | 'userTertiary'
  | 'bestMove'
  | 'threat'
  | 'alternative'
  | 'blunder'
  | 'good'
  | 'mistake'
  | 'brilliant'
  | 'info';
