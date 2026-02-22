'use client';

import * as React from 'react';
import { Icons } from '@/components/Icons';
import ThemeToggle from '@/components/layout/Theme/ThemeToggle';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';

export default function SidebarThemeButton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <ThemeToggle
          trigger={
            <SidebarMenuButton
              size='sm'
              tooltip='Select Theme'
              className='text-sidebar-foreground hover:text-sidebar-accent-foreground active:text-sidebar-accent-foreground data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:text-sidebar-accent-foreground'
            >
              <Icons.moon className='h-4 w-4' />
              <span>Theme</span>
            </SidebarMenuButton>
          }
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
