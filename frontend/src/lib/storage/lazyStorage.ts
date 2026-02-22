import { createJSONStorage, StorageValue } from 'zustand/middleware';
export function createLazyStorage<S>(shouldPersist: (state: S) => boolean) {
  return createJSONStorage<S>(() => ({
    getItem: (name: string): string | null => {
      if (typeof localStorage === 'undefined') return null;
      return localStorage.getItem(name);
    },
    setItem: (name: string, value: string): void => {
      if (typeof localStorage === 'undefined') return;
      try {
        const parsed = JSON.parse(value) as StorageValue<S>;
        const state = parsed?.state;
        if (state && shouldPersist(state)) {
          localStorage.setItem(name, value);
        } else {
          localStorage.removeItem(name);
        }
      } catch {
        localStorage.removeItem(name);
      }
    },
    removeItem: (name: string): void => {
      if (typeof localStorage === 'undefined') return;
      localStorage.removeItem(name);
    }
  }));
}
export function hasGameStarted(state: {
  moves?: unknown[];
  gameStarted?: boolean;
}): boolean {
  return (
    (Array.isArray(state.moves) && state.moves.length > 0) ||
    state.gameStarted === true
  );
}
export function hasFeatureData(state: unknown): boolean {
  if (!state || typeof state !== 'object') return false;
  const stateObj = state as Record<string, unknown>;
  for (const value of Object.values(stateObj)) {
    if (value === null || value === undefined) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    if (typeof value === 'object' && Object.keys(value).length === 0) continue;
    return true;
  }
  return false;
}
