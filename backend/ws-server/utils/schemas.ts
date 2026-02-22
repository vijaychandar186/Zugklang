import { z } from 'zod';
const SquareSchema = z
  .string()
  .regex(/^[a-h][1-8]$/, 'Must be a valid square (e.g. e2)');
const PromotionSchema = z.enum(['q', 'r', 'b', 'n']);
const CreatorColorSchema = z.enum(['white', 'black', 'random']);
const CustomModeSchema = z.enum(['dice-chess', 'card-chess', 'four-player']);
export const TimeControlSchema = z.object({
  mode: z.enum(['unlimited', 'timed', 'custom']),
  minutes: z.number().int().min(0).max(180),
  increment: z.number().int().min(0).max(60)
});
const DisplayInfoSchema = {
  displayName: z.string().max(100).optional(),
  userImage: z.string().max(500).nullable().optional()
};
export const ClientMessageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('join_queue'),
    variant: z.string().min(1).max(32),
    timeControl: TimeControlSchema,
    ...DisplayInfoSchema
  }),
  z.object({ type: z.literal('leave_queue') }),
  z.object({
    type: z.literal('rejoin_room'),
    roomId: z.string().uuid(),
    rejoinToken: z.string().uuid()
  }),
  z.object({
    type: z.literal('create_challenge'),
    variant: z.string().min(1).max(32),
    timeControl: TimeControlSchema,
    color: CreatorColorSchema,
    ...DisplayInfoSchema
  }),
  z.object({
    type: z.literal('join_challenge'),
    challengeId: z.string().uuid(),
    ...DisplayInfoSchema
  }),
  z.object({ type: z.literal('cancel_challenge') }),
  z.object({
    type: z.literal('move'),
    roomId: z.string().uuid(),
    from: SquareSchema,
    to: SquareSchema,
    promotion: PromotionSchema.optional()
  }),
  z.object({ type: z.literal('abort'), roomId: z.string().uuid() }),
  z.object({ type: z.literal('resign'), roomId: z.string().uuid() }),
  z.object({ type: z.literal('offer_draw'), roomId: z.string().uuid() }),
  z.object({ type: z.literal('accept_draw'), roomId: z.string().uuid() }),
  z.object({ type: z.literal('decline_draw'), roomId: z.string().uuid() }),
  z.object({
    type: z.literal('game_over_notify'),
    roomId: z.string().uuid(),
    result: z.string().max(120),
    reason: z.string().max(50)
  }),
  z.object({ type: z.literal('ping') }),
  z.object({
    type: z.literal('latency_update'),
    latencyMs: z.number().int().min(0).max(30000)
  }),
  z.object({ type: z.literal('offer_rematch') }),
  z.object({ type: z.literal('accept_rematch') }),
  z.object({ type: z.literal('decline_rematch') }),
  z.object({
    type: z.literal('create_custom_room'),
    mode: CustomModeSchema,
    ...DisplayInfoSchema
  }),
  z.object({
    type: z.literal('join_custom_room'),
    roomId: z.string().uuid(),
    ...DisplayInfoSchema
  }),
  z.object({ type: z.literal('leave_custom_room') }),
  z.object({
    type: z.literal('custom_state'),
    roomId: z.string().uuid(),
    state: z.unknown()
  }),
  z.object({
    type: z.literal('join_custom_queue'),
    mode: z.enum(['dice-chess', 'card-chess']),
    ...DisplayInfoSchema
  }),
  z.object({ type: z.literal('leave_custom_queue') })
]);
export type ClientMessage = z.infer<typeof ClientMessageSchema>;
