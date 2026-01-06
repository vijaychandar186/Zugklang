'use client';

import Link from 'next/link';
import { Crown } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className='bg-card/50 border-t'>
      <div className='container py-12'>
        <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
          <div className='space-y-4'>
            <Link href='/' className='flex items-center gap-2'>
              <Crown className='text-primary h-6 w-6' />
              <span className='text-lg font-bold'>Zugklang</span>
            </Link>
            <p className='text-muted-foreground text-sm'>
              Where strategy meets symphony. Experience chess with immersive
              audio and premium aesthetics.
            </p>
          </div>

          <div className='space-y-4'>
            <h3 className='font-semibold'>Play</h3>
            <nav className='text-muted-foreground flex flex-col gap-2 text-sm'>
              <Link
                href='/play'
                className='hover:text-primary transition-colors'
              >
                vs Computer
              </Link>
              <Link
                href='/play/local'
                className='hover:text-primary transition-colors'
              >
                Local Game
              </Link>
            </nav>
          </div>

          <div className='space-y-4'>
            <h3 className='font-semibold'>Learn More</h3>
            <nav className='text-muted-foreground flex flex-col gap-2 text-sm'>
              <Link
                href='#features'
                className='hover:text-primary transition-colors'
              >
                Features
              </Link>
              <Link
                href='#faq'
                className='hover:text-primary transition-colors'
              >
                FAQ
              </Link>
            </nav>
          </div>

          <div className='space-y-4'>
            <h3 className='font-semibold'>Technology</h3>
            <nav className='text-muted-foreground flex flex-col gap-2 text-sm'>
              <span>Stockfish 16</span>
              <span>Next.js</span>
              <span>WebAssembly</span>
            </nav>
          </div>
        </div>

        <div className='text-muted-foreground mt-12 border-t pt-8 text-center text-sm'>
          <p>© {new Date().getFullYear()} Zugklang. Open source chess.</p>
        </div>
      </div>
    </footer>
  );
};
