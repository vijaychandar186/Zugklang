import { redis, POD_ID } from '../redis';
import { connectedUserIds } from '../state';

/**
 * Send a JSON message to a user by their userId.
 * - If the user's WebSocket is connected locally, sends directly.
 * - Otherwise publishes to their pod's inbound channel so the owning pod can
 *   forward the message to the live connection.
 */
export async function sendToUser(
  userId: string,
  message: object
): Promise<void> {
  const ws = connectedUserIds.get(userId);
  if (ws) {
    try {
      ws.send(JSON.stringify(message));
    } catch {
      void 0;
    }
    return;
  }
  // Route to the pod that holds this user's WebSocket.
  const podId = await redis.get(`ws:user:${userId}:pod`);
  if (podId && podId !== POD_ID) {
    await redis.publish(
      `ws:pod:${podId}:in`,
      JSON.stringify({ type: 'direct', userId, payload: message })
    );
  }
}

/**
 * Forward a game message from a cross-pod player to the pod that owns their
 * game room, so it can be processed there.
 */
export async function relayToRoomPod(
  roomId: string,
  fromUserId: string,
  fromSessionId: string,
  fromColor: string,
  message: object
): Promise<void> {
  const ownerPodId = await redis.get(`room:${roomId}:pod`);
  if (ownerPodId && ownerPodId !== POD_ID) {
    await redis.publish(
      `ws:pod:${ownerPodId}:in`,
      JSON.stringify({
        type: 'relay',
        roomId,
        fromUserId,
        fromSessionId,
        fromColor,
        payload: message
      })
    );
  }
}
