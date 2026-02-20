/* global __ENV */
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '15s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500']
  }
};

const baseUrl = __ENV.BASE_URL || 'http://127.0.0.1:8080';

export default function () {
  const res = http.get(`${baseUrl}/health`);
  check(res, {
    'health status is 200': (r) => r.status === 200,
    'health body contains ok': (r) => r.body.includes('"status":"ok"')
  });
  sleep(1);
}
