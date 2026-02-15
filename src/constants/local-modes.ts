import { Icons } from '@/components/Icons';
import type { MenuCardItem } from './play-modes';

export const localModes: MenuCardItem[] = [
  {
    href: '/play/local/standard',
    icon: Icons.chessKing,
    title: 'Standard Chess',
    description:
      'Classic chess rules. The timeless game of strategy and tactics.',
    actionText: 'Play Now'
  },
  {
    href: '/play/local/fischer-random',
    icon: Icons.shuffle,
    title: 'Fischer Random (Chess960)',
    description:
      'Randomized starting positions. No opening theory, pure skill and creativity.',
    actionText: 'Play Now'
  },
  {
    href: '/play/local/atomic',
    icon: Icons.radiation,
    title: 'Atomic Chess',
    description:
      'Captures cause explosions! Pieces around the capture square are destroyed.',
    actionText: 'Play Now'
  },
  {
    href: '/play/local/racing-kings',
    icon: Icons.carFront,
    title: 'Racing Kings',
    description: 'Race your king to the eighth rank. No checks allowed!',
    actionText: 'Play Now'
  }
];
