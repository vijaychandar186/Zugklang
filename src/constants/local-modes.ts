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
  },
  {
    href: '/play/local/horde',
    icon: Icons.brickWall,
    title: 'Horde Chess',
    description:
      'A massive pawn army vs a full set of pieces. Can the horde overwhelm the defense?',
    actionText: 'Play Now'
  },
  {
    href: '/play/local/three-check',
    icon: Icons.listChecks,
    title: 'Three-Check',
    description:
      'Give three checks to win! Standard chess with an explosive twist.',
    actionText: 'Play Now'
  },
  {
    href: '/play/local/antichess',
    icon: Icons.skull,
    title: 'Antichess',
    description:
      'Lose all your pieces to win! Captures are mandatory in this reverse chess variant.',
    actionText: 'Play Now'
  },
  {
    href: '/play/local/king-of-the-hill',
    icon: Icons.mountain,
    title: 'King of the Hill',
    description:
      'Get your king to the center to win! Standard rules plus a new victory condition.',
    actionText: 'Play Now'
  }
];
