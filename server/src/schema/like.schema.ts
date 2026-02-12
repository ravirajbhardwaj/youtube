import { z } from 'zod'

export const typeParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
})

export type TypeParamInput = z.infer<typeof typeParamSchema>
