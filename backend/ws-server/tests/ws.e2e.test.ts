import { afterAll, beforeAll, describe, expect, test } from 'bun:test';

type JsonMessage = {
  type?: string;
  [key: string]: unknown;
};

const RUN_WS_E2E = process.env['RUN_WS_E2E'] === '1';

function randomPort(min = 40000, max = 59999): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function waitForHealth(url: string, timeoutMs = 10000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${url}/health`);
      if (res.ok) return;
    } catch {
      void 0;
    }
    await Bun.sleep(150);
  }
  throw new Error('ws-server did not become healthy in time');
}

function waitForOpen(ws: WebSocket): Promise<void> {
  return new Promise((resolve, reject) => {
    const onOpen = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error('websocket failed to open'));
    };
    const cleanup = () => {
      ws.removeEventListener('open', onOpen);
      ws.removeEventListener('error', onError);
    };
    ws.addEventListener('open', onOpen);
    ws.addEventListener('error', onError);
  });
}

function waitForMessage(
  ws: WebSocket,
  predicate: (msg: JsonMessage) => boolean,
  timeoutMs = 5000
): Promise<JsonMessage> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error('timed out waiting for websocket message'));
    }, timeoutMs);
    const onMessage = (event: MessageEvent<string>) => {
      const parsed = JSON.parse(event.data) as JsonMessage;
      if (predicate(parsed)) {
        cleanup();
        resolve(parsed);
      }
    };
    const onError = () => {
      cleanup();
      reject(new Error('websocket message error'));
    };
    const cleanup = () => {
      clearTimeout(timer);
      ws.removeEventListener('message', onMessage as EventListener);
      ws.removeEventListener('error', onError);
    };
    ws.addEventListener('message', onMessage as EventListener);
    ws.addEventListener('error', onError);
  });
}

/** Connect two clients, join the same queue, and wait until both are matched. */
async function matchTwoPlayers(
  wsPort: number,
  tokenA: string,
  tokenB: string
): Promise<{
  wsA: WebSocket;
  wsB: WebSocket;
  roomId: string;
  matchedA: JsonMessage;
  matchedB: JsonMessage;
}> {
  const wsA = new WebSocket(`ws://127.0.0.1:${wsPort}?token=${tokenA}`);
  const wsB = new WebSocket(`ws://127.0.0.1:${wsPort}?token=${tokenB}`);
  const connectedA = waitForMessage(wsA, (m) => m.type === 'connected');
  const connectedB = waitForMessage(wsB, (m) => m.type === 'connected');
  await waitForOpen(wsA);
  await waitForOpen(wsB);
  await connectedA;
  await connectedB;

  wsA.send(
    JSON.stringify({
      type: 'join_queue',
      variant: 'standard',
      timeControl: { mode: 'timed', minutes: 3, increment: 0 }
    })
  );
  wsB.send(
    JSON.stringify({
      type: 'join_queue',
      variant: 'standard',
      timeControl: { mode: 'timed', minutes: 3, increment: 0 }
    })
  );

  const [matchedA, matchedB] = await Promise.all([
    waitForMessage(wsA, (m) => m.type === 'matched'),
    waitForMessage(wsB, (m) => m.type === 'matched')
  ]);

  const roomId = matchedA['roomId'] as string;
  expect(roomId).toBe(matchedB['roomId'] as string);
  return { wsA, wsB, roomId, matchedA, matchedB };
}

