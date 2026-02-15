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
  }
];
