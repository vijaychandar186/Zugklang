# Testing Guide (`ws-server`)

This document describes the testing setup for `backend/ws-server`, including local execution and CI automation.

## Test Types

- Unit tests: Validate isolated utilities and pure logic.
- Integration tests: Validate handler/state interactions.
- End-to-end (E2E) tests: Boot real `ws-server` and run real WebSocket flow.
- Load/stress tests: Validate runtime behavior under traffic with k6.

## Test Files

Location: `backend/ws-server/tests`

- Unit:
  - `auth.test.ts`
  - `chess.test.ts`
  - `fen.test.ts`
  - `rateLimit.test.ts`
  - `schemas.test.ts`
  - `socket.test.ts`
  - `state.test.ts`
  - `validate.test.ts`
- Integration:
  - `challenge.integration.test.ts`
  - `connection.integration.test.ts`
  - `game.integration.test.ts`
  - `http.integration.test.ts`
  - `queue-game.integration.test.ts`
- E2E:
  - `ws.e2e.test.ts`

## Local Commands

From `backend/ws-server`:

```bash
# Type check
bunx tsc --noEmit

# Run test suite (unit + integration by default)
bun test

# Run E2E too
RUN_WS_E2E=1 bun test

# Run coverage gate (85% line coverage minimum)
./scripts/check-coverage.sh 85
# or
bun run test:coverage
```

## Coverage Gate

- Script: `backend/ws-server/scripts/check-coverage.sh`
- Reads Bun coverage output and fails if line coverage is below threshold.
- Current CI threshold: `85%` lines.

## Load/Stress Tests (k6)

Location: `backend/ws-server/load`

- Smoke health check: `k6-health-smoke.js`
- Stress health check: `k6-health-stress.js`
- WS smoke: `k6-ws-smoke.js`

Run examples:

```bash
# Health smoke
k6 run load/k6-health-smoke.js

# Health stress
k6 run load/k6-health-stress.js
```

For WebSocket smoke:

```bash
# WS token must be valid for ws-server auth flow
WS_TOKEN=<valid-token> WS_URL=ws://127.0.0.1:8080 k6 run load/k6-ws-smoke.js
```

## CI/CD Automation

Workflow: `.github/workflows/ws-server-ci.yml`

Triggers:
- Pull requests touching `backend/ws-server/**`
- Pushes to `main` touching `backend/ws-server/**` (includes merges)

Jobs:
1. `ws-server-tests`
   - Install deps (`bun install --frozen-lockfile`)
   - Typecheck (`bunx tsc --noEmit`)
   - Run tests (`RUN_WS_E2E=1 bun test`)
   - Enforce coverage (`./scripts/check-coverage.sh 85`)
2. `ws-server-load`
   - Start `ws-server`
   - Run k6 smoke (`k6-health-smoke.js`)
   - Run k6 stress (`k6-health-stress.js`)

## Branch Protection Recommendation

To enforce testing before merge, require these checks on `main`:

- `WS Server CI / ws-server-tests`
- `WS Server CI / ws-server-load`
