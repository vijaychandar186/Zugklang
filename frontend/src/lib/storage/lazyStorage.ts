import { createJSONStorage, StorageValue } from 'zustand/middleware';

/**
 * Creates a lazy storage adapter that only persists to localStorage when
 * there's actual data to save (not just default/empty state).
 *
 * This prevents localStorage pollution where keys are created for every
 * game mode even if the user hasn't played them yet.
 *
 * @param shouldPersist - Function that determines if the state should be persisted
 * @returns Storage adapter for Zustand persist middleware
 */
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

        // Only persist if shouldPersist returns true
        if (state && shouldPersist(state)) {
          localStorage.setItem(name, value);
        } else {
          // Remove the key if it exists but shouldn't be persisted
          localStorage.removeItem(name);
        }
      } catch {
        // If parsing fails, don't persist
        localStorage.removeItem(name);
      }
    },
    removeItem: (name: string): void => {
      if (typeof localStorage === 'undefined') return;
      localStorage.removeItem(name);
    }
  }));
}

/**
 * Helper to check if a game has been started (has moves or non-default state)
 */
export function hasGameStarted(state: {
  moves?: unknown[];
  gameStarted?: boolean;
}): boolean {
  return (
    (Array.isArray(state.moves) && state.moves.length > 0) ||
    state.gameStarted === true
  );
}

/**
 * Helper to check if a feature has been used (has non-default data)
 */
export function hasFeatureData(state: unknown): boolean {
  if (!state || typeof state !== 'object') return false;

  const stateObj = state as Record<string, unknown>;

  // Check if any values are non-default
  for (const value of Object.values(stateObj)) {
    if (value === null || value === undefined) continue;
    if (Array.isArray(value) && value.length === 0) continue;
    if (typeof value === 'object' && Object.keys(value).length === 0) continue;
    // Has actual data
    return true;
  }

  return false;
}
