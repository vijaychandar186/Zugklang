'use client';

import type { ComponentType, SVGProps } from 'react';
import Image from 'next/image';
import * as FlagIcons from 'country-flag-icons/react/3x2';
import {
  FALLBACK_FLAG_SRC,
  isFallbackFlagCode,
  normalizeFlagCode
} from '@/features/settings/flags';

type FlagComponent = ComponentType<SVGProps<SVGSVGElement>>;

type CountryFlagProps = {
  code?: string | null;
  className?: string;
  title?: string;
};

export function CountryFlag({ code, className, title }: CountryFlagProps) {
  const normalizedCode = normalizeFlagCode(code);
  const Flag = (FlagIcons as Record<string, FlagComponent>)[normalizedCode];

  if (!Flag || isFallbackFlagCode(normalizedCode)) {
    return (
      <Image
        src={FALLBACK_FLAG_SRC}
        width={300}
        height={100}
        className={className}
        alt={title ?? 'International'}
      />
    );
  }

  return (
    <Flag
      className={className}
      aria-label={title ?? normalizedCode}
      role='img'
    />
  );
}
