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
  },
  {
    href: '/play/computer/atomic',
    icon: Icons.radiation,
    title: 'Atomic Chess',
    description:
      'Explosive chess against Fairy-Stockfish. Captures destroy surrounding pieces!',
    actionText: 'Play Now'
  },
  {
    href: '/play/computer/racing-kings',
    icon: Icons.carFront,
    title: 'Racing Kings',
    description:
      'Race your king to the eighth rank against Fairy-Stockfish. No checks allowed!',
    actionText: 'Play Now'
  },
  {
    href: '/play/computer/horde',
    icon: Icons.brickWall,
    title: 'Horde Chess',
    description:
      'A massive pawn army vs a full set of pieces. Can the horde overwhelm the defense?',
    actionText: 'Play Now'
  },
  {
    href: '/play/computer/three-check',
    icon: Icons.listChecks,
    title: 'Three-Check',
    description:
      'Give three checks to win! Standard chess with an explosive twist against Fairy-Stockfish.',
    actionText: 'Play Now'
  },
  {
    href: '/play/computer/antichess',
    icon: Icons.skull,
    title: 'Antichess',
    description:
      'Lose all your pieces to win! Captures are mandatory in this reverse chess variant.',
    actionText: 'Play Now'
  },
  {
    href: '/play/computer/king-of-the-hill',
    icon: Icons.mountain,
    title: 'King of the Hill',
    description:
      'Get your king to the center to win! Standard rules plus a new victory condition.',
    actionText: 'Play Now'
  },
  {
    href: '/play/computer/crazyhouse',
    icon: Icons.recycle,
    title: 'Crazyhouse',
    description:
      'Captured pieces switch sides and can be dropped back on the board!',
    actionText: 'Play Now'
  },
  {
    href: '/play/computer/checkers-chess',
    icon: Icons.circle,
    title: 'Chess with Checkers',
    description:
      'All pieces look like checkers but move as regular chess pieces. A fun visual twist!',
    actionText: 'Play Now'
  }
];
