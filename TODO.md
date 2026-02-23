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

* [x] ~~Flags~~
* [ ] Guest mode
* [x] ~~Theme and Audio Settings~~
* [ ] Invite through email
* [ ] ELO-wise queue logic toggle where it can be enabled or disabled
* [ ] Elo calculation adjustment
* [ ] Three Dimensional Chess
* [x] ~~Validate abandon~~
* [x] ~~Auto abort~~
* [x] ~~4p Chess Multiplayer~~
* [x] ~~Stats for Dice and Card Chess~~
* [x] ~~Config for auto abort and WS-server states~~
* [x] ~~Dice and card pick sound assets~~

### Frontend

* [x] ~~CSS files cleanup~~
