import {
  ChessRook,
  ChessPawn,
  ChessQueen,
  ChessBishop,
  ChessKnight,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Copy,
  Check,
  Settings,
  Flag,
  RotateCcw,
  Plus,
  User,
  Bot,
  Sun,
  Moon,
  Monitor,
  ArrowUpDown,
  type LucideIcon
} from 'lucide-react';

export const Icons = {
  // Chess pieces
  chessPawn: ChessPawn,
  chessKnight: ChessKnight,
  chessBishop: ChessBishop,
  chessRook: ChessRook,
  chessQueen: ChessQueen,

  // Navigation
  chevronsLeft: ChevronsLeft,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronsRight: ChevronsRight,

  // Actions
  copy: Copy,
  check: Check,
  settings: Settings,
  flag: Flag,
  rematch: RotateCcw,
  newGame: Plus,
  flipBoard: ArrowUpDown,

  // Users
  player: User,
  stockfish: Bot,

  // Theme
  sun: Sun,
  moon: Moon,
  system: Monitor
} as const;

export type { LucideIcon };
