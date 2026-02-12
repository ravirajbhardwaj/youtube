import { z } from 'zod'

// Comment creation schema - for creating a new comment on a video
export const createCommentSchema = z.object({
  videoId: z.string().uuid('Invalid video ID format'),
  content: z
    .string()
    .min(1, 'Comment content cannot be empty')
    .max(500, 'Comment cannot exceed 500 characters'),
  parentCommentId: z
    .string()
    .uuid('Invalid parent comment ID format')
    .optional(),
})

// Comment update schema - for updating an existing comment
export const updateCommentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment content cannot be empty')
    .max(500, 'Comment cannot exceed 500 characters'),
})

// Comment deletion schema - currently only requires validating the comment ID parameter

// Validation helpers
export const validateCreateComment = (data: unknown) => {
  return createCommentSchema.safeParse(data)
}

export const validateUpdateComment = (data: unknown) => {
  return updateCommentSchema.safeParse(data)
}

// Type definitions
export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>
