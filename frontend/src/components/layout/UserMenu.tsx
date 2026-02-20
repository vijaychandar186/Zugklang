'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { LogOut, User, History } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className='bg-muted h-8 w-8 animate-pulse rounded-full' />;
  }

  if (!session) {
    return (
      <Link href='/signin'>
        <Button className='font-medium'>Get Started</Button>
      </Link>
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='ring-offset-background focus-visible:ring-ring flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2'>
          <Avatar className='h-8 w-8'>
            <AvatarImage
              src={session.user?.image ?? ''}
              alt={session.user?.name ?? ''}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='w-56' align='end' sideOffset={8}>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col gap-0.5'>
            <span className='text-sm font-semibold'>
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
          <Link href='/games'>
            <History className='mr-2 h-4 w-4' />
            Game History
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='text-destructive focus:text-destructive cursor-pointer'
          onClick={() => signOut()}
        >
          <LogOut className='mr-2 h-4 w-4' />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
