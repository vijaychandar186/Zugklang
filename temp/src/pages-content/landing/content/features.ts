export interface FeatureProps {
  title: string;
  description: string;
  href?: string;
}

export const FEATURE_HEADING = 'Powerful Chess Features';

export const featureList: string[] = [
  'Stockfish 16',
  'Move Analysis',
  'Audio Feedback',
  'Dark Mode',
  'Multiple Themes',
  'Keyboard Shortcuts'
];

export const features: FeatureProps[] = [
  {
    title: 'Advanced AI Engine',
    description:
      'Challenge yourself against Stockfish 16, one of the strongest chess engines in the world. Adjust difficulty from beginner to grandmaster level.',
    href: '/play/computer'
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
    title: 'Learn Chess',
    description:
      'Study chess concepts, openings, endgames, and more. Build foundational knowledge to improve your game.',
    href: '/practice/learn'
  },
  {
    title: 'Local Multiplayer',
    description:
      'Play against friends on the same device. Perfect for casual games, practice sessions, or settling chess debates.',
    href: '/play/local'
  },
  {
    title: 'Immersive Audio',
    description:
      'Experience chess like never before with dynamic soundscapes. Every move, capture, and checkmate comes alive with carefully crafted audio feedback.'
  }
];