(RUN_WS_E2E ? describe : describe.skip)('ws-server end-to-end', () => {
  let authServer: ReturnType<typeof Bun.serve> | undefined;
  let wsProcess: Bun.Subprocess<'ignore', 'pipe', 'pipe'> | undefined;
  let authPort = 0;
  let wsPort = 0;
  let wsBaseUrl = '';

  beforeAll(async () => {
    for (let i = 0; i < 20; i++) {
      const candidate = randomPort();
      try {
        authServer = Bun.serve({
          port: candidate,
          async fetch(req) {
            const { pathname } = new URL(req.url);
            if (pathname !== '/api/ws-token' || req.method !== 'POST') {
              return new Response('Not found', { status: 404 });
            }
            const body = (await req.json()) as {
              token?: string;
            };
            if (!body.token)
              return new Response('Unauthorized', { status: 401 });
            return Response.json({ userId: body.token });
          }
        });
        authPort = candidate;
        break;
      } catch {
        void 0;
      }
    }
    if (!authServer) {
      throw new Error('Failed to start auth stub server');
    }
    for (let i = 0; i < 10; i++) {
      wsPort = randomPort();
      wsBaseUrl = `http://127.0.0.1:${wsPort}`;
      wsProcess = Bun.spawn(['bun', 'server.ts'], {
        cwd: '/workspaces/Zugklang/backend/ws-server',
        stdout: 'pipe',
        stderr: 'pipe',
        env: {
          ...process.env,
          PORT: String(wsPort),
          NEXT_APP_URL: `http://127.0.0.1:${authPort}`,
          ADMIN_KEY: 'e2e-admin-key'
        }
      });
      try {
        await waitForHealth(wsBaseUrl, 4000);
        break;
      } catch {
        wsProcess.kill();
        await wsProcess.exited;
        wsProcess = undefined;
      }
    }
    if (!wsProcess) {
      throw new Error('Failed to start ws-server process');
    }
  });

  afterAll(async () => {
    if (wsProcess) {
      wsProcess.kill();
      await wsProcess.exited;
    }
    authServer?.stop(true);
  });

  // ── basic connectivity & matching ──────────────────────────────────────────
  test('health endpoint responds and authenticated clients can match', async () => {
    const health = await fetch(`${wsBaseUrl}/health`);
    expect(health.status).toBe(200);
    const body = (await health.json()) as {
      status: string;
    };
    expect(body.status).toBe('ok');
    const wsA = new WebSocket(`ws://127.0.0.1:${wsPort}?token=user-a`);
    const wsB = new WebSocket(`ws://127.0.0.1:${wsPort}?token=user-b`);
    const connectedA = waitForMessage(wsA, (m) => m.type === 'connected');
    const connectedB = waitForMessage(wsB, (m) => m.type === 'connected');
    await waitForOpen(wsA);
    await waitForOpen(wsB);
    await connectedA;
    await connectedB;
    wsA.send(
      JSON.stringify({
        type: 'join_queue',
        variant: 'standard',
        timeControl: { mode: 'timed', minutes: 3, increment: 0 }
      })
    );
    wsB.send(
      JSON.stringify({
        type: 'join_queue',
        variant: 'standard',
        timeControl: { mode: 'timed', minutes: 3, increment: 0 }
      })
    );
    const matchedA = (await waitForMessage(
      wsA,
      (m) => m.type === 'matched'
    )) as {
      type: 'matched';
      roomId: string;
      color: 'white' | 'black';
    };
    const matchedB = (await waitForMessage(
      wsB,
      (m) => m.type === 'matched'
    )) as {
      type: 'matched';
      roomId: string;
      color: 'white' | 'black';
    };
    expect(matchedA.roomId).toBe(matchedB.roomId);
    expect(new Set([matchedA.color, matchedB.color]).size).toBe(2);
    wsA.close();
    wsB.close();
  });

  test('unauthenticated connection is rejected with 401', async () => {
    const res = await fetch(`${wsBaseUrl}`, {
      headers: { Upgrade: 'websocket' }
    });
    expect(res.status).toBe(401);
  });

  // ── ping / pong ────────────────────────────────────────────────────────────
  test('ping receives pong', async () => {
    const ws = new WebSocket(`ws://127.0.0.1:${wsPort}?token=ping-user`);
    const connected = waitForMessage(ws, (m) => m.type === 'connected');
    await waitForOpen(ws);
    await connected;

    ws.send(JSON.stringify({ type: 'ping' }));
    const pong = await waitForMessage(ws, (m) => m.type === 'pong');
    expect(pong.type).toBe('pong');
    ws.close();
  });

  // ── invalid messages ───────────────────────────────────────────────────────
  test('malformed JSON results in error message', async () => {
    const ws = new WebSocket(`ws://127.0.0.1:${wsPort}?token=bad-json-user`);
    const connected = waitForMessage(ws, (m) => m.type === 'connected');
    await waitForOpen(ws);
    await connected;

    ws.send('not valid json {{{');
    const err = (await waitForMessage(ws, (m) => m.type === 'error')) as {
      type: 'error';
      message: string;
    };
    expect(err.message).toContain('Malformed');
    ws.close();
  });

  test('unknown message type results in error message', async () => {
    const ws = new WebSocket(`ws://127.0.0.1:${wsPort}?token=unknown-msg-user`);
    const connected = waitForMessage(ws, (m) => m.type === 'connected');
    await waitForOpen(ws);
    await connected;

    ws.send(JSON.stringify({ type: 'this_does_not_exist' }));
    const err = (await waitForMessage(ws, (m) => m.type === 'error')) as {
      type: 'error';
      message: string;
    };
    expect(err.message).toBeTruthy();
    ws.close();
  });

  // ── sync_dice relay ────────────────────────────────────────────────────────
  test('sync_dice is relayed to opponent as dice_synced', async () => {
    const { wsA, wsB, roomId, matchedA } = await matchTwoPlayers(
      wsPort,
      'dice-user-a',
      'dice-user-b'
    );

    const senderWs = matchedA['color'] === 'white' ? wsA : wsB;
    const receiverWs = matchedA['color'] === 'white' ? wsB : wsA;

    senderWs.send(
      JSON.stringify({ type: 'sync_dice', roomId, pieces: ['q', 'n', 'b'] })
    );

    const synced = (await waitForMessage(
      receiverWs,
      (m) => m.type === 'dice_synced'
    )) as { type: 'dice_synced'; pieces: string[] };

    expect(synced.pieces).toEqual(['q', 'n', 'b']);
    wsA.close();
    wsB.close();
  });

  test('sync_dice with invalid roomId is rejected', async () => {
    const ws = new WebSocket(
      `ws://127.0.0.1:${wsPort}?token=bad-room-sync-user`
    );
    const connected = waitForMessage(ws, (m) => m.type === 'connected');
    await waitForOpen(ws);
    await connected;

    ws.send(
      JSON.stringify({
        type: 'sync_dice',
        roomId: 'not-a-uuid',
        pieces: ['k', 'q', 'n']
      })
    );

    const err = (await waitForMessage(ws, (m) => m.type === 'error')) as {
      type: 'error';
      message: string;
    };
    expect(err.message).toBeTruthy();
    ws.close();
  });

  // ── sync_card relay ────────────────────────────────────────────────────────
  test('sync_card is relayed to opponent as card_synced', async () => {
    const { wsA, wsB, roomId, matchedA } = await matchTwoPlayers(
      wsPort,
      'card-user-a',
      'card-user-b'
    );

    const senderWs = matchedA['color'] === 'white' ? wsA : wsB;
    const receiverWs = matchedA['color'] === 'white' ? wsB : wsA;

    senderWs.send(
      JSON.stringify({ type: 'sync_card', roomId, rank: 'K', suit: 'H' })
    );

    const synced = (await waitForMessage(
      receiverWs,
      (m) => m.type === 'card_synced'
    )) as { type: 'card_synced'; rank: string; suit: string };

    expect(synced.rank).toBe('K');
    expect(synced.suit).toBe('H');
    wsA.close();
    wsB.close();
  });

  test('sync_card with rank 10 is relayed correctly', async () => {
    const { wsA, wsB, roomId, matchedA } = await matchTwoPlayers(
      wsPort,
      'card10-user-a',
      'card10-user-b'
    );

    const senderWs = matchedA['color'] === 'white' ? wsA : wsB;
    const receiverWs = matchedA['color'] === 'white' ? wsB : wsA;

    senderWs.send(
      JSON.stringify({ type: 'sync_card', roomId, rank: '10', suit: 'D' })
    );

    const synced = (await waitForMessage(
      receiverWs,
      (m) => m.type === 'card_synced'
    )) as { type: 'card_synced'; rank: string; suit: string };

    expect(synced.rank).toBe('10');
    expect(synced.suit).toBe('D');
    wsA.close();
    wsB.close();
  });

  test('sync_card with invalid suit is rejected', async () => {
    const ws = new WebSocket(`ws://127.0.0.1:${wsPort}?token=bad-suit-user`);
    const connected = waitForMessage(ws, (m) => m.type === 'connected');
    await waitForOpen(ws);
    await connected;

    ws.send(
      JSON.stringify({
        type: 'sync_card',
        roomId: '11111111-1111-1111-1111-111111111111',
        rank: 'A',
        suit: 'Z'
      })
    );

    const err = (await waitForMessage(ws, (m) => m.type === 'error')) as {
      type: 'error';
      message: string;
    };
    expect(err.message).toBeTruthy();
    ws.close();
  });
});
