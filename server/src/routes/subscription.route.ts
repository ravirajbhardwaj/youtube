import { Hono } from 'hono'
import { authMiddleware as verifyJWT } from '@/middlewares/auth.middleware'
import type { Context } from 'hono'
import { db } from '@/db'
import { subscriptions, users } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { ok, ApiError } from '@/lib/http'
import { HttpStatus } from '@/lib/const'

const subscriptionRouter = new Hono()
subscriptionRouter.use(verifyJWT)

// Toggle subscription (uses channelId param)
subscriptionRouter.post('/c/:channelId', async (c: Context) => {
  const userId = c.get('user')
  const channelId = c.req.param('channelId')

  if (!channelId) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Channel ID is required')
  }

  if (userId === channelId) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      'You cannot subscribe to your own channel'
    )
  }

  // Check if channel exists
  const [channel] = await db
    .select()
    .from(users)
    .where(eq(users.id, channelId))
    .limit(1)

  if (!channel) {
    throw new ApiError(HttpStatus.NOT_FOUND, 'Channel not found')
  }

  // Check if already subscribed
  const [existingSubscription] = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.subscriberId, userId),
        eq(subscriptions.channelId, channelId)
      )
    )
    .limit(1)

  if (existingSubscription) {
    // Unsubscribe
    await db
      .delete(subscriptions)
      .where(
        and(
          eq(subscriptions.subscriberId, userId),
          eq(subscriptions.channelId, channelId)
        )
      )

    return ok(c, { subscribed: false }, 'Unsubscribed successfully')
  } else {
    // Subscribe
    await db.insert(subscriptions).values({
      id: crypto.randomUUID(),
      subscriberId: userId,
      channelId,
      updatedAt: new Date().toISOString(),
    })

    return ok(c, { subscribed: true }, 'Subscribed successfully')
  }
})

// Get channels I am subscribed to
subscriptionRouter.get('/channels', async (c: Context) => {
  const userId = c.get('user')

  const subscribedChannels = await db
    .select({
      id: users.id,
      username: users.username,
      fullname: users.fullname,
      avatar: users.avatar,
    })
    .from(subscriptions)
    .leftJoin(users, eq(subscriptions.channelId, users.id))
    .where(eq(subscriptions.subscriberId, userId))

  return ok(
    c,
    { channels: subscribedChannels },
    'Subscribed channels retrieved successfully'
  )
})

// Get subscribers of a channel (uses channelId param)
subscriptionRouter.get('/u/:channelId', async (c: Context) => {
  const channelId = c.req.param('channelId')

  if (!channelId) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Channel ID is required')
  }

  const subscribers = await db
    .select({
      id: users.id,
      username: users.username,
      fullname: users.fullname,
      avatar: users.avatar,
    })
    .from(subscriptions)
    .leftJoin(users, eq(subscriptions.subscriberId, users.id))
    .where(eq(subscriptions.channelId, channelId))

  return ok(c, { subscribers }, 'Subscribers retrieved successfully')
})

export default subscriptionRouter
