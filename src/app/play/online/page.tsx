import Link from 'next/link';

export default function OnlinePage() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center gap-6'>
      <h1 className='text-3xl font-light'>Online</h1>
      <Link
        href='/play'
        className='text-muted-foreground hover:text-foreground transition-colors'
      >
        Back
      </Link>
    </main>
  );
}
