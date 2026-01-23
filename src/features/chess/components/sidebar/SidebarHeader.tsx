'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface SidebarHeaderProps {
  title: string;
  actions?: ReactNode;
  className?: string;
}

export function SidebarHeader({
  title,
  actions,
  className
}: SidebarHeaderProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-between border-b px-4 py-3',
        className
      )}
    >
      <h3 className='font-semibold'>{title}</h3>
      {actions && <div className='flex items-center gap-1'>{actions}</div>}
    </div>
  );
}
