import type { BunWS, Challenge, Room } from './types';

export const queues = new Map<string, BunWS[]>();
export const rooms = new Map<string, Room>();
export const challenges = new Map<string, Challenge>();
export const reconnectTimeouts = new Map<
  string,
  ReturnType<typeof setTimeout>
>();

/** token → playerId: one token per player per active game */
export const rejoinTokens = new Map<string, string>();

/** Issue a fresh rejoin token for a player, revoking any existing one first. */
export function issueRejoinToken(playerId: string): string {
  for (const [token, id] of rejoinTokens) {
    if (id === playerId) {
      rejoinTokens.delete(token);
      break;
    }
  }
  const token = crypto.randomUUID();
  rejoinTokens.set(token, playerId);
  return token;
}

/** Revoke tokens for both players in a room — call when the game ends. */
export function revokeRoomTokens(room: Room): void {
  const whiteId = room.white.data.id;
  const blackId = room.black.data.id;
  for (const [token, id] of rejoinTokens) {
    if (id === whiteId || id === blackId) {
      rejoinTokens.delete(token);
    }
  }
}
