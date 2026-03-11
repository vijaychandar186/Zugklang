# Redis in ws-server

Redis is the shared state layer that makes the ws-server work correctly across multiple pods and survive process restarts.

---

## Connection

Two ioredis connections are created at startup in [`redis.ts`](../redis.ts):

| Export | Purpose |
|---|---|
| `redis` | General-purpose read/write |
| `redisSub` | Dedicated pub/sub subscriber (ioredis requires a separate connection for `SUBSCRIBE`) |

Both connect to `REDIS_URL` (default `redis://localhost:6379`).
BullMQ manages its own independent connections via the factory in [`bullmq/connection.ts`](../bullmq/connection.ts).

---

## Key Namespace Reference

### Player → Pod routing

| Key | Type | TTL | Value |
|---|---|---|---|
| `ws:user:{userId}:pod` | String | 24 h | Pod ID that the player is connected to |
| `pod:url:{podId}` | String | 24 h | Public `wss://` URL of that pod |

Used by [`utils/routing.ts`](../utils/routing.ts) `sendToUser()` to forward messages to players on other pods via pub/sub.

### Room state

| Key | Type | TTL | Value |
|---|---|---|---|
| `room:{roomId}` | Hash | 2 h (refreshed on each move) | Serialised room fields (status, variant, moves, clocks, players…) |
| `room:{roomId}:pod` | String | 2 h | Pod ID that owns (and processes moves for) this room |

Written by `persistRoom()` in [`handlers/queue.ts`](../handlers/queue.ts).
Read on rejoin to redirect clients to the correct pod.

### Matchmaking queue

| Key | Type | TTL | Value |
|---|---|---|---|
| `queue:{variant}:{mode}:{minutes}:{increment}` | Sorted Set | — | Members = `userId`, scores = `queuedAt` timestamp |
| `queue:player:{userId}` | Hash | 1 h | `{ userId, sessionId, rating, queuedAt, podId, displayName, userImage }` |

Queues use atomic `ZREM` to claim an opponent, preventing race conditions on multi-pod deployments.

### Rejoin tokens

| Key | Type | TTL | Value |
|---|---|---|---|
| `ws:rejoin:{token}` | String | 1 h | `JSON { playerId, roomId, podId }` |
| `ws:rejoin:player:{playerId}` | String | 1 h | The current token for this player (for O(1) revocation) |

Issued by `issueRejoinToken()` in [`state.ts`](../state.ts). Revoked when a game ends via `revokeRoomTokens()`.

### Challenges

| Key | Type | TTL | Value |
|---|---|---|---|
| `challenge:{challengeId}` | Hash | — | `{ creatorSessionId }` — updated when creator reconnects |

---

## Pub/Sub Channels

| Channel | Publisher | Subscriber | Purpose |
|---|---|---|---|
| `analysis:done` | Anti-cheat Python service | ws-server `redisSub` | Deliver cheat detection verdict to the relevant player |
| `ws:pod:{podId}:in` | Other pods | This pod's `redisSub` | Cross-pod message delivery (direct messages, game relays, match notifications) |

### Message types on `ws:pod:{podId}:in`

| `type` | Description |
|---|---|
| `direct` | Forward a payload to a locally-connected user |
| `relay` | Cross-pod player sent a game action; this pod owns the room and processes it |
| `pod_matched` | Another pod found a match involving one of our players |
| `pod_challenge_accepted` | A player on another pod accepted a challenge whose creator is here |

---

## Rate Limiting

| Key | Type | TTL | Value |
|---|---|---|---|
| `rl:{sessionId}` | String (counter) | Set to `RATE_LIMIT_WINDOW_MS` on first write | Message count within the current window |

Implemented with `INCR` + `EXPIRE` in [`utils/rateLimit.ts`](../utils/rateLimit.ts).

---

## BullMQ-Managed Keys

BullMQ stores its own data under the `bull:` prefix. These are managed automatically and should not be modified manually.

| Key pattern | Purpose |
|---|---|
| `bull:{queue}:*` | Job metadata, delayed job sorted sets, worker locks |

See [bullmq.md](./bullmq.md) for the full job registry.
