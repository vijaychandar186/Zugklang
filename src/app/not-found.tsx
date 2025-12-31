'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className='absolute inset-0 flex items-center justify-center'>
      <div className='flex max-w-xl flex-col items-center justify-center text-center'>
        <span className='from-foreground bg-linear-to-b to-transparent bg-clip-text text-[7rem] leading-none font-extrabold text-transparent'>
          ♚ Checkmate
        </span>

        <h2 className='mt-4 text-2xl font-bold tracking-tight'>Illegal Move</h2>

        <p className='text-muted-foreground mt-2 max-w-md'>
          This square doesn’t exist on the board. The position you’re looking
          for is lost or has been moved.
        </p>

        <div className='mt-8 flex justify-center gap-3'>
          <Button onClick={() => router.back()} size='lg'>
            Undo Move
          </Button>

          <Button onClick={() => router.push('/')} variant='ghost' size='lg'>
            New Game
          </Button>
        </div>
      </div>
    </div>
  );
}
