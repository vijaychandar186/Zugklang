import { Icons } from '@/components/Icons';
import type { MenuCardItem } from './play-modes';
export const cognitiveModes: MenuCardItem[] = [
  {
    href: '/practice/cognitive/memory',
    icon: Icons.engine,
    title: 'Memory',
    description:
      'Train your board vision by memorizing and recreating chess positions.',
    actionText: 'Start Training'
  },
  {
    href: '/practice/cognitive/vision',
    icon: Icons.target,
    title: 'Vision',
    description:
      'Train your board awareness by identifying coordinates and valid moves.',
    actionText: 'Start Training'
  }
];
