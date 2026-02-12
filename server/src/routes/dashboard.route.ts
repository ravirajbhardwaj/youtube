import { Hono } from 'hono'
import { db } from '@/db'
import { videos, users, subscriptions } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { ok, ApiError } from '@/lib/http'
import { HttpStatus } from '@/lib/const'
import type { Context } from 'hono'
import { authMiddleware as verifyJWT } from '@/middlewares/auth.middleware'

const dashboardRouter = new Hono()

dashboardRouter.use(verifyJWT)

dashboardRouter.get('/stats', async (c: Context) => {
  const userId = c.get('user')

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!user) {
    throw new ApiError(HttpStatus.NOT_FOUND, 'User not found')
  }

  // Get total videos
  const totalVideos = await db
    .select()
    .from(videos)
    .where(eq(videos.userId, userId))
    .then(res => res.length)

  // Get total views
  const totalViews = await db
    .select()
    .from(videos)
    .where(eq(videos.userId, userId))
    .then(res => res.reduce((sum, video) => sum + (video.viewCount || 0), 0))

  // Get total likes
  const totalLikes = await db
    .select()
    .from(videos)
    .where(eq(videos.userId, userId))
    .then(res => res.reduce((sum, video) => sum + (video.likeCount || 0), 0))

  // Get total comments
  const totalComments = await db
    .select()
    .from(videos)
    .where(eq(videos.userId, userId))
    .then(res => res.reduce((sum, video) => sum + (video.commentCount || 0), 0))

  // Get subscriber count
  const subscriberCount = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.channelId, userId))
    .then(res => res.length)

  return ok(
    c,
    {
      channelStats: {
        totalVideos,
        totalViews,
        totalLikes,
        totalComments,
        subscriberCount,
      },
    },
    'Channel statistics retrieved successfully'
  )
})

dashboardRouter.get('/videos', async (c: Context) => {
  const userId = c.get('user')

  const { page = '1', limit = '10', isPublished } = c.req.query()

  const channelVideos = await db
    .select({
      id: videos.id,
      title: videos.title,
      thumbnail: videos.thumbnail,
      videoFile: videos.videoFile,
      duration: videos.duration,
      viewCount: videos.viewCount,
      likeCount: videos.likeCount,
      commentCount: videos.commentCount,
      isPublished: videos.isPublished,
      publishedAt: videos.publishedAt,
      createdAt: videos.createdAt,
      updatedAt: videos.updatedAt,
    })
    .from(videos)
    .where(eq(videos.userId, userId))

  return ok(
    c,
    { videos: channelVideos },
    'Channel videos retrieved successfully'
  )
})

export default dashboardRouter
