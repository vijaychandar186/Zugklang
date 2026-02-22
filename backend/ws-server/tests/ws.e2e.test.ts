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
  test('health endpoint responds and authenticated clients can match', async () => {
    const health = await fetch(`${wsBaseUrl}/health`);
    expect(health.status).toBe(200);
    const body = (await health.json()) as {
      status: string;
    };
    expect(body.status).toBe('ok');
    const wsA = new WebSocket(`ws://127.0.0.1:${wsPort}?token=user-a`);
    const wsB = new WebSocket(`ws://127.0.0.1:${wsPort}?token=user-b`);
    await waitForOpen(wsA);
    await waitForOpen(wsB);
    await waitForMessage(wsA, (m) => m.type === 'connected');
    await waitForMessage(wsB, (m) => m.type === 'connected');
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
});
