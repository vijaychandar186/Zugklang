import { Icons } from '@/components/Icons';
import type { MenuCardItem } from './play-modes';

export const computerModes: MenuCardItem[] = [
  {
    href: '/play/computer/standard',
    icon: Icons.chessKing,
    title: 'Standard Chess',
    description:
      'Face Stockfish 16 at your chosen difficulty. Perfect your tactics and strategy.',
    actionText: 'Play Now'
  },
  {
    href: '/play/computer/fischer-random',
    icon: Icons.shuffle,
    title: 'Fischer Random (Chess960)',
    description:
      'Chess960 against the engine. Test your skills without opening preparation.',
    actionText: 'Play Now'
  }
];
