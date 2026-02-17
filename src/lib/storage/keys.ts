/**
 * Centralized localStorage key configuration for the entire application.
 *
 * All localStorage keys should be defined here to ensure consistency and
 * prevent key collisions. Keys are organized by category:
 *
 * - GAME_* : Game state storage (computer, local, custom games)
 * - FEATURE_* : Feature-specific storage (puzzles, openings, analysis, etc.)
 * - SETTINGS_* : Settings and preferences
 */

// ============================================================================
// Base Prefix
// ============================================================================
const PREFIX = 'zugklang' as const;

// ============================================================================
// Game Storage Keys
// ============================================================================

/**
 * Base key for standard chess games (computer and local modes).
 * The actual keys are dynamically generated based on game mode and variant:
 * - Computer games: zugklang-game-computer-{variant}
 * - Local games: zugklang-game-local-{variant}
 *
 * Examples:
 * - zugklang-game-computer-standard
 * - zugklang-game-computer-atomic
 * - zugklang-game-local-standard
 * - zugklang-game-local-fischer-random
 */
export const GAME_STORAGE_KEY = `${PREFIX}-play-storage` as const;

/**
 * Tracks the last active game mode (computer-standard, local-atomic, etc.)
 * This is used by createMultiModeStorage to restore the correct game on load.
 */
export const GAME_LAST_ACTIVE_KEY = `${PREFIX}-game-last-active` as const;

/**
 * Four-player chess game state
 * Category: Custom Game
 */
export const GAME_FOUR_PLAYER_KEY = `${PREFIX}-game-four-player` as const;

/**
 * Dice chess game state
 * Category: Custom Game
 */
export const GAME_DICE_CHESS_KEY = `${PREFIX}-game-dice-chess` as const;

/**
 * Chess with Checkers game state
 * Category: Custom Game
 */
export const GAME_CHECKERS_CHESS_KEY = `${PREFIX}-game-checkers-chess` as const;

// ============================================================================
// Feature Storage Keys
// ============================================================================

/**
 * Puzzle solving progress and settings
 */
export const FEATURE_PUZZLE_KEY = `${PREFIX}-puzzle` as const;

/**
 * Opening repertoire favorites and progress
 */
export const FEATURE_OPENINGS_KEY = `${PREFIX}-openings` as const;

/**
 * Game review analysis and history
 */
export const FEATURE_GAME_REVIEW_KEY = `${PREFIX}-game-review` as const;

/**
 * Analysis board state (separate from game analysis)
 */
export const FEATURE_ANALYSIS_BOARD_KEY = `${PREFIX}-analysis-board` as const;

/**
 * Chess analysis engine settings (engine selection, depth, etc.)
 */
export const FEATURE_ANALYSIS_SETTINGS_KEY =
  `${PREFIX}-analysis-settings` as const;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get the storage key for a specific game mode and variant
 * Used internally by createMultiModeStorage
 */
export function getGameStorageKey(gameType: string, variant: string): string {
  return `${PREFIX}-game-${gameType}-${variant}`;
}

/**
 * Get all possible localStorage keys used by the application
 * Useful for debugging or clearing storage
 */
export function getAllStorageKeys(): string[] {
  return [
    GAME_STORAGE_KEY,
    GAME_LAST_ACTIVE_KEY,
    GAME_FOUR_PLAYER_KEY,
    GAME_DICE_CHESS_KEY,
    GAME_CHECKERS_CHESS_KEY,
    FEATURE_PUZZLE_KEY,
    FEATURE_OPENINGS_KEY,
    FEATURE_GAME_REVIEW_KEY,
    FEATURE_ANALYSIS_BOARD_KEY,
    FEATURE_ANALYSIS_SETTINGS_KEY
  ];
}

/**
 * Clear all game-related localStorage (keeps feature settings intact)
 */
export function clearAllGameStorage(): void {
  if (typeof localStorage === 'undefined') return;

  const keysToKeep = new Set<string>([
    FEATURE_PUZZLE_KEY,
    FEATURE_OPENINGS_KEY,
    FEATURE_ANALYSIS_SETTINGS_KEY
  ]);

  const allKeys = Object.keys(localStorage);
  for (const key of allKeys) {
    if (key.startsWith(PREFIX) && !keysToKeep.has(key)) {
      localStorage.removeItem(key);
    }
  }
}

/**
 * Clear specific game category storage
 */
export function clearGameCategoryStorage(
  category: 'computer' | 'local' | 'custom'
): void {
  if (typeof localStorage === 'undefined') return;

  const allKeys = Object.keys(localStorage);

  if (category === 'custom') {
    localStorage.removeItem(GAME_FOUR_PLAYER_KEY);
    localStorage.removeItem(GAME_DICE_CHESS_KEY);
    localStorage.removeItem(GAME_CHECKERS_CHESS_KEY);
    return;
  }

  // Clear computer or local game keys
  const prefix = `${PREFIX}-game-${category}-`;
  for (const key of allKeys) {
    if (key.startsWith(prefix)) {
      localStorage.removeItem(key);
    }
  }
}
