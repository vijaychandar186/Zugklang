// ---------------------------------------------------------------------------
// Multiplayer client configuration
// Timing values must stay in sync with backend/ws-server/config.ts
// ---------------------------------------------------------------------------

/** Must match backend ABORT_TIMEOUT_MS */
export const ABORT_TIMEOUT_MS = 60_000;

/** Must match backend ABANDON_TIMEOUT_MS */
export const ABANDON_TIMEOUT_MS = 30_000;

/** How long after the abort window opens before showing the countdown UI.
 *  Keeps the indicator hidden during the first 20 s when most players move. */
export const ABORT_COUNTDOWN_VISIBILITY_DELAY_MS = 20_000;
