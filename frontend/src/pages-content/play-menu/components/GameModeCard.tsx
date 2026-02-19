import Link from 'next/link';
import { Icons, type LucideIcon } from '@/components/Icons';

interface GameModeCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  actionText: string;
  comingSoon?: boolean;
}

export function GameModeCard({
  href,
  icon: Icon,
  title,
  description,
  actionText,
  comingSoon = false
}: GameModeCardProps) {
  const CardContent = (
    <div className={`bg-card border-border h-full rounded-xl border p-4 transition-all ${
      comingSoon 
        ? 'opacity-60 cursor-not-allowed' 
        : 'hover:border-primary/50 hover:shadow-md'
    }`}>
      <div className='flex h-full flex-col gap-3'>
        <div className='flex items-start justify-between'>
          <div className={`w-fit rounded-lg p-2 ring-1 ${
            comingSoon 
              ? 'bg-muted text-muted-foreground ring-muted' 
              : 'bg-primary/10 text-primary ring-primary/20'
          }`}>
            <Icon className='h-5 w-5' />
          </div>
          <div className='flex items-center gap-2'>
            {comingSoon && (
              <span className='bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide'>
                Coming Soon
              </span>
            )}
            {!comingSoon && (
              <Icons.arrowUpRight className='text-muted-foreground h-4 w-4' />
            )}
          </div>
        </div>

        <div className='space-y-1'>
          <h2 className='text-base font-semibold tracking-tight'>{title}</h2>
          <p className='text-muted-foreground text-xs leading-relaxed'>
            {description}
          </p>
        </div>

        <div className={`mt-auto flex items-center text-xs font-medium ${
          comingSoon ? 'text-muted-foreground' : 'text-primary'
        }`}>
          <span className='underline-offset-4 group-hover:underline'>
            {comingSoon ? 'Coming Soon' : actionText}
          </span>
        </div>
      </div>
    </div>
  );

  if (comingSoon) {
    return <div className='block h-full'>{CardContent}</div>;
  }

  return (
    <Link href={href} className='group block h-full'>
      {CardContent}
    </Link>
  );
}

