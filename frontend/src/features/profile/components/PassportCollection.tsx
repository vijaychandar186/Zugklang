import { Badge } from '@/components/ui/badge';
import { CountryFlag } from '@/components/ui/country-flag';
import { FLAG_OPTIONS, normalizeFlagCode } from '@/features/settings/flags';
import { cn } from '@/lib/utils';

type PassportCollectionProps = {
  collectedFlagCodes: string[];
};

function resolveCountryName(
  regionNames: Intl.DisplayNames | null,
  code: string
): string {
  if (code.length !== 2 || !regionNames) return code;
  try {
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
}

export function PassportCollection({
  collectedFlagCodes
}: PassportCollectionProps) {
  const collected = new Set(
    collectedFlagCodes.map((code) => normalizeFlagCode(code))
  );
  const max = FLAG_OPTIONS.length;
  const count = collected.size;
  const regionNames = (() => {
    try {
      return new Intl.DisplayNames(['en'], { type: 'region' });
    } catch {
      return null;
    }
  })();

  return (
    <section className='space-y-4 rounded-xl border p-4'>
      <div className='flex items-center justify-between gap-3'>
        <h2 className='text-lg font-semibold'>Passport Collection</h2>
        <Badge variant='secondary'>
          {count}/{max} collected
        </Badge>
      </div>
      <p className='text-muted-foreground text-sm'>
        Flags from opponents you have played in multiplayer games.
      </p>
      <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
        {FLAG_OPTIONS.map((code) => {
          const hasFlag = collected.has(code);
          return (
            <div
              key={code}
              className={cn(
                'rounded-md border p-2 text-center transition-colors',
                hasFlag
                  ? 'bg-card border-border'
                  : 'bg-muted/40 border-border/60 text-muted-foreground grayscale'
              )}
            >
              <div className='flex items-center justify-center'>
                <CountryFlag
                  code={code}
                  className='h-5 w-8 rounded-[2px] border border-black/10'
                />
              </div>
              <div className='mt-1 text-[11px] font-medium'>
                {resolveCountryName(regionNames, code)}
              </div>
              <div className='text-muted-foreground text-[10px]'>{code}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
