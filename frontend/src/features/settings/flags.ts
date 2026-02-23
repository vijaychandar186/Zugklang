import { countries, hasFlag } from 'country-flag-icons';

export const DEFAULT_FLAG_CODE = 'INT';
export const FALLBACK_FLAG_SRC = '/flags/fallback-300*100.svg';

export const FLAG_OPTIONS = countries;

export function normalizeFlagCode(flagCode?: string | null): string {
  const code = (flagCode ?? '').toUpperCase();
  return hasFlag(code) ? code : DEFAULT_FLAG_CODE;
}

export function isFallbackFlagCode(flagCode?: string | null): boolean {
  return normalizeFlagCode(flagCode) === DEFAULT_FLAG_CODE;
}

export function getCountryDisplayName(flagCode?: string | null): string {
  const normalizedCode = normalizeFlagCode(flagCode);
  if (normalizedCode === DEFAULT_FLAG_CODE) return 'International';
  try {
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    return regionNames.of(normalizedCode) ?? normalizedCode;
  } catch {
    return normalizedCode;
  }
}
