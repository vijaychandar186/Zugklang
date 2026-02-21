'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/Icons';

type PlayerInfoProps = {
  name: string;
  subtitle?: string;
  isStockfish?: boolean;
  image?: string | null;
  rating?: number | null;
};

export function PlayerInfo({
  name,
  subtitle,
  isStockfish = false,
  image,
  rating
}: PlayerInfoProps) {
  const initials =
    name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) ?? '?';

  return (
    <div className='flex items-center gap-2'>
      <Avatar className='h-10 w-10'>
        {isStockfish ? (
          <AvatarFallback className='bg-muted'>
            <Icons.stockfish className='h-5 w-5' />
          </AvatarFallback>
        ) : image ? (
          <>
            <AvatarImage src={image} alt={name} />
            <AvatarFallback className='bg-muted'>{initials}</AvatarFallback>
          </>
        ) : (
          <AvatarFallback className='bg-muted'>
            <Icons.player className='h-5 w-5' />
          </AvatarFallback>
        )}
      </Avatar>
      <div>
        <div className='flex items-center gap-1.5'>
          <p className='font-semibold'>{name}</p>
          {rating != null && (
            <span className='text-muted-foreground font-mono text-xs'>
              ({rating})
            </span>
          )}
        </div>
        {subtitle && (
          <p className='text-muted-foreground text-xs'>{subtitle}</p>
        )}
      </div>
    </div>
  );
}
