'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Swords } from 'lucide-react';
import {
  HERO_TEXT,
  HERO_BACKGROUND_CLIP_PATH
} from '@/features/landing/content/hero';

export const Hero = () => {
  return (
    <section className='relative isolate overflow-hidden py-16 md:py-32'>
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80'
      >
        <div
          style={{ clipPath: HERO_BACKGROUND_CLIP_PATH }}
          className='from-primary/40 to-primary/20 relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]'
        />
      </div>

      <div className='container flex flex-col items-center gap-8 text-center'>
        <div className='border-primary/20 bg-primary/5 text-primary/80 inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium backdrop-blur-md'>
          <span className='mr-2 flex h-2 w-2'>
            <span className='bg-primary absolute inline-flex h-2 w-2 animate-ping rounded-full opacity-75'></span>
            <span className='bg-primary relative inline-flex h-2 w-2 rounded-full'></span>
          </span>
          Powered by Stockfish 16
        </div>

        <div className='space-y-4'>
          <h1 className='text-5xl font-black tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl'>
            <span className='from-foreground to-foreground/50 bg-gradient-to-br bg-clip-text text-transparent'>
              {HERO_TEXT.title}
            </span>
          </h1>
          <p className='text-muted-foreground text-xl font-medium md:text-2xl'>
            {HERO_TEXT.subtitle}
          </p>
        </div>

        <p className='text-muted-foreground mx-auto max-w-2xl text-base leading-relaxed md:text-lg'>
          {HERO_TEXT.description}
        </p>

        <div className='flex flex-col gap-4 sm:flex-row'>
          <Link href='/play'>
            <Button
              size='lg'
              className='shadow-primary/20 hover:shadow-primary/40 h-12 rounded-full px-8 text-base font-semibold shadow-lg transition-all hover:scale-105 active:scale-95'
            >
              {HERO_TEXT.buttonText}
              <ArrowRight className='ml-2 h-5 w-5' />
            </Button>
          </Link>
          <Link href='/play/local'>
            <Button
              size='lg'
              variant='outline'
              className='border-primary/20 bg-background/50 hover:border-primary/50 hover:bg-accent/50 h-12 rounded-full px-8 text-base backdrop-blur-sm transition-all hover:scale-105 active:scale-95'
            >
              Local Game
              <Swords className='ml-2 h-5 w-5' />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
