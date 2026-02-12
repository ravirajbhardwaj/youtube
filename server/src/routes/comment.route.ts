import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware } from '@/middlewares/auth.middleware'
import { created, ok } from '@/lib/http'
import { ApiError } from '@/lib/http'
import { HttpStatus } from '@/lib/const'
import { db } from '@/db'
import { comments, users, videos } from '@/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import { createCommentSchema, updateCommentSchema } from './comment.schema'
import type { CreateCommentInput, UpdateCommentInput } from './comment.schema'
import type { Context } from 'hono'

const commentRouter = new Hono()

// Public routes (none for comments specifically, viewing is public but handled below with auth optional?
// No, getting comments is usually public. Posting is private.)

commentRouter.get('/:videoId', async (c: Context) => {
  const videoId = c.req.param('videoId')

  if (!videoId) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Video ID is required')
  }

  const { page, limit } = c.req.query()
  const normalizedPage = Math.max(1, Number(page) || 1)
  const normalizedLimit = Math.min(50, Math.max(1, Number(limit) || 10))
  const offset = (normalizedPage - 1) * normalizedLimit

  const [total, videoComments] = await Promise.all([
    db
      .select({ count: comments.id })
      .from(comments)
      .where(eq(comments.videoId, videoId))
      .then(res => res.length),
    db
      .select({
        id: comments.id,
        userId: comments.userId,
        videoId: comments.videoId,
        content: comments.content,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        user: {
          id: users.id,
          username: users.username,
          fullname: users.fullname,
          avatar: users.avatar,
        },
      })
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.videoId, videoId))
      .orderBy(desc(comments.createdAt))
      .limit(normalizedLimit)
      .offset(offset),
  ])

  const totalPages = Math.ceil(total / normalizedLimit)

  const result = {
    comments: videoComments,
    pagination: {
      page: normalizedPage,
      limit: normalizedLimit,
      total,
      totalPages,
    },
  }

  return ok(c, result, 'Comments retrieved successfully')
})

// Protected routes
commentRouter.use('/*', authMiddleware)

commentRouter.post(
  '/',
  zValidator('json', createCommentSchema),
  async (c: Context) => {
    const userId = c.get('user')
    const body = c.req.valid('json') as CreateCommentInput
    const { content, videoId } = body

    // Verify video exists
    const [video] = await db
      .select()
      .from(videos)
      .where(eq(videos.id, videoId))
      .limit(1)

    if (!video) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Video not found')
    }

    const [newComment] = await db
      .insert(comments)
      .values({
        id: crypto.randomUUID(),
        userId,
        videoId,
        content,
        updatedAt: new Date().toISOString(),
      })
      .returning({
        id: comments.id,
        userId: comments.userId,
        videoId: comments.videoId,
        content: comments.content,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
      })

    // Update comment count on video
    await db
      .update(videos)
      .set({
        commentCount: (video.commentCount || 0) + 1,
      })
      .where(eq(videos.id, videoId))

    return created(c, { comment: newComment }, 'Comment created successfully')
  }
)

commentRouter.delete('/:commentId', async (c: Context) => {
  const userId = c.get('user')
  const commentId = c.req.param('commentId')

  if (!commentId) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Comment ID is required')
  }

  const [existingComment] = await db
    .select()
    .from(comments)
    .where(eq(comments.id, commentId))
    .limit(1)

  if (!existingComment) {
    throw new ApiError(HttpStatus.NOT_FOUND, 'Comment not found')
  }

  // Only allow comment owner to delete
  if (existingComment.userId !== userId) {
    throw new ApiError(
      HttpStatus.FORBIDDEN,
      'You are not authorized to delete this comment'
    )
  }

  await db.delete(comments).where(eq(comments.id, commentId))

  // Decrement comment count on video
  const [video] = await db
    .select()
    .from(videos)
    .where(eq(videos.id, existingComment.videoId))
    .limit(1)
  if (video) {
    await db
      .update(videos)
      .set({ commentCount: Math.max(0, (video.commentCount || 0) - 1) })
      .where(eq(videos.id, existingComment.videoId))
  }

  return ok(c, null, 'Comment deleted successfully')
})

commentRouter.patch(
  '/:commentId',
  zValidator('json', updateCommentSchema),
  async (c: Context) => {
    const userId = c.get('user')
    const commentId = c.req.param('commentId')

    if (!commentId) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Comment ID is required')
    }

    const body = c.req.valid('json') as UpdateCommentInput
    const { content } = body

    const [existingComment] = await db
      .select()
      .from(comments)
      .where(eq(comments.id, commentId))
      .limit(1)

    if (!existingComment) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Comment not found')
    }

    if (existingComment.userId !== userId) {
      throw new ApiError(
        HttpStatus.FORBIDDEN,
        'You are not authorized to update this comment'
      )
    }

    const [updatedComment] = await db
      .update(comments)
      .set({
        content,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(comments.id, commentId))
      .returning({
        id: comments.id,
        userId: comments.userId,
        videoId: comments.videoId,
        content: comments.content,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
      })

    return ok(c, { comment: updatedComment }, 'Comment updated successfully')
  }
)

export default commentRouter
