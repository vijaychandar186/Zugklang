# Zugklang – Development Notes

## Postgres (Docker)

Both `zugklang-frontend` and `zugklang-anti-cheat` databases need to exist before running the app.

### With Docker Compose (recommended)

`postgres/init.sql` creates both databases automatically on first container start:

```bash
docker-compose -f docker-compose.dev.yaml up --build
```

```bash
nohup ngrok http --url=unmellifluently-unforcible-ricky.ngrok-free.dev 80 >/dev/null 2>&1 &
```

```bash
unmellifluently-unforcible-ricky.ngrok-free.dev
```

### Without Docker Compose (manual)

```bash
# 1) Pull image
docker pull postgres:16-alpine

# 2) Run container
docker run -d --name zugklang-postgres \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -p 5432:5432 \
  -v zugklang-pg-data:/var/lib/postgresql/data \
  postgres:16-alpine

# 3) Wait for postgres to be ready
docker exec zugklang-postgres pg_isready -U admin

# 4) Create both databases
docker exec zugklang-postgres psql -U admin -d postgres -c 'CREATE DATABASE "zugklang-frontend";'
docker exec zugklang-postgres psql -U admin -d postgres -c 'CREATE DATABASE "zugklang-anti-cheat";'

# 5) Verify
docker exec zugklang-postgres psql -U admin -d postgres -c "\l"
```

## TODO

### Infrastructure

* [x] ~~Stockfish 18 integration~~
* [ ] Redis setup
* [ ] BullMQ setup
* [ ] Kubernetes setup
* [ ] GitHub Secrets setup
* [x] ~~Fix docker-compose-prod~~

### Payments

* [ ] Stripe integration

### Observability

* [ ] OpenTelemetry setup
* [ ] Prometheus setup
* [ ] Grafana setup
* [ ] Sentry integration

### Features

* [x] ~~Flags~~
* [x] ~~Theme and Audio Settings~~
* [x] ~~ELO-wise queue logic toggle where it can be enabled or disabled~~
* [x] ~~Validate abandon~~
* [x] ~~Auto abort~~
* [x] ~~4p Chess Multiplayer~~
* [x] ~~Stats for Dice and Card Chess~~
* [x] ~~Config for auto abort and WS-server states~~
* [x] ~~Dice and card pick sound assets~~
* [ ] Guest mode
* [ ] AntiCheat validation
* [x] ~~AntiCheat Ruff lint and formatter integration~~
* [ ] AntiCheat dashboard
* [ ] AntiCheat metrics
* [x] ~~Rated/Unrated~~
* [ ] Invite through email
* [ ] Elo calculation adjustment
* [x] ~~Three Dimensional Chess~~
* [ ] Update dev dockerfile to use prisma dev postgres server

### Frontend

* [x] ~~CSS files cleanup~~
* [x] ~~Unit tests setup and coverage for core frontend logic/components~~
* [x] ~~Integration tests for key frontend user flows~~
