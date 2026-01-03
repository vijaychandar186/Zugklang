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
  Ban,
  Share2,
  Eye,
  EyeOff,
  Brain,
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
  share: Share2,

  // Users
  player: User,
  stockfish: Bot,

  // Theme
  sun: Sun,
  moon: Moon,
  system: Monitor,
  abort: Ban,

  // Analysis
  analyze: Eye,
  analyzeOff: EyeOff,
  engine: Brain
} as const;

export type { LucideIcon };
