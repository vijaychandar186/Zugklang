import * as React from 'react';
import { cookies } from 'next/headers';
import { SidebarSectionShell } from '@/components/layout/Sidebar';
export default async function PracticeLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';
  return (
    <SidebarSectionShell section='practice' defaultOpen={defaultOpen}>
      {children}
    </SidebarSectionShell>
  );
}
