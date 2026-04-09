# Anti-Cheat Pipeline

End-to-end notes on the Kaladin anti-cheat service — setup, fixes applied during dev, and how to test inference.

---

## Architecture

```
Game ends on Zugklang
  └─ ws-server BullMQ → POST /anti-cheat/game
       └─ python-chess replays moves → per-move features stored in PostgreSQL
            └─ AnalysisQueue upserted for each authenticated player
                 └─ QueueManager background thread picks up queue
                      └─ run_inference → CNN → pred score (0.0–1.0)
```

The `/analyse` endpoint can also be called directly to run inference on demand.

---

## Services & Ports

| Service | Internal | External |
|---------|----------|----------|
| anti-cheat FastAPI | `anti-cheat:8000` | `http://localhost/anti-cheat/` (via nginx) |
| Prisma Studio (anti-cheat DB) | — | `http://localhost:5556` |

---

## Environment Variables

Set in `backend/anti-cheat/.env`:

```env
DATABASE_URL=postgresql://admin:mysecretpassword@postgres:5432/zugklang-anti-cheat
REDIS_URL=redis://redis:6379
INTERNAL_API_SECRET=dev-secret-123
```

The `INTERNAL_API_SECRET` must match what `ws-server` and any direct callers use.

---

## First-time Dev Setup

After starting the stack, generate the synthetic ML artifacts (needed once per fresh volume):

```bash
docker exec zugklang-anti-cheat-dev python generate_synthetic_artifacts.py
```

This creates `input_data/use_eval_0/` inside the container volume with:
- `insight_bin_keys.pkl` — bucket key mappings
- `insight_averages.pkl` — per-insight mean values for imputation
- `minmax_values_for_clipping.pkl` — feature clipping bounds
- `metadata_dct.pkl` — empty train/test split (dev only)

Without these files, inference will fail with `FileNotFoundError`.

---

## Testing the Pipeline

### 1. Check the service is up

```bash
curl http://localhost/anti-cheat/health
# {"status":"ok"}
```

### 2. Check queue status

```bash
curl http://localhost/anti-cheat/queue/status
# {"pending": 0, "processed_today": 0}
```

### 3. Ingest a game manually

```bash
curl -X POST http://localhost/anti-cheat/game \
  -H "Authorization: Bearer <your-api-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "game_id": "test-001",
    "variant": "standard",
    "time_control_minutes": 10,
    "time_control_increment": 0,
    "moves": ["e2e4","e7e5","g1f3","b8c6"],
    "move_times_white_ms": [1200, 950],
    "move_times_black_ms": [900, 750],
    "white_user_id": "<userId>",
    "white_username": "<displayName>",
    "black_user_id": "<userId>",
    "black_username": "<displayName>",
    "white_rating": 1500,
    "black_rating": 1400,
    "result": "white"
  }'
```

### 4. Seed the DB with real games (for inference testing)

Use `send_games.py` in the project root. It reads `games.csv` (a Lichess dataset), converts SAN→UCI via python-chess, and sends 50 real games to the anti-cheat:

```bash
python send_games.py
```

Requires `python-chess` on the host:
```bash
pip install chess
```

### 5. Run inference

```bash
curl -X POST http://localhost/anti-cheat/analyse \
  -H "Authorization: Bearer <your-api-key>" \
  -H "Content-Type: application/json" \
  -d '{"users": ["<userId1>", "<userId2>"]}'
```

Response:
```json
{
  "results": [
    {
      "user": "cmnnqg88v00002xoinva8swsb",
      "tc": 6,
      "days": 180,
      "pred": 0.9936
    }
  ]
}
```

`pred` is the cheat probability (0.0–1.0). Above ~0.9 indicates likely engine use. The model needs ~20+ games per time-control bucket before it can produce a meaningful prediction.

**Time-control buckets:**
- `tc=2` → bullet/blitz (`estimatedSeconds = minutes×60 + increment×40 < 600`)
- `tc=6` → rapid/classical (`≥ 600`)

---

## Bugs Fixed During Dev

### 1. `white_username` / `black_username` missing from schema

`GameIngestionRequest` in `schemas.py` was missing the username fields that `ws-server` sends. Added:
```python
white_username: Optional[str] = None
black_username: Optional[str] = None
```

### 2. AnalysisQueue never populated

