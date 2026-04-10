import { COOKIE_CONFIG } from '@/features/chess/config/board';

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? match[1] : null;
}

export function setCookie(name: string, value: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${value};path=/;max-age=${COOKIE_CONFIG.maxAge}`;
}

export function getBooleanCookie(name: string, defaultValue: boolean): boolean {
  const value = getCookie(name);
  if (value === null) return defaultValue;
  return value === 'true';
}

export function setBooleanCookie(name: string, value: boolean): void {
  setCookie(name, String(value));
}

export function getLocalStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof localStorage === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setLocalStorageItem<T>(key: string, value: T): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}
