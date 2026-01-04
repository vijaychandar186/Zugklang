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
  ChevronFirst,
  ChevronLast,
  Copy,
  Check,
  Settings,
  Flag,
  RotateCcw,
  Plus,
  Play,
  Pause,
  Upload,
  Square,
  FileText,
  X,
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
  Edit,
  Trash2,
  Crown,
  Volume2,
  VolumeX,
  Eraser,
  RotateCw,
  Download,
  Undo2,
  Redo2,
  Shuffle,
  type LucideIcon
} from 'lucide-react';

export const Icons = {
  // Chess pieces
  chessPawn: ChessPawn,
  chessKnight: ChessKnight,
  chessBishop: ChessBishop,
  chessRook: ChessRook,
  chessQueen: ChessQueen,
  chessKing: Crown,

  // Navigation
  chevronsLeft: ChevronsLeft,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  chevronsRight: ChevronsRight,
  chevronFirst: ChevronFirst,
  chevronLast: ChevronLast,

  // Actions
  copy: Copy,
  check: Check,
  settings: Settings,
  flag: Flag,
  rematch: RotateCcw,
  newGame: Plus,
  flipBoard: ArrowUpDown,
  share: Share2,
  play: Play,
  pause: Pause,
  upload: Upload,
  download: Download,
  square: Square,
  close: X,
  fileText: FileText,
  edit: Edit,
  trash: Trash2,
  eraser: Eraser,
  undo: Undo2,
  redo: Redo2,
  shuffle: Shuffle,
  rotate: RotateCw,

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
  engine: Brain,

  // Sound
  volumeOn: Volume2,
  volumeOff: VolumeX
} as const;

export type { LucideIcon };
