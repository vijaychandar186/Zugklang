# Zugklang – Development Notes

## Postgres (Docker)

```bash
docker run -d --name zugklang-postgres \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e POSTGRES_DB=mydatabase \
  -p 5432:5432 \
  -v zugklang-pg-data:/var/lib/postgresql/data \
  postgres:16-alpine
```

---

## TODO

### Infrastructure

* [x] ~~Stockfish 18 integration~~
* [ ] Redis setup
* [ ] BullMQ setup
* [ ] Kubernetes setup
* [ ] GitHub Secrets setup
* [ ] Fix docker-compose-prod

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
* [x] ~~Rated/Unrated~~
* [ ] Invite through email
* [ ] Elo calculation adjustment
* [ ] Three Dimensional Chess
* [ ] Update dev dockerfile to use prisma dev postgres server

### Frontend

* [x] ~~CSS files cleanup~~
