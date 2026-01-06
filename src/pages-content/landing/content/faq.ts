export interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

export const FAQ_SUBTITLE =
  'Find answers to common questions about Zugklang chess.';

export const FAQList: FAQProps[] = [
  {
    question: 'What chess engine does Zugklang use?',
    answer:
      'Zugklang is powered by Stockfish 16, one of the strongest open-source chess engines available. It runs directly in your browser using WebAssembly for fast, responsive gameplay.',
    value: 'item-1'
  },
  {
    question: 'Can I play against a friend?',
    answer:
      'Yes! Zugklang supports local multiplayer where you and a friend can play on the same device. Simply select "Local Game" and take turns making moves.',
    value: 'item-2'
  },
  {
    question: 'How do the difficulty levels work?',
    answer:
      'The AI difficulty is controlled by adjusting how deep Stockfish analyzes positions. Lower levels play faster but weaker moves, while higher levels take more time to find stronger moves, simulating different skill levels from beginner to master.',
    value: 'item-3'
  },
  {
    question: 'What makes the audio experience special?',
    answer:
      'Zugklang (meaning "move sound" in German) features carefully designed audio feedback for every chess action. Different sounds for moves, captures, checks, and checkmates create an immersive playing experience.',
    value: 'item-4'
  },
  {
    question: 'Is my game data saved?',
    answer:
      'Currently, games are played in-session. Your preferences like board theme and color choice are saved in cookies for a personalized experience when you return.',
    value: 'item-5'
  },
  {
    question: 'Does it work on mobile devices?',
    answer:
      'Yes! Zugklang is fully responsive and works on phones, tablets, and desktop browsers. The interface adapts to provide the best experience on any screen size.',
    value: 'item-6'
  }
];
