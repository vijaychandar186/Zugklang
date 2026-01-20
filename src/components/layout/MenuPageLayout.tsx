import Link from 'next/link';
import { Icons, type LucideIcon } from '@/components/Icons';

interface MenuPageLayoutProps {
  icon: LucideIcon;
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
}

export function MenuPageLayout({
  icon: Icon,
  title,
  description,
  backHref = '/',
  backLabel = 'Back to Home',
  children
}: MenuPageLayoutProps) {
  return (
    <div className='bg-background relative flex h-full w-full flex-col'>
      <div className='mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6'>
        <div className='mb-6 space-y-3'>
          <Link
            href={backHref}
            className='text-muted-foreground hover:text-foreground group inline-flex items-center text-xs font-medium transition-colors'
          >
            <Icons.chevronLeft className='mr-1 h-3 w-3 transition-transform group-hover:-translate-x-1' />
            {backLabel}
          </Link>
          <div className='space-y-1'>
            <div className='flex items-center gap-3'>
              <div className='bg-primary/10 text-primary ring-primary/20 w-fit rounded-lg p-2 ring-1'>
                <Icon className='h-6 w-6' />
              </div>
              <h1 className='from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-2xl font-bold tracking-tight text-transparent md:text-3xl'>
                {title}
              </h1>
            </div>
            <p className='text-muted-foreground max-w-2xl text-sm'>
              {description}
            </p>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
