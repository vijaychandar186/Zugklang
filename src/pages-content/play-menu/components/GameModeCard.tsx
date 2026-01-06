import Link from 'next/link';
import { Icons, type LucideIcon } from '@/components/Icons';

interface GameModeCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  actionText: string;
}

export function GameModeCard({
  href,
  icon: Icon,
  title,
  description,
  actionText
}: GameModeCardProps) {
  return (
    <Link href={href} className='group block h-full'>
      <div className='bg-card border-border hover:border-primary/50 h-full rounded-2xl border p-6 transition-all hover:shadow-md md:p-8'>
        <div className='flex h-full flex-col gap-6'>
          <div className='flex items-start justify-between'>
            <div className='bg-primary/10 text-primary ring-primary/20 w-fit rounded-xl p-3 ring-1'>
              <Icon className='h-8 w-8' />
            </div>
            <Icons.arrowUpRight className='text-muted-foreground h-5 w-5' />
          </div>

          <div className='space-y-2'>
            <h2 className='text-2xl font-bold tracking-tight'>{title}</h2>
            <p className='text-muted-foreground leading-relaxed'>
              {description}
            </p>
          </div>

          <div className='text-primary mt-auto flex items-center pt-4 text-sm font-medium'>
            <span className='underline-offset-4 group-hover:underline'>
              {actionText}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
