import type { BunWS, Challenge, Room, FourPlayerLobby } from './types';
export const queues = new Map<string, BunWS[]>();
export const rooms = new Map<string, Room>();
export const challenges = new Map<string, Challenge>();
export const fourPlayerLobbies = new Map<string, FourPlayerLobby>();
export const reconnectTimeouts = new Map<
  string,
  ReturnType<typeof setTimeout>
>();
export const connectedUserIds = new Map<string, BunWS>();
export const rejoinTokens = new Map<string, string>();
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
export function revokeRoomTokens(room: Room): void {
  const whiteId = room.white.data.id;
  const blackId = room.black.data.id;
  for (const [token, id] of rejoinTokens) {
    if (id === whiteId || id === blackId) {
      rejoinTokens.delete(token);
    }
  }
}
// 4-player lobby rejoin token infrastructure
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
