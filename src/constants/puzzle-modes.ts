import { Icons } from '@/components/Icons';
import type { MenuCardItem } from './play-modes';

export const puzzleModes: MenuCardItem[] = [
  {
    href: '/practice/puzzles/standard',
    icon: Icons.turtle,
    title: 'Standard',
    description:
      'Solve puzzles at your own pace. Track your progress across different difficulty levels.',
    actionText: 'Start Solving'
  },
  {
    href: '/practice/puzzles/rush',
    icon: Icons.zap,
    title: 'Puzzle Rush',
    description:
      'Race against the clock or survive as long as you can. How many can you solve?',
    actionText: 'Start Rush'
  }
];
