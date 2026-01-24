import { createJSONStorage } from 'zustand/middleware';

/**
 * Storage key prefix for all game modes.
 * New modes automatically get their own storage: `zugklang-game-{mode}`
 */
const STORAGE_PREFIX = 'zugklang-game';

/**
 * Get the storage key for any game mode.
 * Automatically generates key from mode name.
 */
export function getStorageKey(mode: string): string {
  return `${STORAGE_PREFIX}-${mode}`;
}

/**
 * Save state to a specific game mode's storage.
 */
export function saveToModeStorage<T>(mode: string, state: T): void {
  if (typeof localStorage === 'undefined') return;
  const key = getStorageKey(mode);
  localStorage.setItem(key, JSON.stringify({ state }));
}

/**
 * Load state from a specific game mode's storage.
 */
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

/**
 * Create a Zustand-compatible storage adapter for a specific game mode.
 * Use this for stores that only serve a single mode (like analysis).
 */
export function createModeStorage(mode: string) {
  const key = getStorageKey(mode);
  return createJSONStorage(() => ({
    getItem: () => localStorage.getItem(key),
    setItem: (_: string, value: string) => localStorage.setItem(key, value),
    removeItem: () => localStorage.removeItem(key)
  }));
}

/**
 * Create a Zustand-compatible storage adapter that routes to different
 * storage keys based on a mode field in the state.
 *
 * Use this for stores that handle multiple modes (like the chess play store).
 * The mode is read directly from state - no URL detection needed.
 *
 * @param getModeFromState - Function to extract mode from parsed state
 * @param defaultMode - Default mode to use when state has no mode yet
 */
export function createMultiModeStorage<T extends string>(
  getModeFromState: (state: unknown) => T | undefined,
  defaultMode: T
) {
  return createJSONStorage(() => ({
    getItem: (): string | null => {
      if (typeof localStorage === 'undefined') return null;
      // On initial load, try to get the last active mode from a meta key
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
        // Track which mode was last used
        localStorage.setItem(`${STORAGE_PREFIX}-last-active`, mode);
      } catch {
        const key = getStorageKey(defaultMode);
        localStorage.setItem(key, value);
      }
    },
    removeItem: (): void => {
      // Only called on store reset, not on mode switch
    }
  }));
}
