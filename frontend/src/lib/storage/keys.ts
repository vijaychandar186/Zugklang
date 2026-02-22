const PREFIX = 'zugklang' as const;
export const GAME_STORAGE_KEY = `${PREFIX}-play-storage` as const;
export const GAME_LAST_ACTIVE_KEY = `${PREFIX}-game-last-active` as const;
export const GAME_FOUR_PLAYER_KEY =
  `${PREFIX}-game-custom-four-player` as const;
export const GAME_DICE_CHESS_KEY = `${PREFIX}-game-custom-dice-chess` as const;
export const GAME_CARD_CHESS_KEY = `${PREFIX}-game-custom-card-chess` as const;
export const FEATURE_PUZZLE_KEY = `${PREFIX}-puzzle` as const;
export const FEATURE_OPENINGS_KEY = `${PREFIX}-openings` as const;
export const FEATURE_GAME_REVIEW_KEY = `${PREFIX}-game-review` as const;
export const FEATURE_ANALYSIS_BOARD_KEY = `${PREFIX}-analysis-board` as const;
export const FEATURE_ANALYSIS_SETTINGS_KEY =
  `${PREFIX}-analysis-settings` as const;
export function getGameStorageKey(gameType: string, variant: string): string {
  return `${PREFIX}-game-${gameType}-${variant}`;
}
export function getAllStorageKeys(): string[] {
  return [
    GAME_STORAGE_KEY,
    GAME_LAST_ACTIVE_KEY,
    GAME_FOUR_PLAYER_KEY,
    GAME_DICE_CHESS_KEY,
    GAME_CARD_CHESS_KEY,
    FEATURE_PUZZLE_KEY,
    FEATURE_OPENINGS_KEY,
    FEATURE_GAME_REVIEW_KEY,
    FEATURE_ANALYSIS_BOARD_KEY,
    FEATURE_ANALYSIS_SETTINGS_KEY
  ];
}
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
export function clearGameCategoryStorage(
  category: 'computer' | 'local' | 'custom'
): void {
  if (typeof localStorage === 'undefined') return;
  const allKeys = Object.keys(localStorage);
  if (category === 'custom') {
    localStorage.removeItem(GAME_FOUR_PLAYER_KEY);
    localStorage.removeItem(GAME_DICE_CHESS_KEY);
    localStorage.removeItem(GAME_CARD_CHESS_KEY);
    return;
  }
  const prefix = `${PREFIX}-game-${category}-`;
  for (const key of allKeys) {
    if (key.startsWith(prefix)) {
      localStorage.removeItem(key);
    }
  }
}
