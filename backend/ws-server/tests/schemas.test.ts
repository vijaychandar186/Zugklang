import { describe, expect, test } from 'bun:test';
import { ClientMessageSchema } from '../utils/schemas';
describe('client message schema', () => {
  test('accepts valid join_queue message', () => {
    const result = ClientMessageSchema.safeParse({
      type: 'join_queue',
      variant: 'standard',
      timeControl: { mode: 'timed', minutes: 3, increment: 0 },
      displayName: 'Alice',
      userImage: null
    });
    expect(result.success).toBe(true);
  });
  test('rejects invalid move square', () => {
    const result = ClientMessageSchema.safeParse({
      type: 'move',
      roomId: '11111111-1111-1111-1111-111111111111',
      from: 'z9',
      to: 'e4'
    });
    expect(result.success).toBe(false);
  });
  test('rejects invalid latency range', () => {
    const result = ClientMessageSchema.safeParse({
      type: 'latency_update',
      latencyMs: 50000
    });
    expect(result.success).toBe(false);
  });
});
