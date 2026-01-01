import Link from 'next/link';

export default function Page() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center gap-12'>
      <h1 className='text-4xl font-light tracking-widest uppercase'>
        Zugklang
      </h1>

      <nav className='flex gap-8'>
        <Link
          href='/play'
          className='border-border border px-6 py-3 transition-colors'
        >
          Play
        </Link>

        <Link
          href='/analysis'
          className='border-border border px-6 py-3 transition-colors'
        >
          Analysis
        </Link>

        <Link
          href='/openings'
          className='border-border border px-6 py-3 transition-colors'
        >
          Openings
        </Link>

        <Link
          href='/variants'
          className='border-border border px-6 py-3 transition-colors'
        >
          Variants
        </Link>
      </nav>
    </main>
  );
}
