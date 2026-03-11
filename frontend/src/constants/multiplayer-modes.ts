import { Icons } from '@/components/Icons';
import type { MenuCardItem } from './play-modes';
export const multiplayerModes: MenuCardItem[] = [
  {
    href: '/play/multiplayer/standard',
    icon: Icons.chessKing,
    title: 'Standard Chess',
    description:
      'Classic chess rules. Get matched with a random online opponent instantly.',
    actionText: 'Find Game'
  },
  {
    href: '/play/multiplayer/fischer-random',
    icon: Icons.shuffle,
    title: 'Fischer Random (Chess960)',
    description:
      'Randomized starting positions shared with your opponent. No opening theory.',
    actionText: 'Find Game'
  },
  {
    href: '/play/multiplayer/atomic',
    icon: Icons.radiation,
    title: 'Atomic Chess',
    description:
      'Captures cause explosions! Play the volatile variant against a live opponent.',
    actionText: 'Find Game'
  },
  {
    href: '/play/multiplayer/racing-kings',
    icon: Icons.carFront,
    title: 'Racing Kings',
    description:
      'Race your king to the eighth rank. No checks allowed! Play online.',
    actionText: 'Find Game'
  },
  {
    href: '/play/multiplayer/horde',
    icon: Icons.brickWall,
    title: 'Horde Chess',
    description:
      'One player controls the massive pawn army, the other defends with pieces.',
    actionText: 'Find Game'
  },
  {
    href: '/play/multiplayer/three-check',
    icon: Icons.listChecks,
    title: 'Three-Check',
    description:
      'Give three checks to win! A fast and aggressive online variant.',
    actionText: 'Find Game'
  },
  {
    href: '/play/multiplayer/antichess',
    icon: Icons.skull,
    title: 'Antichess',
    description:
      'Lose all your pieces to win. Captures are mandatory — play online.',
    actionText: 'Find Game'
  },
  {
    href: '/play/multiplayer/king-of-the-hill',
    icon: Icons.mountain,
    title: 'King of the Hill',
    description:
      'Get your king to the center to win. Online play with an extra victory condition.',
    actionText: 'Find Game'
  },
  {
    href: '/play/multiplayer/crazyhouse',
    icon: Icons.recycle,
    title: 'Crazyhouse',
    description:
      'Captured pieces switch sides and can be dropped back on the board!',
    actionText: 'Find Game'
  },
  {
    href: '/play/multiplayer/checkers-chess',
    icon: Icons.circle,
    title: 'Chess with Checkers',
    description:
      'All pieces look like checkers but move as regular chess pieces. Play online!',
    actionText: 'Find Game'
  }
];
