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

// ---------------------------------------------------------------------------
// ELO-based matchmaking
// ---------------------------------------------------------------------------

/** When true, the queue only pairs players whose rating bands overlap.
 *  When false, the first available opponent is always accepted (original
 *  behaviour). Applies to every 2-player game mode / variant. */
export const ELO_QUEUE_ENABLED = true;

/** Starting rating window on each side (±points) when a player first enters
 *  the queue. */
export const RATING_BAND_BASE = 200;

/** How many rating points the window expands per second of waiting.
 *  After 30 s the band is ±350, after 60 s it is ±500, etc. */
export const RATING_BAND_EXPAND_PER_SEC = 5;

// ---------------------------------------------------------------------------
// Anti-cheat
// ---------------------------------------------------------------------------

/** Base URL of the Kaladin anti-cheat FastAPI server.
 *  Leave empty to disable (no HTTP calls are made). */
export const ANTI_CHEAT_URL: string = process.env['ANTI_CHEAT_URL'] ?? '';

// ---------------------------------------------------------------------------
// Redis TTLs
// ---------------------------------------------------------------------------

/** Seconds a challenge hash lives in Redis before auto-expiry. */
export const CHALLENGE_TTL_SEC = 1800;

/** Seconds a rejoin token lives in Redis before auto-expiry. */
export const REJOIN_TOKEN_TTL_SEC = 3600;

/** Seconds a room hash lives in Redis (refreshed on each move). */
export const ROOM_TTL_SEC = 7200;

/** Seconds a queued player's metadata hash lives in Redis. */
export const QUEUE_PLAYER_TTL_SEC = 3600;
