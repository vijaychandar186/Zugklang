'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface SidebarPanelProps {
  children: ReactNode;
  className?: string;
  flexible?: boolean;
}

export function SidebarPanel({
  children,
  className,
  flexible = false
}: SidebarPanelProps) {
  return (
    <div
      className={cn(
        'bg-card rounded-lg border',
        flexible
          ? 'flex min-h-[200px] flex-col lg:min-h-0 lg:flex-1'
          : 'shrink-0',
        className
      )}
    >
      {children}
    </div>
  );
}
