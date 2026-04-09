# Kaladin Anti-Cheat

A machine learning system for automated chess engine detection, built with CNNs on Keras/TensorFlow. It analyses player behavioural patterns across many games — move timing, material context, game phase — to produce a cheat probability score.

Originally developed for Lichess. Adapted for the Zugklang platform with a PostgreSQL + Prisma backend and a FastAPI HTTP interface.

---

## How It Works

### Detection pipeline

```
Game ends on Zugklang
  └─ WS server → POST /game (fire-and-forget)
       └─ python-chess replays moves → computes per-move features
            └─ stored in PostgreSQL (game_insights + moves tables)

Later, on demand:
  POST /analyse { "users": ["<userId>"] }
  └─ queries game history → feeds CNN → outputs cheat probability (0–1)
```

### What the model analyses

The model does **not** look at move quality (that would require a chess engine). It looks at **behavioural patterns** over many games:

| Feature | Description |
|---------|-------------|
| `moveTime` | Time spent on each move (centiseconds), recorded by the WS server |
| `variance` | Coefficient of variation of move times across the game — engine users often have unnaturally low variance |
| `imbalance` | Material balance when the move was made (winning/losing position) |
| `phase` | Game phase: 1=opening, 2=middlegame, 3=endgame |
| `role` | Piece type moved (pawn, knight, bishop, rook, queen, king) |
| `blur` | Whether the browser tab was blurred during the move (reserved, not yet implemented) |

A single game tells you very little. The system builds a behavioural fingerprint over **20+ games** before a meaningful prediction is possible.

### Time control buckets

Uses the same formula as the frontend `getTimeCategory`: `estimatedSeconds = minutes × 60 + increment × 40`.

| Estimated seconds | Category | Kaladin bucket |
|-------------------|----------|---------------|
| < 600 | bullet / blitz | `2` |
| ≥ 600 | rapid / classical | `6` |

---

## File Structure

```
backend/anti-cheat/
├── src/
│   ├── main.py           — FastAPI app, lifespan, routes
│   ├── config.py         — All configuration constants
│   ├── db.py             — Prisma singleton (init_db / get_db / close_db)
│   ├── schemas.py        — Pydantic request/response models
│   ├── ingestion.py      — Game replay + per-move feature extraction
│   ├── insights.py       — Aggregation queries for the ML pipeline
│   ├── queries.py        — Raw SQL query functions for the ML pipeline
│   ├── queue_manager.py  — Background analysis job queue
│   └── ml/
│       ├── prediction.py — Run inference on a set of users
│       ├── training.py   — Train / retrain the CNN
│       └── explainer.py  — SHAP explainer (insight URL generation)
├── model/
│   ├── bullet_blitz_movetime_days180/saved_model/    — Neural network for bullet/blitz
│   └── rapid_classical_movetime_days180/saved_model/ — Neural network for rapid/classical
├── input_data/
│   └── use_eval_0/
│       ├── insight_bin_keys.pkl             — Bucket key mappings
│       ├── insight_averages.pkl             — Per-bucket averages for normalisation
│       ├── minmax_values_for_clipping.pkl   — Feature clipping bounds
│       └── metadata_dct.pkl                — Train/test split (generated on training)
├── generate_synthetic_artifacts.py          — Generates input_data/ for dev (run once)
├── tests/
│   ├── conftest.py       — Shared fixtures and game payload factory
│   ├── test_unit.py      — Pure function tests (no DB required)
│   └── test_api.py       — FastAPI endpoint integration tests
├── schema.prisma         — PostgreSQL schema (GameInsight, Move, AnalysisQueue, User)
├── pyproject.toml        — Dependencies (uv)
├── Dockerfile            — Production image (python:3.13-slim + uv)
├── docker.sh             — Build & run helper (cpu / gpu)
├── start.sh              — Entrypoint: dev (--reload) or prod
├── .env.base             — Non-secret defaults
└── .env                  — Local overrides (never committed)
```

