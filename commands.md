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

### Frontend

* [ ] CSS files cleanup
