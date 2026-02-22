'use client';

import KBar from '@/components/layout/Kbar';
import { InfoSidebar } from '@/components/layout/Sidebar';
import { InfobarProvider } from '@/components/ui/infobar';

interface KbarProviderProps {
  children: React.ReactNode;
}

export function KbarProvider({ children }: KbarProviderProps) {
  return (
    <InfobarProvider defaultOpen={false}>
      <KBar>
        <div className='flex min-h-svh w-full flex-1 flex-col'>{children}</div>
        <InfoSidebar side='right' />
      </KBar>
    </InfobarProvider>
  );
}
