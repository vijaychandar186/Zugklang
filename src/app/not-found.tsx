'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className='absolute inset-0 flex items-center justify-center'>
      <div className='flex max-w-xl flex-col items-center justify-center text-center'>
        <span className='from-foreground bg-linear-to-b to-transparent bg-clip-text text-[7rem] leading-none font-extrabold text-transparent'>
          ♚
        </span>

        <h2 className='mt-4 text-2xl font-bold tracking-tight'>
          Illegal Move — Page Not Found
        </h2>

        <p className='text-muted-foreground mt-2 max-w-md'>
          The URL you entered doesn’t point to a valid square on this board. The
          page may have been moved, renamed, or never existed.
        </p>

        <div className='mt-8 flex justify-center gap-3'>
          <Button onClick={() => router.back()} size='lg'>
            Undo Move
          </Button>

          <Button onClick={() => router.push('/')} variant='ghost' size='lg'>
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}
