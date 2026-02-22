'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Icons } from '@/components/Icons';
import ThemeToggle from '@/components/layout/ThemeToggle/theme-toggle';
import SearchInput from '@/components/layout/Kbar/SearchInput';
import SchemeButton from '@/components/layout/SchemeButton';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/layout/UserMenu';
interface RouteProps {
  href: string;
  label: string;
}
const routeList: RouteProps[] = [
  { href: '/play', label: 'Play' },
  { href: '/tools', label: 'Tools' },
  { href: '/practice', label: 'Practice' }
];
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className='border-border/40 bg-background/80 sticky top-0 z-40 w-full border-b backdrop-blur-md'>
      <div className='flex h-14 w-full items-center justify-between px-4 lg:px-6'>
        <Link href='/' className='flex items-center gap-2'>
          <Icons.crown className='text-primary h-8 w-8' />
          <span className='text-lg font-bold tracking-tight'>Zugklang</span>
        </Link>

        <nav className='hidden items-center gap-6 md:flex'>
          {routeList.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith(href)
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className='hidden items-center gap-3 md:flex'>
          <SearchInput />
          <SchemeButton />
          <ThemeToggle />
          <UserMenu />
        </div>

        <div className='flex items-center gap-2 md:hidden'>
          <SearchInput />
          <SchemeButton />
          <ThemeToggle />

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon' className='h-9 w-9'>
                <Icons.menu className='h-5 w-5' />
                <span className='sr-only'>Toggle Menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent side='right' className='w-[280px] px-6'>
              <SheetHeader className='pb-4'>
                <SheetTitle className='flex items-center gap-2 text-left'>
                  <Icons.crown className='text-primary h-6 w-6' />
                  <span className='font-bold'>Zugklang</span>
                </SheetTitle>
              </SheetHeader>

              <nav className='mt-6 flex flex-col gap-5'>
                {routeList.map(({ href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium transition-colors ${
                      pathname.startsWith(href)
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                  >
                    {label}
                  </Link>
                ))}

                <div className='mt-4' onClick={() => setIsOpen(false)}>
                  <UserMenu />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
