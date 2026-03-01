import type { Color, Room } from '../types';
import { logger } from '../utils/logger';

interface RoomTelemetry {
  startedAtMs: number;
  turnStartedAtMs: number;
  plyCount: number;
}

const ANTI_CHEAT_URL = process.env['ANTI_CHEAT_URL']?.replace(/\/+$/, '') ?? '';
const ANTI_CHEAT_TOKEN = process.env['ANTI_CHEAT_MONITOR_TOKEN'] ?? '';
const ANTI_CHEAT_TIMEOUT_MS = Number.parseInt(
  process.env['ANTI_CHEAT_TIMEOUT_MS'] ?? '1500',
  10
);
const ANTI_CHEAT_PUSH_EVERY_N_MOVES = Math.max(
  1,
  Number.parseInt(process.env['ANTI_CHEAT_PUSH_EVERY_N_MOVES'] ?? '1', 10)
);

const roomTelemetry = new Map<string, RoomTelemetry>();

function enabled(): boolean {
  return ANTI_CHEAT_URL.length > 0;
}

function monitorHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'content-type': 'application/json'
  };
  if (ANTI_CHEAT_TOKEN) headers['x-ws-monitor-token'] = ANTI_CHEAT_TOKEN;
  return headers;
}

async function postMonitor(path: string, payload: unknown): Promise<void> {
  if (!enabled()) return;
  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), ANTI_CHEAT_TIMEOUT_MS);
  try {
    const res = await fetch(`${ANTI_CHEAT_URL}${path}`, {
      method: 'POST',
      headers: monitorHeaders(),
      body: JSON.stringify(payload),
      signal: ctrl.signal
    });
    if (!res.ok) {
      const body = await res.text();
      logger.warn('anti_cheat_monitor_failed', {
        path,
        status: res.status,
        body: body.slice(0, 250)
      });
    }
  } catch (err) {
    logger.warn('anti_cheat_monitor_unreachable', {
      path,
      error: err instanceof Error ? err.message : String(err)
    });
  } finally {
    clearTimeout(timeout);
  }
}

export function antiCheatOnGameStart(room: Room): void {
  if (!enabled()) return;
  const startedAtMs = Date.now();
  roomTelemetry.set(room.id, {
    startedAtMs,
    turnStartedAtMs: startedAtMs,
    plyCount: 0
  });
  void postMonitor('/ws-monitor/start', {
    game_id: room.id,
    variant: room.variant,
    time_control: room.timeControl,
    white_user_id: room.white.data.userId ?? room.white.data.id,
    black_user_id: room.black.data.userId ?? room.black.data.id,
    started_at_ms: startedAtMs
  });
}

export function antiCheatOnMove(
  room: Room,
  move: {
    color: Color;
    uci: string;
    moveTimeMs?: number;
  }
): void {
  if (!enabled()) return;
  const telemetry = roomTelemetry.get(room.id);
  if (!telemetry) return;

  const now = Date.now();
  const derivedMoveTimeMs = Math.max(
    0,
    Math.floor(move.moveTimeMs ?? now - telemetry.turnStartedAtMs)
  );
  telemetry.turnStartedAtMs = now;
  telemetry.plyCount += 1;

  if (telemetry.plyCount % ANTI_CHEAT_PUSH_EVERY_N_MOVES !== 0) return;

  void postMonitor('/ws-monitor/move', {
    game_id: room.id,
    ply: telemetry.plyCount,
    event_at_ms: now,
    move: {
      color: move.color,
      uci: move.uci,
      move_time_ms: derivedMoveTimeMs,
      white_time_ms: room.whiteTimeMs,
      black_time_ms: room.blackTimeMs
    }
  });
}

export function antiCheatOnGameEnd(
  room: Room,
  reason: string,
  winner: Color | null
): void {
  if (!enabled()) return;
  if (!roomTelemetry.has(room.id)) return;

  roomTelemetry.delete(room.id);
  void postMonitor('/ws-monitor/end', {
    game_id: room.id,
    event_at_ms: Date.now(),
    reason,
    winner
  });
}
