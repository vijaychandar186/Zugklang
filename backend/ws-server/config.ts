// ---------------------------------------------------------------------------
// WS-server configuration
// All timing / threshold constants live here so they are easy to tune.
// ---------------------------------------------------------------------------

/** Milliseconds before a game is auto-aborted when white hasn't made the first
 *  move (set at room creation) or black hasn't replied to the first move. */
export const ABORT_TIMEOUT_MS = 60_000;

/** Milliseconds a disconnected player has to reconnect before the game is
 *  forfeited as an abandonment. */
export const ABANDON_TIMEOUT_MS = 30_000;

/** Maximum number of WebSocket messages a client may send within
 *  RATE_LIMIT_WINDOW_MS before being rate-limited. */
export const RATE_LIMIT_MAX_MESSAGES = 30;

/** Sliding-window duration used by the rate limiter (milliseconds). */
export const RATE_LIMIT_WINDOW_MS = 3_000;

/** How often the server runs its in-memory garbage-collector (milliseconds). */
export const GC_INTERVAL_MS = 5 * 60 * 1_000;

/** Ended rooms older than this (milliseconds) are removed by the GC. */
export const GC_ROOM_MAX_AGE_MS = 30 * 60 * 1_000;
