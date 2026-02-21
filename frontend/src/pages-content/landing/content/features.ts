export interface FeatureProps {
  title: string;
  description: string;
  href?: string;
}

export const FEATURE_HEADING = 'Powerful Chess Features';

export const featureList: string[] = [
  'Stockfish 16',
  'Fairy-Stockfish',
  '10 Chess Variants',
  '4-Player Chess',
  'Dice Chess',
  'Card Chess',
  'Probabilistic AI',
  'Online Multiplayer',
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
      'Go beyond standard chess with 10 variants including Fischer Random, Atomic, Racing Kings, Horde, Three-Check, Antichess, King of the Hill, Crazyhouse, and Checkers Chess.',
    href: '/play/computer'
  },
  {
    title: 'Dice Chess',
    description:
      'Roll 3 dice to determine which pieces you can move each turn. Adds an exciting layer of randomness and adaptability to your chess strategy.',
    href: '/play/custom/dice-chess'
  },
  {
    title: 'Card Chess',
    description:
      'Draw cards to determine which pieces you can move. Each card rank corresponds to a specific piece, blending card game strategy with chess.',
    href: '/play/custom/card-chess'
  },
  {
    title: '4-Player Chess',
    description:
      'Experience chess with four players on an extended board. A whole new dimension of strategy with alliances, multi-front battles, and chaotic fun.',
    href: '/play/custom/four-player'
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
    title: 'Online Multiplayer',
    description:
      'Get matched with a random opponent instantly across all 10 variants. No account needed — just pick a variant and find a game.',
    href: '/play/multiplayer'
  },
  {
    title: 'Checkers Chess',
    description:
      'A visual twist on chess where pieces look like checkers but move like chess pieces. A fresh aesthetic for a familiar game.',
    href: '/play/computer/checkers-chess'
  },
  {
    title: 'Probabilistic AI',
    description:
      'Fine-tune the engine with a Gaussian distribution curve. Adjust mean difficulty and variance for more human-like, unpredictable AI opponents.',
    href: '/play/computer'
  },
  {
    title: 'Immersive Audio',
    description:
      'Experience chess like never before with dynamic soundscapes. Every move, capture, and checkmate comes alive with carefully crafted audio feedback.'
  }
];
