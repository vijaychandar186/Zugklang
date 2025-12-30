import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export default function PageContainer({
  children,
  scrollable = true,
  className
}: {
  children: React.ReactNode;
  scrollable?: boolean;
  className?: string;
}) {
  return scrollable ? (
    <ScrollArea className={cn('h-dvh', className)}>{children}</ScrollArea>
  ) : (
    <div className={className}>{children}</div>
  );
}
