import Link from 'next/link';
import { Icons } from '@/components/Icons';

export function PlayMenuHeader() {
  return (
    <div className='mb-6 space-y-3'>
      <Link
        href='/'
        className='text-muted-foreground hover:text-foreground group inline-flex items-center text-xs font-medium transition-colors'
      >
        <Icons.chevronLeft className='mr-1 h-3 w-3 transition-transform group-hover:-translate-x-1' />
        Back to Home
      </Link>
      <div className='space-y-1'>
        <h1 className='from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-2xl font-bold tracking-tight text-transparent md:text-3xl'>
          Select Game Mode
        </h1>
        <p className='text-muted-foreground max-w-2xl text-sm'>
          Choose your arena. Challenge the computer, play with a friend, or dive
          deep into analysis.
        </p>
      </div>
    </div>
  );
}
