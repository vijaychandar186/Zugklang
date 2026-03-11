'use client';
import { Search } from 'lucide-react';
import { useKBar } from 'kbar';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
export default function SidebarSearchButton() {
  const { query } = useKBar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='sm'
          tooltip='Search (Ctrl/Cmd+K)'
          onClick={query.toggle}
        >
          <Search />
          <span>Search</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
