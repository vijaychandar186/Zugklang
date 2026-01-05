import Link from 'next/link';

export default function PlayPage() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center gap-8'>
      <h1 className='text-3xl font-light'>Play</h1>

      <nav className='flex gap-6'>
        <Link
          href='/play/computer'
          className='border-border border px-6 py-3 transition-colors'
        >
          Computer
        </Link>
      </nav>

      <Link
        href='/'
        className='text-muted-foreground hover:text-foreground transition-colors'
      >
        Back
      </Link>
    </main>
  );
}
