import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { handleHttpRequest } from '../handlers/http';
import { challenges, queues, reconnectTimeouts, rooms } from '../state';
import {
  asBunWs,
  createMockWs,
  createTestRoom,
  resetInMemoryState
} from './helpers';
describe('http handlers integration', () => {
  const originalAdminKey = process.env['ADMIN_KEY'];
  beforeEach(() => {
    resetInMemoryState();
  });
  afterEach(() => {
    if (originalAdminKey === undefined) delete process.env['ADMIN_KEY'];
    else process.env['ADMIN_KEY'] = originalAdminKey;
    resetInMemoryState();
  });
  test('returns health response for /health', async () => {
    const res = handleHttpRequest(new Request('http://localhost/health'));
    expect(res).toBeDefined();
    expect(res?.status).toBe(200);
    const body = (await res?.json()) as {
      status: string;
      uptime: number;
    };
    expect(body.status).toBe('ok');
    expect(typeof body.uptime).toBe('number');
  });
  test('protects /admin/stats with ADMIN_KEY', async () => {
    delete process.env['ADMIN_KEY'];
    const noConfig = handleHttpRequest(
      new Request('http://localhost/admin/stats')
    );
    expect(noConfig?.status).toBe(503);
    process.env['ADMIN_KEY'] = 'secret';
    const unauthorized = handleHttpRequest(
      new Request('http://localhost/admin/stats')
    );
    expect(unauthorized?.status).toBe(401);
  });
  test('reports state counts on /admin/stats', async () => {
    process.env['ADMIN_KEY'] = 'secret';
    const white = createMockWs('w1');
    const black = createMockWs('b1');
    const active = createTestRoom({
      id: '11111111-1111-1111-1111-111111111111',
      white: asBunWs(white),
      black: asBunWs(black),
      status: 'active'
    });
    const ended = createTestRoom({
      id: '22222222-2222-2222-2222-222222222222',
      white: asBunWs(white),
      black: asBunWs(black),
      status: 'ended'
    });
    rooms.set(active.id, active);
    rooms.set(ended.id, ended);
    challenges.set('33333333-3333-3333-3333-333333333333', {
      id: '33333333-3333-3333-3333-333333333333',
      creator: asBunWs(white),
      variant: 'standard',
      timeControl: { mode: 'timed', minutes: 3, increment: 0 },
      creatorColor: 'white',
      createdAt: Date.now()
    });
    queues.set('standard:timed:3:0', [asBunWs(white), asBunWs(black)]);
    reconnectTimeouts.set(
      'player-reconnect',
      setTimeout(() => {}, 60000)
    );
    const req = new Request('http://localhost/admin/stats', {
      headers: { authorization: 'Bearer secret' }
    });
    const res = handleHttpRequest(req);
    expect(res?.status).toBe(200);
    const body = (await res?.json()) as {
      activeRooms: number;
      endedRooms: number;
      challenges: number;
      queuedPlayers: number;
      reconnectingPlayers: number;
    };
    expect(body).toMatchObject({
      activeRooms: 1,
      endedRooms: 1,
      challenges: 1,
      queuedPlayers: 2,
      reconnectingPlayers: 1
    });
  });
});
