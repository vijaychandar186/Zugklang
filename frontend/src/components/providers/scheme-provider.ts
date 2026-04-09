'use client';
import { useScheme } from '@/components/layout/Providers';
import type { SchemeName } from '@/components/layout/Scheme/constants';
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
