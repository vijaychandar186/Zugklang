import type { BunWS } from '../types';
import { rooms } from '../state';
import { send } from '../utils/socket';

export function handleSyncDice(
  ws: BunWS,
  msg: { roomId: string; pieces: [string, string, string] }
): void {
  const room = rooms.get(msg.roomId);
  if (!room || room.status !== 'active') return;
  const opponent = room.white.data.id === ws.data.id ? room.black : room.white;
  send(opponent, { type: 'dice_synced', pieces: msg.pieces });
}

export function handleSyncCard(
  ws: BunWS,
  msg: { roomId: string; rank: string; suit: string }
): void {
  const room = rooms.get(msg.roomId);
  if (!room || room.status !== 'active') return;
  const opponent = room.white.data.id === ws.data.id ? room.black : room.white;
  send(opponent, { type: 'card_synced', rank: msg.rank, suit: msg.suit });
}

export function handleSyncTriDMove(
  ws: BunWS,
  msg: { roomId: string; move: string }
): void {
  const room = rooms.get(msg.roomId);
  if (!room || room.status !== 'active') return;
  const opponent = room.white.data.id === ws.data.id ? room.black : room.white;
  send(opponent, { type: 'trid_move_received', move: msg.move });
}
