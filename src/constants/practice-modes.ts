import { Icons } from '@/components/Icons';
import type { MenuCardItem } from './play-modes';

export const practiceModes: MenuCardItem[] = [
  {
    href: '/practice/learn',
    icon: Icons.book,
    title: 'Learn',
    description:
      'Study chess concepts, openings, endgames, and more. Build foundational knowledge.',
    actionText: 'Start Learning',
    comingSoon: true
  },
  {
    href: '/practice/puzzles',
    icon: Icons.puzzle,
    title: 'Puzzles',
    description:
      'Solve tactical puzzles to sharpen your pattern recognition and calculation.',
    actionText: 'Solve Puzzles'
  },
  {
    href: '/practice/memory',
    icon: Icons.engine,
    title: 'Memory',
    description:
      'Train your board vision by memorizing and recreating chess positions.',
    actionText: 'Start Training'
  },
  {
    href: '/practice/vision',
    icon: Icons.target,
    title: 'Vision',
    description:
      'Train your board awareness by identifying coordinates and valid moves.',
    actionText: 'Start Training'
  }
];
