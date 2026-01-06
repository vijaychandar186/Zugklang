export interface FeatureProps {
  title: string;
  description: string;
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
      'Challenge yourself against Stockfish 16, one of the strongest chess engines in the world. Adjust difficulty from beginner to grandmaster level.'
  },
  {
    title: 'Immersive Audio',
    description:
      'Experience chess like never before with dynamic soundscapes. Every move, capture, and checkmate comes alive with carefully crafted audio feedback.'
  },
  {
    title: 'Deep Analysis',
    description:
      'Review your games with powerful analysis tools. See engine evaluations, best moves, and learn from your mistakes to improve your play.'
  },
  {
    title: 'Beautiful Themes',
    description:
      'Choose from multiple board themes and piece sets. Play in light or dark mode with a premium, polished interface.'
  },
  {
    title: 'Local Multiplayer',
    description:
      'Play against friends on the same device. Perfect for casual games, practice sessions, or settling chess debates.'
  },
  {
    title: 'Game History',
    description:
      'Navigate through your game with full move history. Jump to any position, replay the game, and understand how it developed.'
  }
];
