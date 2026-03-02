import type { BunWS, Room } from './types';
import { redis } from './redis';
import { REJOIN_TOKEN_TTL_SEC } from './config';

export const rooms = new Map<string, Room>();
export const challenges = new Map<string, import('./types').Challenge>();
export const fourPlayerLobbies = new Map<
  string,
  import('./types').FourPlayerLobby
>();
export const connectedUserIds = new Map<string, BunWS>();

export async function issueRejoinToken(
  playerId: string,
  roomId: string
): Promise<string> {
  // Revoke any existing token for this player first.
  const existingKey = await redis.get(`ws:rejoin:player:${playerId}`);
  if (existingKey) {
    await redis.del(`ws:rejoin:${existingKey}`);
  }

  const token = crypto.randomUUID();
  const { POD_ID } = await import('./redis');
  const payload = JSON.stringify({ playerId, roomId, podId: POD_ID });
  await redis.set(`ws:rejoin:${token}`, payload, 'EX', REJOIN_TOKEN_TTL_SEC);
  await redis.set(
    `ws:rejoin:player:${playerId}`,
    token,
    'EX',
    REJOIN_TOKEN_TTL_SEC
  );
  return token;
}

export async function resolveRejoinToken(
  token: string
): Promise<{ playerId: string; roomId: string; podId: string } | null> {
  const raw = await redis.get(`ws:rejoin:${token}`);
  if (!raw) return null;
  return JSON.parse(raw) as { playerId: string; roomId: string; podId: string };
}

export async function revokeRoomTokens(room: Room): Promise<void> {
  const whiteId = room.whiteSessionId;
  const blackId = room.blackSessionId;
  const [whiteTok, blackTok] = await Promise.all([
    redis.get(`ws:rejoin:player:${whiteId}`),
    redis.get(`ws:rejoin:player:${blackId}`)
  ]);
  const delKeys: string[] = [];
  if (whiteTok) {
    delKeys.push(`ws:rejoin:${whiteTok}`, `ws:rejoin:player:${whiteId}`);
  }
  if (blackTok) {
    delKeys.push(`ws:rejoin:${blackTok}`, `ws:rejoin:player:${blackId}`);
  }
  if (delKeys.length) await redis.del(...delKeys);
}

export const fourPlayerRejoinTokens = new Map<string, string>(); // token → playerId
export const fourPlayerReconnectTimeouts = new Map<
  string,
  ReturnType<typeof setTimeout>
>(); // playerId → timeout
export function issueFourPlayerRejoinToken(playerId: string): string {
  for (const [token, id] of fourPlayerRejoinTokens) {
    if (id === playerId) {
      fourPlayerRejoinTokens.delete(token);
      break;
    }
  }
  const token = crypto.randomUUID();
  fourPlayerRejoinTokens.set(token, playerId);
  return token;
}
