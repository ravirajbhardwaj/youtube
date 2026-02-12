import { z } from 'zod'

export const createPlaylistSchema = z.object({
  name: z
    .string()
    .min(1, 'Playlist name is required')
    .max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').optional(),
})

export const updatePlaylistSchema = z.object({
  name: z
    .string()
    .min(1, 'Playlist name is required')
    .max(100, 'Name too long')
    .optional(),
  description: z.string().max(500, 'Description too long').optional(),
})

export type CreatePlaylistInput = z.infer<typeof createPlaylistSchema>
export type UpdatePlaylistInput = z.infer<typeof updatePlaylistSchema>
