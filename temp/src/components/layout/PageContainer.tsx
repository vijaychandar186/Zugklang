import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

type PageContainerProps = {
  children: React.ReactNode;
  scrollable?: boolean;
  className?: string;
};

export function PageContainer({
  children,
  scrollable = true,
  className
}: PageContainerProps) {
  return scrollable ? (
    <ScrollArea className={cn('h-dvh', className)}>{children}</ScrollArea>
  ) : (
    <div className={className}>{children}</div>
  );
}
