'use client';

import { useScheme, type SchemeName } from '@/components/layout/Providers';

export type SchemeKey = SchemeName;

export function useSchemeConfig() {
  const {
    scheme,
    setScheme,
    customColor,
    setCustomColor,
    customForeground,
    setCustomForeground
  } = useScheme();

  return {
    activeScheme: scheme,
    setActiveScheme: setScheme,
    customColor,
    setCustomColor,
    customForeground,
    setCustomForeground
  };
}
