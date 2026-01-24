import Link from 'next/link';

export function Footer() {
  return (
    <footer className='py-8'>
      <div className='mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 text-center'>
        <div className='text-muted-foreground flex flex-wrap justify-center gap-6 text-sm'>
          <Link href='/play' className='hover:text-primary transition-colors'>
            Play
          </Link>
          <Link
            href='#features'
            className='hover:text-primary transition-colors'
          >
            Features
          </Link>
          <Link href='#faq' className='hover:text-primary transition-colors'>
            FAQ
          </Link>
        </div>
        <p className='text-muted-foreground text-xs'>
          © {new Date().getFullYear()} Zugklang
        </p>
      </div>
    </footer>
  );
}
