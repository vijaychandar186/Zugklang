'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/Icons';
import { CountryFlag } from '@/components/ui/country-flag';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import {
  getCountryDisplayName,
  normalizeFlagCode
} from '@/features/settings/flags';
type PlayerInfoProps = {
  name: string;
  subtitle?: string;
  isStockfish?: boolean;
  image?: string | null;
  rating?: number | null;
  flagCode?: string | null;
};
export function PlayerInfo({
  name,
  subtitle,
  isStockfish = false,
  image,
  rating,
  flagCode
}: PlayerInfoProps) {
  const initials =
    name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) ?? '?';
  const resolvedFlagCode = normalizeFlagCode(flagCode);
  const countryName = getCountryDisplayName(resolvedFlagCode);
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
            <Icons.player className='text-foreground h-5 w-5' />
          </AvatarFallback>
        )}
      </Avatar>
      <div>
        <div className='flex items-center gap-1.5'>
          <p className='font-semibold'>{name}</p>
          {!isStockfish && flagCode !== undefined && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <CountryFlag
                    code={resolvedFlagCode}
                    className='h-3.5 w-5 rounded-[2px] border border-black/10'
                    title={countryName}
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent>{countryName}</TooltipContent>
            </Tooltip>
          )}
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
