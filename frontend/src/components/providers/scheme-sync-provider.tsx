'use client';

import { useEffect } from 'react';
import { COOKIE_CONFIG } from '@/features/chess/config/board';
import type { SchemeName } from '@/components/layout/Scheme/constants';

const SCHEME_COOKIE = 'scheme';
const CUSTOM_COLOR_COOKIE = 'custom_color';
const CUSTOM_FOREGROUND_COOKIE = 'custom_foreground';

interface SchemeSyncProviderProps {
  scheme: SchemeName;
  customColor: string;
  customForeground: string;
}

export function SchemeSyncProvider({
  scheme,
  customColor,
  customForeground
}: SchemeSyncProviderProps) {
  useEffect(() => {
    document.documentElement.setAttribute('data-scheme', scheme);
    document.cookie = `${SCHEME_COOKIE}=${scheme};path=/;max-age=${COOKIE_CONFIG.maxAge}`;
  }, [scheme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--custom-color', customColor);
    document.documentElement.style.setProperty(
      '--custom-foreground',
      customForeground
    );
    document.cookie = `${CUSTOM_COLOR_COOKIE}=${customColor};path=/;max-age=${COOKIE_CONFIG.maxAge}`;
    document.cookie = `${CUSTOM_FOREGROUND_COOKIE}=${customForeground};path=/;max-age=${COOKIE_CONFIG.maxAge}`;
  }, [customColor, customForeground]);

  return null;
}