After game ingestion, no queue entries were created. Fixed in `main.py` — the `/game` endpoint now upserts an `AnalysisQueue` row and pushes a Redis notify for each authenticated player:

```python
_db.analysisqueue.upsert(
    where={"username": username},
    data={
        "create": {"username": username, "priority": 0},
        "update": {"respondedAt": None, "startedAt": None, "error": None},
    },
)
r.rpush("analysis:queue:notify", json.dumps({"username": username}))
```

### 3. Queue worker not auto-starting

The queue worker was only started via `POST /queue/start`. Changed the lifespan to start it automatically in a daemon thread with a crash-restart loop:

```python
def _run_queue_worker():
    while True:
        try:
            QueueManager().start()
        except Exception as exc:
            log.error("Queue worker crashed (%s); restarting in 10s.", exc)
            import time; time.sleep(10)

t = threading.Thread(target=_run_queue_worker, daemon=True, name="queue-worker")
t.start()
```

### 4. SQL date parameter type error

`prisma-client-py`'s `query_raw` passes Python `datetime` objects as text strings to PostgreSQL. All date parameters now have explicit `::timestamp` casts:

```sql
AND played_at BETWEEN $3::timestamp AND $4::timestamp
```

### 5. `latest_game_date` returns a string instead of datetime

`query_raw` returns `played_at` as an ISO string. Fixed in `queries.py`:

```python
val = rows[0]["played_at"]
if isinstance(val, str):
    return datetime.fromisoformat(val.replace("Z", "+00:00")).replace(tzinfo=None)
```

### 6. `missing FROM-clause entry for table "gi"`

`_move_metric_by_dim` in `queries.py` referenced `gi.result` in the `dim_expr`, but the `game_sub` CTE was aliased as `g` and didn't include the `result` column. Fixed by:
- Adding `result` to the `game_sub` SELECT
- Renaming the alias from `g` to `gi` in `move_sub`

Affects: `movetime_by_result`, `timevariance_by_result`, `blur_by_result`, `blurfiltered_by_result`, `acpl_by_result`.

### 7. `ValueError: No objects to concatenate` crashing queue worker

`run_predictions` called `pd.concat([])` when no model configs produced data. Fixed by returning an empty DataFrame early:

```python
if not frames:
    return pd.DataFrame(columns=["user", "tc", "days", "pred"])
```

### 8. Volume permission denied

Docker named volumes are created with root ownership. Fixed by adding `user: root` to the anti-cheat service in `docker-compose.dev.yaml`.

### 9. nginx 504 on `/analyse`

Inference can take 60–120 seconds. The anti-cheat nginx location had no timeout configured (nginx default is 60s). Fixed in `nginx.conf`:

```nginx
location /anti-cheat/ {
    ...
    proxy_read_timeout 300s;
    proxy_send_timeout 300s;
}
```

---

## `backend/anti-cheat/data/send_games.py`

Script for seeding the anti-cheat DB with real games from `backend/anti-cheat/data/games.csv` (Lichess open dataset format). Run from anywhere — the script resolves `games.csv` relative to its own location.

**Before running:** update the user IDs and usernames at the top of the script to match real users in your DB:
```python
WHITE_USER_ID  = "cmnnqg88v00002xoinva8swsb"
WHITE_USERNAME = "alice-smith"
BLACK_USER_ID  = "cmnnqk3j000022xoi3lj4y4ng"
BLACK_USERNAME = "john-doe"
```

**Usage:**
```bash
# Install dependency (host Python)
pip install chess

# Run from project root — sends 50 games then calls /analyse
python backend/anti-cheat/data/send_games.py
```

**What it does:**
1. Reads `backend/anti-cheat/data/games.csv` — expects columns: `moves` (SAN), `increment_code` (e.g. `10+0`), `winner`, `white_rating`, `black_rating`
2. Converts SAN → UCI using `python-chess`
3. Assigns both users as white/black (alternating)
4. Generates synthetic move times
5. POSTs each game to `POST /anti-cheat/game`
6. Calls `POST /anti-cheat/analyse` and prints predictions

**Expected output after 50 real games:**
```
=== Predictions ===
  alice-smith               | rapid/classical | 180d | pred=0.9936  *** SUSPICIOUS ***
  john-doe                  | rapid/classical | 180d | pred=0.9932  *** SUSPICIOUS ***
```

Both users score ~0.99 because the synthetic move times have unnatural statistical properties. Real human players will score much lower.
