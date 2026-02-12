import { z } from 'zod'

// Tweet creation schema - for creating a new tweet
export const createTweetSchema = z.object({
  content: z
    .string()
    .min(1, 'Tweet content cannot be empty')
    .max(200, 'Tweet cannot exceed 200 characters'),
})

// Tweet update schema - for updating an existing tweet
export const updateTweetSchema = z.object({
  content: z
    .string()
    .min(1, 'Tweet content cannot be empty')
    .max(200, 'Tweet cannot exceed 200 characters'),
})

// Tweet search schema - for searching tweets
export const searchTweetsSchema = z.object({
  query: z.string().optional(),
  page: z
    .number()
    .positive('Page number must be a positive integer')
    .optional()
    .default(1),
  limit: z
    .number()
    .positive('Limit must be a positive integer')
    .optional()
    .default(10),
  sortBy: z.enum(['createdAt', 'likeCount']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  userId: z.string().optional(),
})

// Validation helpers
export const validateCreateTweet = (data: unknown) => {
  return createTweetSchema.safeParse(data)
}

export const validateUpdateTweet = (data: unknown) => {
  return updateTweetSchema.safeParse(data)
}

export const validateSearchTweets = (data: unknown) => {
  return searchTweetsSchema.safeParse(data)
}

// Type definitions
export type CreateTweetInput = z.infer<typeof createTweetSchema>
export type UpdateTweetInput = z.infer<typeof updateTweetSchema>
export type SearchTweetsInput = z.infer<typeof searchTweetsSchema>
