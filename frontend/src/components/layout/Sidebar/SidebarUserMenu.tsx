'use client';
import * as React from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ChevronUp, History, Settings, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
export default function SidebarUserMenu() {
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className='bg-muted h-8 w-full animate-pulse rounded-md' />
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }
  if (!session) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild size='sm' tooltip='Sign in'>
            <Link href='/signin'>
              <User />
              <span>Sign in</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }
  const initials =
    session.user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) ?? '?';
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              tooltip='Account'
            >
              <Avatar className='h-8 w-8 rounded-lg'>
                <AvatarImage
                  src={session.user?.image ?? ''}
                  alt={session.user?.name ?? ''}
                />
                <AvatarFallback className='rounded-lg'>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-medium'>
                  {session.user?.name ?? 'User'}
                </span>
                <span className='text-muted-foreground truncate text-xs'>
                  {session.user?.email ?? ''}
                </span>
              </div>
              <ChevronUp className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            side='bottom'
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='font-normal'>
              <div className='grid gap-0.5'>
                <span className='font-medium'>
                  {session.user?.name ?? 'User'}
                </span>
                <span className='text-muted-foreground text-xs'>
                  {session.user?.email ?? ''}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className='cursor-pointer'>
              <Link href='/profile'>
                <User className='mr-2 h-4 w-4' />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className='cursor-pointer'>
              <Link href='/history'>
                <History className='mr-2 h-4 w-4' />
                History
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className='cursor-pointer'>
              <Link href='/settings'>
                <Settings className='mr-2 h-4 w-4' />
                Settings
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
