import { createJSONStorage } from 'zustand/middleware';

const STORAGE_PREFIX = 'zugklang-game';

export function getStorageKey(mode: string): string {
  return `${STORAGE_PREFIX}-${mode}`;
}

export function saveToModeStorage<T>(mode: string, state: T): void {
  if (typeof localStorage === 'undefined') return;
  const key = getStorageKey(mode);
  localStorage.setItem(key, JSON.stringify({ state }));
}

export function loadFromModeStorage<T>(mode: string): T | null {
  if (typeof localStorage === 'undefined') return null;
  const key = getStorageKey(mode);
  const data = localStorage.getItem(key);
  if (!data) return null;
  try {
    const parsed = JSON.parse(data);
    return parsed.state || null;
  } catch {
    return null;
  }
}

export function createModeStorage(mode: string) {
  const key = getStorageKey(mode);
  return createJSONStorage(() => ({
    getItem: () => localStorage.getItem(key),
    setItem: (_: string, value: string) => localStorage.setItem(key, value),
    removeItem: () => localStorage.removeItem(key)
  }));
}

export function createMultiModeStorage<T extends string>(
  getModeFromState: (state: unknown) => T | undefined,
  defaultMode: T
) {
  return createJSONStorage(() => ({
    getItem: (): string | null => {
      if (typeof localStorage === 'undefined') return null;
      const lastMode =
        localStorage.getItem(`${STORAGE_PREFIX}-last-active`) || defaultMode;
      const key = getStorageKey(lastMode);
      return localStorage.getItem(key);
    },
    setItem: (_: string, value: string): void => {
      if (typeof localStorage === 'undefined') return;
      try {
        const parsed = JSON.parse(value);
        const mode = getModeFromState(parsed?.state) || defaultMode;
        const key = getStorageKey(mode);
        localStorage.setItem(key, value);
        localStorage.setItem(`${STORAGE_PREFIX}-last-active`, mode);
      } catch {
        const key = getStorageKey(defaultMode);
        localStorage.setItem(key, value);
      }
    },
    removeItem: (): void => {}
  }));
}
