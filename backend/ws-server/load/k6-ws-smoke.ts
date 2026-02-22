import { check } from 'k6';
import ws from 'k6/ws';

declare const __ENV: Record<string, string | undefined>;

export const options = {
  vus: 2,
  iterations: 2
};

const wsBaseUrl = __ENV['WS_URL'] || 'ws://127.0.0.1:8080';
const token = __ENV['WS_TOKEN'];

if (!token) {
  throw new Error('WS_TOKEN is required for k6-ws-smoke.ts');
}

export default function () {
  const url = `${wsBaseUrl}?token=${token}`;
  const res = ws.connect(url, {}, (socket) => {
    socket.on('open', () => {
      socket.send(JSON.stringify({ type: 'ping' }));
    });

    socket.on('message', (data) => {
      const msg = JSON.parse(String(data)) as { type?: string };
      if (msg.type === 'pong') {
        socket.close();
      }
    });
  });

  check(res, {
    'ws connected': (r) => r && r.status === 101
  });
}
