'use client';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
export interface SidebarPanelProps {
  children: ReactNode;
  className?: string;
  flexible?: boolean;
  /**
   * Makes the panel fill the sidebar column height (lg:h-full).
   * Use for the primary game sidebar panel in GameShell-based layouts.
   */
  fullHeight?: boolean;
}
export function SidebarPanel({
  children,
  className,
  flexible = false,
  fullHeight = false
}: SidebarPanelProps) {
  return (
    <div
      className={cn(
        'bg-card rounded-lg border',
        flexible && 'flex min-h-[200px] flex-col lg:min-h-0 lg:flex-1',
        fullHeight && 'flex min-h-[300px] flex-col lg:h-full',
        !flexible && !fullHeight && 'shrink-0',
        className
      )}
    >
      {children}
    </div>
  );
}
