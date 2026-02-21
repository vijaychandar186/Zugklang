export interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

export const FAQ_SUBTITLE =
  'Find answers to common questions about Zugklang chess.';

export const FAQList: FAQProps[] = [
  {
    question: 'What chess engines does Zugklang use?',
    answer:
      'Zugklang uses two engines: Stockfish 16 for standard chess and Fairy-Stockfish for chess variants like Atomic, Racing Kings, and more. Both run directly in your browser using WebAssembly for fast, responsive gameplay.',
    value: 'item-1'
  },
  {
    question: 'What chess variants are available?',
    answer:
      'Zugklang supports 10 variants: Standard, Fischer Random (Chess960), Atomic, Racing Kings, Horde, Three-Check, Antichess, King of the Hill, Crazyhouse, and Chess with Checkers. You can play all of them against the AI, locally with a friend, or online against a random opponent. There is also a 4-Player Chess mode.',
    value: 'item-2'
  },
  {
    question: 'Can I play against a friend?',
    answer:
      'Yes! You can challenge a friend locally on the same device across all variants, or play online and get matched with a random opponent instantly — no account needed. There is also a 4-Player Chess mode for even more players.',
    value: 'item-3'
  },
  {
    question: 'What training and practice modes are available?',
    answer:
      'Zugklang offers tactical puzzles, a timed Puzzle Rush mode, an Opening Explorer to study chess openings, and Memory and Vision training exercises to sharpen your board awareness.',
    value: 'item-4'
  },
  {
    question: 'How do the difficulty levels work?',
    answer:
      'The AI difficulty is controlled by adjusting how deep Stockfish analyzes positions. Lower levels play faster but weaker moves, while higher levels take more time to find stronger moves, simulating different skill levels from beginner to master.',
    value: 'item-5'
  },
  {
    question: 'What makes the audio experience special?',
    answer:
      'Zugklang (meaning "move sound" in German) features carefully designed audio feedback for every chess action. Different sounds for moves, captures, checks, and checkmates create an immersive playing experience.',
    value: 'item-6'
  },
  {
    question: 'Can I analyze and review my games?',
    answer:
      'Yes! The Analysis Board lets you analyze positions with Stockfish, import PGNs, and explore variations. Game Review provides accuracy scores and best move suggestions so you can learn from your games.',
    value: 'item-7'
  },
  {
    question: 'Does it work on mobile devices?',
    answer:
      'Yes! Zugklang is fully responsive and works on phones, tablets, and desktop browsers. The interface adapts to provide the best experience on any screen size.',
    value: 'item-8'
  }
];
