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
  }
];
