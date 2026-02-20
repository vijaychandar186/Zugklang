/**
 * WS token verification via token introspection.
 *
 * The Next.js frontend issues a one-time UUID token via GET /api/ws-token.
 * We verify it by calling POST /api/ws-token (same route, different method)
 * on the internal network — no shared secrets needed.
 *
 * NEXT_APP_URL defaults to http://localhost:3000 for local dev outside Docker.
 */

const NEXT_APP_URL = (
  process.env['NEXT_APP_URL'] ?? 'http://localhost:3000'
).replace(/\/$/, '');

const INTROSPECT_URL = `${NEXT_APP_URL}/api/ws-token`;

/**
 * Exchange a one-time token for the userId it represents.
 * Returns null if the token is invalid, expired, or the network call fails.
 */
export async function verifyWsToken(token: string): Promise<string | null> {
  try {
    const res = await fetch(INTROSPECT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      // Abort after 5 s to avoid blocking the WS upgrade indefinitely
      signal: AbortSignal.timeout(5_000)
    });

    if (!res.ok) return null;

    const data = (await res.json()) as { userId?: string };
    return typeof data.userId === 'string' ? data.userId : null;
  } catch {
    return null;
  }
}
