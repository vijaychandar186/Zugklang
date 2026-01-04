import { CSSProperties } from 'react';
import { Square } from 'chess.js';

// ============================================================================
// Chess Board Types
// ============================================================================

export type PlayerColor = 'white' | 'black';
export type PieceColor = 'w' | 'b';
export type PieceSymbol = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';

export type PieceCode =
  | 'wP'
  | 'wN'
  | 'wB'
  | 'wR'
  | 'wQ'
  | 'wK'
  | 'bP'
  | 'bN'
  | 'bB'
  | 'bR'
  | 'bQ'
  | 'bK';

export type CapturablePiece = 'p' | 'n' | 'b' | 'r' | 'q';

export type CapturedPieces = {
  white: CapturablePiece[];
  black: CapturablePiece[];
};

// ============================================================================
// Square Styling Types
// ============================================================================

export type SquareStyles = {
  [key in Square]?: CSSProperties;
};

export type RightClickedSquares = {
  [key in Square]?: CSSProperties | undefined;
};

// ============================================================================
// Arrow Types
// ============================================================================

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

// ============================================================================
// Board Theme Types
// ============================================================================

export type BoardThemeName =
  | 'default'
  | 'blue'
  | 'teal'
  | 'gold'
  | 'orange'
  | 'mono';

export type BoardTheme = {
  name: BoardThemeName;
  label: string;
  dark: CSSProperties;
  light: CSSProperties;
};

// ============================================================================
// Analysis Types
// ============================================================================

export type Advantage = 'white' | 'black' | 'equal';

export type AnalysisLine = {
  multiPvIndex: number;
  cp: number;
  mate: number | null;
  advantage: Advantage;
  pvMoves: string[];
  depth: number;
};

export type LineEvaluation = {
  advantage: Advantage;
  cp: number;
  mate: number | null;
  formattedEvaluation: string;
};

export type ProcessedAnalysis = {
  advantage: Advantage;
  cp: number | null;
  mate: number | null;
  formattedEvaluation: string;
  uciLines: string[][];
  lineEvaluations: LineEvaluation[];
};

export type AnalysisMode = 'normal' | 'position-editor' | 'play-from-position';

// ============================================================================
// Game Types
// ============================================================================

export type TimeControlMode = 'unlimited' | 'timed' | 'custom';

export type TimeControl = {
  mode: TimeControlMode;
  minutes: number;
  increment: number;
  whiteMinutes?: number;
  whiteIncrement?: number;
  blackMinutes?: number;
  blackIncrement?: number;
};

export type GameResult = {
  winner: PlayerColor | 'draw' | null;
  reason: string;
};

// ============================================================================
// Component Props Types
// ============================================================================

export type NavigationControlsProps = {
  viewingIndex: number;
  totalPositions: number;
  canGoBack: boolean;
  canGoForward: boolean;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onGoToStart: () => void;
  onGoToEnd: () => void;
  onGoToPrev: () => void;
  onGoToNext: () => void;
};

export type MoveHistoryProps = {
  moves: string[];
  viewingIndex: number;
  onMoveClick: (index: number) => void;
};

export type EvaluationBarProps = {
  advantage: Advantage;
  cp: number | null;
  mate: number | null;
  isActive: boolean;
  className?: string;
};

// ============================================================================
// Board Editor Types
// ============================================================================

export type EditorPiece = PieceCode | 'trash';

export type BoardEditorState = {
  selectedPiece: EditorPiece | null;
  turn: PieceColor;
  castlingRights: {
    whiteKingside: boolean;
    whiteQueenside: boolean;
    blackKingside: boolean;
    blackQueenside: boolean;
  };
};

// ============================================================================
// Constants
// ============================================================================

export const STARTING_FEN =
  'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
export const EMPTY_FEN = '8/8/8/8/8/8/8/8 w - - 0 1';

export const PIECE_VALUES: Record<CapturablePiece, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9
};

export const ALL_PIECE_CODES: PieceCode[] = [
  'wK',
  'wQ',
  'wR',
  'wB',
  'wN',
  'wP',
  'bK',
  'bQ',
  'bR',
  'bB',
  'bN',
  'bP'
];

export const WHITE_PIECES: PieceCode[] = ['wK', 'wQ', 'wR', 'wB', 'wN', 'wP'];
export const BLACK_PIECES: PieceCode[] = ['bK', 'bQ', 'bR', 'bB', 'bN', 'bP'];
