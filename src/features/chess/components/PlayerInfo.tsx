'use client';

import { Icons } from '@/components/Icons';

type PlayerInfoProps = {
  name: string;
  subtitle?: string;
  isStockfish?: boolean;
};

export function PlayerInfo({
  name,
  subtitle,
  isStockfish = false
}: PlayerInfoProps) {
  return (
    <div className='flex items-center gap-2'>
      <div className='bg-muted flex h-10 w-10 items-center justify-center rounded-full'>
        {isStockfish ? (
          <Icons.stockfish className='h-5 w-5' />
        ) : (
          <Icons.player className='h-5 w-5' />
        )}
      </div>
      <div>
        <p className='font-semibold'>{name}</p>
        {subtitle && (
          <p className='text-muted-foreground text-xs'>{subtitle}</p>
        )}
      </div>
    </div>
  );
}
