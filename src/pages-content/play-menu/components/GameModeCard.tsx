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
      <div className='bg-card border-border hover:border-primary/50 h-full rounded-xl border p-4 transition-all hover:shadow-md'>
        <div className='flex h-full flex-col gap-3'>
          <div className='flex items-start justify-between'>
            <div className='bg-primary/10 text-primary ring-primary/20 w-fit rounded-lg p-2 ring-1'>
              <Icon className='h-5 w-5' />
            </div>
            <Icons.arrowUpRight className='text-muted-foreground h-4 w-4' />
          </div>

          <div className='space-y-1'>
            <h2 className='text-base font-semibold tracking-tight'>{title}</h2>
            <p className='text-muted-foreground text-xs leading-relaxed'>
              {description}
            </p>
          </div>

          <div className='text-primary mt-auto flex items-center text-xs font-medium'>
            <span className='underline-offset-4 group-hover:underline'>
              {actionText}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
