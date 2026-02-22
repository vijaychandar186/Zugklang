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

* [ ] Redis setup
* [ ] BullMQ setup
* [ ] Fix docker-compose-prod
* [ ] Stockfish 18 integration

### Payments

* [ ] Stripe integration

### Observability

* [ ] OpenTelemetry setup
* [ ] Sentry integration

### Features

* [ ] Flags
* [ ] Guest mode
* [ ] Invite through email
* [ ] ELO-wise queue logic
* [ ] Elo calculation adjustment
* [ ] Validate abandon
* [ ] Auto abort
* [ ] 4p Chess Multiplayer
* [ ] Stats for Dice and Card Chess
* [ ] ~~Config for auto abort and WS-server states~~
* [ ] ~~Dice and card pick sound assets~~

### Frontend

* [x] ~~CSS files cleanup~~
