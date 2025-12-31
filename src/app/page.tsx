import Link from 'next/link';

export default function Page() {
  return (
    <main className='space-y-4'>
      <h1>Landing Page</h1>

      <Link href='/play/computer'>Play vs Computer</Link>
    </main>
  );
}
