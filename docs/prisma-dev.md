# Prisma Dev — Local Database Feature

## What `npx prisma init --output ./src/generated/prisma` Does

Running this command (without `--db`) does **not** create or provide a database. It:

1. Creates `prisma/schema.prisma` with the generator output path set to `./src/generated/prisma`
2. Creates a `prisma.config.ts` file
3. Creates a `.env` file with a **placeholder** `DATABASE_URL` you must fill in manually
4. Creates a `.gitignore`

### Actual terminal output from running it:

```
Initialized Prisma in your project

  prisma/
    schema.prisma
  prisma.config.ts
  .env
  .gitignore

Next, choose how you want to set up your database:

CONNECT EXISTING DATABASE:
  1. Configure your DATABASE_URL in prisma.config.ts
  2. Run prisma db pull to introspect your database.

CREATE NEW DATABASE:
  Local: npx prisma dev (runs Postgres locally in your terminal)
  Cloud: npx create-db (creates a free Prisma Postgres database)

Then, define your models in prisma/schema.prisma and run prisma migrate dev to apply your schema.

Learn more: https://pris.ly/getting-started
```

The `--output ./src/generated/prisma` flag only sets **where the Prisma Client JS files are generated** — not anything about the database.

---

## What `npx prisma dev` Does

`npx prisma dev` is a newer Prisma feature that **spins up a bundled local Postgres server** in your terminal. No Docker required for the database itself.

### Actual terminal output from running it:

```
Loaded Prisma config from prisma.config.ts.

Fetching latest updates for this subcommand...
✔  Great Success! 😉👍

   Your _prisma dev_ server default is ready and listening on ports 51213-51215.

┌─────────────── △  press a key  △ ──────────────────┐
│                                                    │
│   h  print http url   t  print tcp urls   q  quit  │
│                                                    │
└────────────────────────────────────────────────────┘
```

### Port layout it creates:

| Port  | Role                                           |
|-------|------------------------------------------------|
| 51213 | Prisma proxy — your app connects here          |
| 51214 | Actual Postgres instance                       |
| 51215 | Shadow database (used by `prisma migrate dev`) |

### The `.env` it populates:

```
DATABASE_URL="prisma+postgres://localhost:51213/?api_key=eyJkYXRhYmFzZVVybCI6InBvc3RncmVzOi8vcG9zdGdyZXM6cG9zdGdyZXNAbG9jYWxob3N0OjUxMjE0L3RlbXBsYXRlMT9zc2xtb2RlPWRpc2FibGUmY29ubmVjdGlvbl9saW1pdD0xJmNvbm5lY3RfdGltZW91dD0wJm1heF9pZGxlX2Nvbm5lY3Rpb25fbGlmZXRpbWU9MCZwb29sX3RpbWVvdXQ9MCZzaW5nbGVfdXNlX2Nvbm5lY3Rpb25zPXRydWUmc29ja2V0X3RpbWVvdXQ9MCIsIm5hbWUiOiJkZWZhdWx0Iiwic2hhZG93RGF0YWJhc2VVcmwiOiJwb3N0Z3JlczovL3Bvc3RncmVzOnBvc3RncmVzQGxvY2FsaG9zdDo1MTIxNS90ZW1wbGF0ZTE_c3NsbW9kZT1kaXNhYmxlJmNvbm5lY3Rpb25fbGltaXQ9MSZjb25uZWN0X3RpbWVvdXQ9MCZtYXhfaWRsZV9jb25uZWN0aW9uX2xpZmV0aW1lPTAmcG9vbF90aW1lb3V0PTAmc2luZ2xlX3VzZV9jb25uZWN0aW9ucz10cnVlJnNvY2tldF90aW1lb3V0PTAifQ"
```

The `api_key` is a base64-encoded JSON blob containing:
- The actual Postgres connection string (`postgres://postgres:postgres@localhost:51214/template1`)
- The shadow DB connection string (`postgres://postgres:postgres@localhost:51215/template1`)
- Pool/timeout settings for local dev

---

## Command Comparison

| Command | Creates a DB? | Where? | Use case |
|---|---|---|---|
| `npx prisma init --output ./src/generated/prisma` | No | — | Sets up schema + output path only |
| `npx prisma init --db --output ./src/generated/prisma` | Yes | Prisma Postgres cloud | Quick cloud DB, requires Prisma account |
| `npx prisma dev` | Yes | Host machine (localhost) | Local DB in terminal, no Docker |
| Docker `postgres:16-alpine` | Yes | Docker container | Self-contained, multi-service compose |

---

## Why This Project Keeps the Docker Postgres Container

`npx prisma dev` runs on the **host machine**, not inside Docker. For it to work with Dockerized services the `DATABASE_URL` would need to use `host.docker.internal:51213` instead of `postgres:5432`, and `npx prisma dev` would need to be running in a separate terminal at all times.

This project uses a multi-service compose stack (`frontend`, `ws-server`, `anti-cheat`) that all share the same `zugklang-net` Docker network and connect to the DB via `postgres:5432`. Keeping postgres containerized means:

1. Everything is self-contained — no separate terminal process required
2. All services reach the DB via the Docker service name (`postgres`) on the internal network
3. Data persists in the named volume `postgres_dev_data` across restarts
4. `docker compose up` is the single command to start everything

`npx prisma dev` is a great option for **standalone projects** where you want a quick local DB without any Docker setup at all. For this multi-service compose stack it is not the right fit.

---

## How the Prisma Client Output Path Works in This Project

The schema at [frontend/prisma/schema.prisma](../frontend/prisma/schema.prisma) sets:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}
```

The [frontend/Dockerfile.dev](../frontend/Dockerfile.dev) runs `pnpm prisma generate` during the image build, which generates the client to `/app/src/generated/prisma` inside the container.

The `docker-compose.dev.yaml` has an anonymous volume entry `/app/src/generated` that preserves these build-time generated files inside the container, preventing the host bind mount (`./frontend/src:/app/src`) from shadowing them.