# Kaladin — Chess Engine Detection

Kaladin is a real-time anti-cheat service for [Lichess](https://lichess.org).
It scores players for engine assistance using a multi-branch CNN trained on
Lichess game insights, with per-user SHAP explanations pointing back to the
exact Lichess insight pages that drove the verdict.

---

## How it works

1. **Data** — Lichess insight statistics (ACPL, move time, blur rate, …) are
   stored in PostgreSQL and pre-processed into a Parquet file for training.
2. **Model** — One Conv2D branch per insight dimension is tuned via Keras-Tuner
   Hyperband, then combined into a single sigmoid output (cheat probability).
3. **Explanations** — SHAP DeepExplainer attributes the score back to individual
   insight dimensions; the top-3 Lichess insight URLs are returned alongside the
   score.
4. **API** — A FastAPI server exposes `POST /analyse`; the caller sends a list
   of usernames and gets back scores + insight links.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Python | 3.14 |
| [uv](https://docs.astral.sh/uv/) | latest |
| PostgreSQL | 14+ |
| Docker (optional) | 24+ |

---

## Project structure

```
anti-cheat/
├── Dockerfile
├── docker.sh              # build + run helper (cpu / gpu / dev)
├── pyproject.toml
├── uv.lock
└── src/
    ├── main.py            # FastAPI app + lifespan (loads SHAP explainers)
    ├── config.py          # Pydantic settings — reads .env.base / .env
    ├── util.py            # logging, pickle helpers, retry decorator
    ├── start.sh           # prod / dev entrypoint
    ├── .env.base          # default configuration
    ├── db.py              # Prisma Client Python connection helper
    ├── api/
    │   ├── routes.py      # GET /health  POST /analyse
    │   └── schemas.py     # AnalyseRequest / AnalyseResponse
    ├── data/
    │   ├── loader.py      # parquet + PostgreSQL insight loader, train/test split
    │   └── transforms.py  # clip-and-scale, missing-value handling, array builder
    ├── model/
    │   ├── architecture.py  # multi-branch CNN HyperModel (Keras-Tuner)
    │   ├── trainer.py       # Hyperband search + retrain on train+valid
    │   ├── predictor.py     # batch inference across (tc, days) configs
    │   └── explainer.py     # SHAP DeepExplainer loader + insight URL builder
    └── tests/
        ├── run_tests.py   # performance smoke tests (1 / 10 / 100 users)
        └── anon.py        # anonymise BSON insight fixtures
```

Model weights are **not** committed. Mount them at runtime (see [Model weights](#model-weights)).

---

## Setup

```bash
# Install dependencies
uv sync

# Generate Prisma Client Python
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/kaladin prisma generate --schema prisma/schema.prisma

# Copy and edit config
cp src/.env.base src/.env
$EDITOR src/.env
```

### Configuration

All settings live in `src/.env.base` (defaults) and `src/.env` (local overrides).

| Variable | Default | Description |
|----------|---------|-------------|
| `LOG_LEVEL` | `INFO` | Python log level |
| `DATA_DIR` | `data` | Directory containing `insights.parquet` and `users.csv` |
| `MODEL_DIR` | `model/weights` | Directory containing trained model sub-directories |
| `USE_EVAL` | `0` | Whether to use eval-flagged games (`0` or `1`) |
| `TC_LIST` | `[2,6]` | Time controls to score (minutes) |
| `DAYS_LIST` | `[180]` | Look-back window (days) |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/kaladin` | PostgreSQL connection string for Prisma |

---

## Data preparation

Insight data must be exported from Lichess into PostgreSQL first. Once the
database is populated, build the training files:

```bash
# Build insights.parquet + users.csv from PostgreSQL, then cache train/valid/test splits
PYTHONPATH=src uv run python - <<'EOF'
from config import settings
from data.loader import build_training_dataset
build_training_dataset(settings)
EOF
```

The loader writes cached split and dataset files under `DATA_DIR/cache/`.

---

## Training

```bash
PYTHONPATH=src uv run python -m model.trainer
```

Hyperband tuning runs for up to 50 epochs, then the best configuration is
retrained on train + valid combined. Weights are saved to:

```
model/weights/eval{USE_EVAL}_tc{TC}_days{DAYS}/model.keras
```

After training, generate the SHAP background cache (required for fast inference):

```bash
PYTHONPATH=src uv run python - <<'EOF'
from config import settings
from model.explainer import prepare_background
# pass your training input arrays here
prepare_background(train_inputs, settings.model_dir / "eval0_tc2_days180")
EOF
```

---

## Running the server

**Development** (auto-reload):
```bash
src/start.sh dev
```

**Production**:
```bash
src/start.sh prod
# or directly:
PYTHONPATH=src uv run uvicorn main:app --host 0.0.0.0 --port 8000
```

The interactive API docs are available at `http://localhost:8000/docs`.

---

## API

### `GET /health`

```json
{ "status": "ok", "version": "2.0.0" }
```

### `POST /analyse`

**Request**
```json
{ "users": ["user1", "user2"] }
```
Maximum 100 usernames per request.

**Response**
```json
{
  "results": [
    {
      "user": "user1",
      "score": 0.94,
      "insights": [
        "https://lichess.org/insights/user1/acpl/tc-2/days-180",
        "https://lichess.org/insights/user1/blur/tc-2/days-180",
        "https://lichess.org/insights/user1/movetime/tc-2/days-180"
      ],
      "tc": 2,
      "error": null
    }
  ]
}
```

`score` is the cheat probability in **[0, 1]**. `insights` are the top-3
Lichess insight URLs that most influenced the score. When a user cannot be
scored (e.g. insufficient data), `error` is set and `score` / `insights`
are `null`.

### `POST /ws-monitor/start` (ws-server integration)

Registers a new live game for timing-based anti-cheat monitoring.

```json
{
  "game_id": "room-uuid",
  "variant": "standard",
  "time_control": { "mode": "timed", "minutes": 5, "increment": 0 },
  "white_user_id": "user-a",
  "black_user_id": "user-b",
  "started_at_ms": 1735689600000
}
```

### `POST /ws-monitor/move`

Pushes a move event (recommended every move).

```json
{
  "game_id": "room-uuid",
  "ply": 17,
  "event_at_ms": 1735689665000,
  "move": {
    "color": "white",
    "uci": "e2e4",
    "move_time_ms": 924
  }
}
```

### `POST /ws-monitor/end`

Finalizes a game.

```json
{
  "game_id": "room-uuid",
  "event_at_ms": 1735689720000,
  "reason": "resign",
  "winner": "black"
}
```

### `GET /ws-monitor/game/{game_id}`

Returns live monitoring output for both players:
- per-player `score` in `[0,1]`
- `risk_level` (`low|medium|high`)
- timing metrics and flags

---

## Docker

```bash
# CPU (default)
./docker.sh cpu

# GPU
./docker.sh gpu

# Interactive dev shell
./docker.sh dev
```

Pass Postgres and model-weight paths via environment variables or a `.env` file:

```bash
docker run --rm \
  -e DATABASE_URL=postgresql://postgres:postgres@postgres:5432/kaladin \
  -v /path/to/model/weights:/app/model/weights:ro \
  -v /path/to/data:/app/data:ro \
  -p 8000:8000 \
  kaladin:latest
```

---

## Model weights

Weights are **not stored in git**. Mount the directory at runtime:

```
model/weights/
└── eval0_tc2_days180/
│   ├── model.keras
│   └── background.pkl
└── eval0_tc6_days180/
    ├── model.keras
    └── background.pkl
```

The directory structure is derived from `USE_EVAL`, `TC_LIST`, and
`DAYS_LIST` in config.

---

## Tests

```bash
# Start the server first, then:
PYTHONPATH=src uv run python src/tests/run_tests.py \
  --url http://localhost:8000

# Anonymise a BSON insight fixture before sharing:
PYTHONPATH=src uv run python src/tests/anon.py insight_test_case_10.bson
```

`run_tests.py` samples 1, 10, and 100 legit users from PostgreSQL, fires
`POST /analyse` for each batch, reports runtime, and pickles results to
`tests/test_case_{n}_result.pkl`.
