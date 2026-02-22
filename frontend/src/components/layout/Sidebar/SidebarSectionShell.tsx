'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import AppSidebar from '@/components/layout/Sidebar/AppSidebar';
import { useInfobar } from '@/components/ui/infobar';
import {
  useSidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';

type SidebarSection = 'play' | 'practice' | 'tools';

interface SidebarSectionShellProps {
  children: React.ReactNode;
  section: SidebarSection;
  defaultOpen: boolean;
}

function SidebarSectionContent({ children }: { children: React.ReactNode }) {
  const {
    open: infobarOpen,
    openMobile: infobarOpenMobile,
    setOpen: setInfobarOpen,
    setOpenMobile: setInfobarOpenMobile
  } = useInfobar();
  const {
    open: sidebarOpen,
    openMobile: sidebarOpenMobile,
    setOpen: setSidebarOpen,
    setOpenMobile: setSidebarOpenMobile
  } = useSidebar();
  const isInfobarVisible = infobarOpen || infobarOpenMobile;
  const isSidebarVisible = sidebarOpen || sidebarOpenMobile;
  const prevInfobarVisibleRef = React.useRef(isInfobarVisible);
  const prevSidebarVisibleRef = React.useRef(isSidebarVisible);

  React.useEffect(() => {
    const infobarJustOpened =
      !prevInfobarVisibleRef.current && isInfobarVisible;
    const sidebarJustOpened =
      !prevSidebarVisibleRef.current && isSidebarVisible;

    if (infobarJustOpened) {
      setSidebarOpen(false);
      setSidebarOpenMobile(false);
    }

    if (sidebarJustOpened) {
      setInfobarOpen(false);
      setInfobarOpenMobile(false);
    }

    prevInfobarVisibleRef.current = isInfobarVisible;
    prevSidebarVisibleRef.current = isSidebarVisible;
  }, [
    isInfobarVisible,
    isSidebarVisible,
    setInfobarOpen,
    setInfobarOpenMobile,
    setSidebarOpen,
    setSidebarOpenMobile
  ]);

  return (
    <SidebarInset className='min-h-svh'>
      <div className='pointer-events-none absolute top-3 left-3 z-30 hidden md:block'>
        <SidebarTrigger className='bg-background/90 pointer-events-auto border backdrop-blur' />
      </div>
      <div className='bg-background/95 sticky top-0 z-20 flex h-12 items-center border-b px-3 backdrop-blur md:hidden'>
        <SidebarTrigger />
      </div>
      <div className='h-[calc(100svh-3rem)] md:h-svh'>{children}</div>
    </SidebarInset>
  );
}

function shouldShowSidebar(pathname: string, section: SidebarSection): boolean {
  if (section === 'tools') {
    return pathname !== '/tools' && pathname !== '/tools/';
  }

  const segments = pathname.split('/').filter(Boolean);
  return segments[0] === section && segments.length >= 3;
}

export default function SidebarSectionShell({
  children,
  section,
  defaultOpen
}: SidebarSectionShellProps) {
  const pathname = usePathname();
  const showSidebar = shouldShowSidebar(pathname, section);

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarSectionContent>{children}</SidebarSectionContent>
    </SidebarProvider>
  );
}
