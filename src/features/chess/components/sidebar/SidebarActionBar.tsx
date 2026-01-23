'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface SidebarActionBarProps {
  leftActions?: ReactNode;
  rightActions?: ReactNode;
  className?: string;
}

export function SidebarActionBar({
  leftActions,
  rightActions,
  className
}: SidebarActionBarProps) {
  return (
    <div
      className={cn(
        'bg-muted/50 flex items-center justify-between border-t p-2',
        className
      )}
    >
      <div className='flex items-center gap-1'>{leftActions}</div>
      <div className='flex items-center gap-1'>{rightActions}</div>
    </div>
  );
}
