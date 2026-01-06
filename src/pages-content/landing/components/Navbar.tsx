'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Icons } from '@/components/Icons';
import ThemeToggle from '@/components/layout/ThemeToggle/theme-toggle';
import { Button } from '@/components/ui/button';

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  { href: '#features', label: 'Features' },
  { href: '#faq', label: 'FAQ' }
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className='border-border/40 bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur-md'>
      <div className='mx-auto flex h-14 max-w-7xl items-center justify-between px-4'>
        <Link href='/' className='flex items-center gap-2'>
          <Icons.crown className='text-primary h-8 w-8' />
          <span className='text-lg font-bold tracking-tight'>Zugklang</span>
        </Link>

        <nav className='hidden items-center gap-6 md:flex'>
          {routeList.map(({ href, label }) => (
            <Link
              href={href}
              key={label}
              className='text-muted-foreground hover:text-primary text-sm font-medium transition-colors'
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className='hidden items-center gap-3 md:flex'>
          <ThemeToggle />
          <Link href='/play'>
            <Button className='font-medium'>Play Now</Button>
          </Link>
        </div>

        <div className='flex items-center gap-2 md:hidden'>
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon' className='h-9 w-9'>
                <Icons.menu className='h-5 w-5' />
                <span className='sr-only'>Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-[280px]'>
              <SheetHeader>
                <SheetTitle className='flex items-center gap-2 text-left'>
                  <Icons.crown className='text-primary h-6 w-6' />
                  <span className='font-bold'>Zugklang</span>
                </SheetTitle>
              </SheetHeader>
              <nav className='mt-8 flex flex-col gap-4'>
                {routeList.map(({ href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className='text-muted-foreground hover:text-primary text-lg font-medium transition-colors'
                  >
                    {label}
                  </Link>
                ))}
                <Link
                  href='/play'
                  className='mt-4'
                  onClick={() => setIsOpen(false)}
                >
                  <Button className='w-full font-medium'>Play Now</Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
