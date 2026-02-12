import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware } from '@/middlewares/auth.middleware'
import { createTweetSchema, updateTweetSchema } from './tweet.schema'
import type { CreateTweetInput, UpdateTweetInput } from './tweet.schema'
import type { Context } from 'hono'
import { created, ok } from '@/lib/http'
import { ApiError } from '@/lib/http'
import { HttpStatus } from '@/lib/const'
import { db } from '@/db'
import { tweets, users } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

const tweetRouter = new Hono()

// Public routes
tweetRouter.get('/user/:userId', async (c: Context) => {
  const userId = c.req.param('userId')
  if (!userId) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'User ID is required')
  }

  const { page, limit } = c.req.query()
  const normalizedPage = Math.max(1, Number(page) || 1)
  const normalizedLimit = Math.min(50, Math.max(1, Number(limit) || 10))
  const offset = (normalizedPage - 1) * normalizedLimit

  const [total, userTweets] = await Promise.all([
    db
      .select({ count: tweets.id })
      .from(tweets)
      .where(eq(tweets.userId, userId))
      .then(res => res.length),
    db
      .select({
        id: tweets.id,
        userId: tweets.userId,
        content: tweets.content,
        createdAt: tweets.createdAt,
        updatedAt: tweets.updatedAt,
        user: {
          id: users.id,
          username: users.username,
          fullname: users.fullname,
          avatar: users.avatar,
        },
      })
      .from(tweets)
      .leftJoin(users, eq(tweets.userId, users.id))
      .where(eq(tweets.userId, userId))
      .orderBy(desc(tweets.createdAt))
      .limit(normalizedLimit)
      .offset(offset),
  ])

  const totalPages = Math.ceil(total / normalizedLimit)

  const result = {
    tweets: userTweets,
    pagination: {
      page: normalizedPage,
      limit: normalizedLimit,
      total,
      totalPages,
    },
  }

  return ok(c, result, 'User tweets retrieved successfully')
})

// Protected routes
tweetRouter.use('/*', authMiddleware)

tweetRouter.post(
  '/',
  zValidator('json', createTweetSchema),
  async (c: Context) => {
    const userId = c.get('user')
    const body = c.req.valid('json' as never) as CreateTweetInput
    const { content } = body

    const [newTweet] = await db
      .insert(tweets)
      .values({
        id: crypto.randomUUID(),
        userId,
        content,
        updatedAt: new Date().toISOString(),
      })
      .returning({
        id: tweets.id,
        userId: tweets.userId,
        content: tweets.content,
        createdAt: tweets.createdAt,
        updatedAt: tweets.updatedAt,
      })

    return created(c, { tweet: newTweet }, 'Tweet created successfully')
  }
)

tweetRouter.patch(
  '/:tweetId',
  zValidator('json', updateTweetSchema),
  async (c: Context) => {
    const userId = c.get('user')
    const tweetId = c.req.param('tweetId')

    if (!tweetId) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Tweet ID is required')
    }

    const data = c.req.valid('json' as never) as UpdateTweetInput
    const { content } = data

    const [existingTweet] = await db
      .select()
      .from(tweets)
      .where(eq(tweets.id, tweetId))
      .limit(1)

    if (!existingTweet) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Tweet not found')
    }

    if (existingTweet.userId !== userId) {
      throw new ApiError(
        HttpStatus.FORBIDDEN,
        'You are not authorized to update this tweet'
      )
    }

    const [updatedTweet] = await db
      .update(tweets)
      .set({
        content,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(tweets.id, tweetId))
      .returning({
        id: tweets.id,
        userId: tweets.userId,
        content: tweets.content,
        createdAt: tweets.createdAt,
        updatedAt: tweets.updatedAt,
      })

    return ok(c, { tweet: updatedTweet }, 'Tweet updated successfully')
  }
)

tweetRouter.delete('/:tweetId', async (c: Context) => {
  const userId = c.get('user')
  const tweetId = c.req.param('tweetId')

  if (!tweetId) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Tweet ID is required')
  }

  const [existingTweet] = await db
    .select()
    .from(tweets)
    .where(eq(tweets.id, tweetId))
    .limit(1)

  if (!existingTweet) {
    throw new ApiError(HttpStatus.NOT_FOUND, 'Tweet not found')
  }

  if (existingTweet.userId !== userId) {
    throw new ApiError(
      HttpStatus.FORBIDDEN,
      'You are not authorized to delete this tweet'
    )
  }

  await db.delete(tweets).where(eq(tweets.id, tweetId))

  return ok(c, null, 'Tweet deleted successfully')
})

export default tweetRouter
