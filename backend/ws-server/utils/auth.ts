const NEXT_APP_URL = (
  process.env['NEXT_APP_URL'] ?? 'http://localhost:3000'
).replace(/\/$/, '');
const INTROSPECT_URL = `${NEXT_APP_URL}/api/ws-token`;
export async function verifyWsToken(token: string): Promise<string | null> {
  try {
    const res = await fetch(INTROSPECT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      signal: AbortSignal.timeout(5000)
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      userId?: string;
    };
    return typeof data.userId === 'string' ? data.userId : null;
  } catch {
    return null;
  }
}
