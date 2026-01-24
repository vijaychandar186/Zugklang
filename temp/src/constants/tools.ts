import { Icons } from '@/components/Icons';
import type { MenuCardItem } from './play-modes';

export const tools: MenuCardItem[] = [
  {
    href: '/tools/analysis',
    icon: Icons.microscope,
    title: 'Analysis Board',
    description:
      'Analyze positions with Stockfish. Import PGNs, set up positions, and explore variations.',
    actionText: 'Start Analysis'
  },
  {
    href: '/tools/game-review',
    icon: Icons.circlestar,
    title: 'Game Review',
    description:
      'Review your games move by move. Get accuracy scores and learn from mistakes.',
    actionText: 'Review Game'
  }
];