---

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/anti-cheat` | PostgreSQL connection string |
| `LOGGING_LEVEL` | `INFO` | Log verbosity |
| `BATCH_SIZE` | `10` | Users processed per queue batch |
| `BATCH_TIMEOUT` | `15` | Seconds to wait before flushing a partial batch |
| `BATCH_REFRESH_WAITING_TIME` | `10` | Seconds to poll between queue checks |

Put secrets in `.env` (gitignored). Defaults live in `.env.base`.

---

## Running Locally

### Development (with auto-reload)

```bash
cd backend/anti-cheat
uv run uvicorn src.main:app --port 8000 --reload
# or via start.sh:
./start.sh dev
```

### Dev Docker Setup (hot-reload, no rebuild needed)

The `docker-compose.dev.yaml` mounts `src/` as a volume so uvicorn's `--reload`
picks up code changes instantly.

After starting the stack for the first time, generate the synthetic ML artifacts:

```bash
docker exec zugklang-anti-cheat-dev python generate_synthetic_artifacts.py
```

This creates `input_data/use_eval_0/` with:
- `insight_bin_keys.pkl` — bucket key mappings
- `insight_averages.pkl` — per-insight mean values for imputation
- `minmax_values_for_clipping.pkl` — feature clipping bounds
- `metadata_dct.pkl` — empty train/test split (dev only)

These are synthetic placeholders derived from realistic chess move-time distributions.
They allow the inference pipeline to run without a full training dataset.
The model will return `INSUFFICIENT_DATA` until a player accumulates ~20+ games.

### Production

```bash
./start.sh prod
```

### Docker

```bash
# CPU
./docker.sh cpu prod

# GPU (requires nvidia-docker)
./docker.sh gpu prod
```

---

## API Endpoints

### `GET /health`
Returns `{"status": "ok"}` when the server is up and the DB is connected.

### `POST /game`
Called automatically by the WS server when a game ends. Replays the game with python-chess, computes per-move features, and stores them in PostgreSQL.

```json
{
  "game_id": "abc123",
  "variant": "standard",
  "time_control_minutes": 3,
  "time_control_increment": 0,
  "moves": ["e2e4", "e7e5", "g1f3", "..."],
  "move_times_white_ms": [1200, 950, 800],
  "move_times_black_ms": [900, 750, 600],
  "white_user_id": "user_id_1",
  "black_user_id": "user_id_2",
  "white_rating": 1500,
  "black_rating": 1400,
  "result": "white"
}
```

Response:
```json
{ "stored": true, "white_moves_stored": 3, "black_moves_stored": 3 }
```

### `POST /analyse`
Run the ML model on one or more users. Requires sufficient game history (~20+ games per time control).

```json
{ "users": ["user_id_1", "user_id_2"] }
```

Response:
```json
{
  "results": [
    { "user": "user_id_1", "tc": 2, "days": 180, "pred": 0.87 }
  ]
}
```

`pred` is the cheat probability (0.0–1.0). Values above ~0.9 indicate likely engine use.

### `GET /queue/status`
Returns the number of pending and today's processed analysis jobs.

### `POST /queue/start`
Starts the background analysis queue worker.

### `POST /train`
Triggers model retraining in the background (requires sufficient data in the DB).

---

## Running Tests

```bash
# Install dev dependencies first
uv sync --group dev

# Run all tests
uv run pytest tests/ -v

# Unit tests only (no DB needed)
uv run pytest tests/test_unit.py -v

# API tests (requires running PostgreSQL)
uv run pytest tests/test_api.py -v
```

---

## Database Schema

Managed by Prisma. Apply the schema:

```bash
uv run prisma db push
```

**`game_insights`** — one row per player per game
**`moves`** — one row per half-move, FK → game_insights
**`analysis_queue`** — job queue for the background worker
**`users`** — engine marks and per-TC ratings

---

## Acknowledgments

Based on [Kaladin](https://github.com/lichess-org/kaladin), the open-source chess engine detection system built for Lichess.

Special thanks to the original contributors:
- **[kraktus](https://github.com/kraktus)** — queue manager, Docker config, error handling, lila integration, and integration testing
- **[michael1241](https://github.com/michael1241)** — domain expertise, design discussions, initial queue manager and deployment support
- **[ornicar](https://github.com/ornicar)** — support and lila integration
- The broader community who helped validate model output, generate ideas, and provide feedback

The Kaladin repository was re-created when transitioning to open source to ensure user data was not made public. Git history was expunged during that transition.
