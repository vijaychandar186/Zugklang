export interface FeatureProps {
  title: string;
  description: string;
  href?: string;
}

export const FEATURE_HEADING = 'Powerful Chess Features';

export const featureList: string[] = [
  'Stockfish 16',
  'Fairy-Stockfish',
  '9 Chess Variants',
  '4-Player Chess',
  'Puzzles & Puzzle Rush',
  'Opening Explorer',
  'Move Analysis',
  'Audio Feedback',
  'Dark Mode',
  'Multiple Themes',
  'Keyboard Shortcuts'
];

export const features: FeatureProps[] = [
  {
    title: 'Advanced AI Engines',
    description:
      'Play against Stockfish 16 for standard chess or Fairy-Stockfish for variants. Adjust difficulty from beginner to grandmaster level across all game modes.',
    href: '/play/computer'
  },
  {
    title: 'Chess Variants',
    description:
      'Go beyond standard chess with 9 variants including Fischer Random, Atomic, Racing Kings, Horde, Three-Check, Antichess, King of the Hill, and Crazyhouse.',
    href: '/play/computer'
  },
  {
    title: '4-Player Chess',
    description:
      'Experience chess with four players on an extended board. A whole new dimension of strategy with alliances, multi-front battles, and chaotic fun.',
    href: '/play/four-player'
  },
  {
    title: 'Puzzles & Training',
    description:
      'Sharpen your tactics with puzzles, race against the clock in Puzzle Rush, and train your board awareness with Memory and Vision exercises.',
    href: '/practice/puzzles'
  },
  {
    title: 'Opening Explorer',
    description:
      'Study and explore chess openings interactively. Build your opening repertoire and understand key ideas behind popular lines.',
    href: '/practice/learn/openings'
  },
  {
    title: 'Analysis Board',
    description:
      'Analyze positions with Stockfish. Import PGNs, set up positions, and explore variations to understand the game deeper.',
    href: '/tools/analysis'
  },
  {
    title: 'Game Review',
    description:
      'Review your games with accuracy scores and best move suggestions. Learn from your mistakes and track your improvement.',
    href: '/tools/game-review'
  },
  {
    title: 'Local Multiplayer',
    description:
      'Play against friends on the same device across all game modes and variants. Perfect for casual games or settling chess debates.',
    href: '/play/local'
  },
  {
    title: 'Immersive Audio',
    description:
      'Experience chess like never before with dynamic soundscapes. Every move, capture, and checkmate comes alive with carefully crafted audio feedback.'
  }
];
