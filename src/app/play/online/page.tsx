'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function OnlinePage() {
  const [gameCode, setGameCode] = useState('');

  return (
    <main className='flex min-h-screen flex-col items-center justify-center gap-8 p-6'>
      <div className='w-full max-w-2xl space-y-8'>
        <div className='space-y-2 text-center'>
          <h1 className='text-4xl font-light tracking-wide'>
            Online Multiplayer
          </h1>
          <p className='text-muted-foreground'>
            Play chess online with friends or random opponents
          </p>
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
          {/* Create Game */}
          <div className='border-border space-y-4 rounded-lg border p-6'>
            <h2 className='text-2xl font-light'>Create Game</h2>
            <p className='text-muted-foreground text-sm'>
              Start a new game and share the code with a friend
            </p>
            <Button className='w-full' size='lg' disabled>
              Create Game
              <span className='ml-2 text-xs opacity-70'>(Coming Soon)</span>
            </Button>
          </div>

          {/* Join Game */}
          <div className='border-border space-y-4 rounded-lg border p-6'>
            <h2 className='text-2xl font-light'>Join Game</h2>
            <p className='text-muted-foreground text-sm'>
              Enter a game code to join an existing game
            </p>
            <div className='space-y-3'>
              <input
                type='text'
                placeholder='Enter game code'
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                className='border-border bg-background focus:ring-primary w-full rounded-md border px-4 py-2 focus:ring-2 focus:outline-none'
                maxLength={6}
                disabled
              />
              <Button className='w-full' size='lg' disabled>
                Join Game
                <span className='ml-2 text-xs opacity-70'>(Coming Soon)</span>
              </Button>
            </div>
          </div>
        </div>

        <div className='border-border space-y-4 rounded-lg border p-6'>
          <h2 className='text-2xl font-light'>Quick Match</h2>
          <p className='text-muted-foreground text-sm'>
            Get matched with a random opponent based on your skill level
          </p>
          <div className='flex gap-4'>
            <Button className='flex-1' size='lg' disabled>
              Bullet (1+0)
              <span className='ml-2 text-xs opacity-70'>(Soon)</span>
            </Button>
            <Button className='flex-1' size='lg' disabled>
              Blitz (3+0)
              <span className='ml-2 text-xs opacity-70'>(Soon)</span>
            </Button>
            <Button className='flex-1' size='lg' disabled>
              Rapid (10+0)
              <span className='ml-2 text-xs opacity-70'>(Soon)</span>
            </Button>
          </div>
        </div>

        <div className='text-center'>
          <p className='text-muted-foreground mb-4 text-sm'>
            Online multiplayer requires server infrastructure and is currently
            in development.
            <br />
            For now, you can play against the computer or use local
            pass-and-play.
          </p>
          <Link
            href='/play'
            className='text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors'
          >
            Back to Play Menu
          </Link>
        </div>
      </div>
    </main>
  );
}
