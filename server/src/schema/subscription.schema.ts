import { z } from 'zod'

// Since subscription toggle usually relies on URL params (channelId),
// we might not need a body schema unless we move to body-based toggling.
// But for consistency and future proofing, or for other endpoints:

// For checking subscription status or lists, we might mainly use query params.
// Let's define a basic schema if we ever accept body.
// For now, these might be empty or used for validation of params if we use zValidator('param')

export const toggleSubscriptionSchema = z.object({
  channelId: z.string().uuid('Invalid channel ID'),
})

export type ToggleSubscriptionInput = z.infer<typeof toggleSubscriptionSchema>
