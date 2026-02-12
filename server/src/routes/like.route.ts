import { Hono } from 'hono'
import { db } from '@/db'
import {
  videoLikes,
  tweetLikes,
  comments,
  videos,
  tweets,
  users,
} from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { ok, ApiError } from '@/lib/http'
import { HttpStatus } from '@/lib/const'
import type { Context } from 'hono'
import { authMiddleware as verifyJWT } from '@/middlewares/auth.middleware'

const likeRouter = new Hono()
likeRouter.use(verifyJWT)

// Note: Validation logic often sits in controller for simple params or we can use zValidator('param')
// For now, let's keep it simple as these are simple ID toggles
likeRouter.post('/toggle/v/:videoId', async (c: Context) => {
  const userId = c.get('user')
  const videoId = c.req.param('videoId')

  if (!videoId) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Video ID is required')
  }

  // Check if video exists
  const [video] = await db
    .select()
    .from(videos)
    .where(eq(videos.id, videoId))
    .limit(1)

  if (!video) {
    throw new ApiError(HttpStatus.NOT_FOUND, 'Video not found')
  }

  // Check if user already liked the video
  const [existingLike] = await db
    .select()
    .from(videoLikes)
    .where(and(eq(videoLikes.userId, userId), eq(videoLikes.videoId, videoId)))
    .limit(1)

  if (existingLike) {
    // Remove like
    await db
      .delete(videoLikes)
      .where(
        and(eq(videoLikes.userId, userId), eq(videoLikes.videoId, videoId))
      )

    // Decrement like count
    await db
      .update(videos)
      .set({
        likeCount: Math.max(0, (video!.likeCount || 0) - 1),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(videos.id, videoId))

    return ok(c, { liked: false }, 'Video unliked successfully')
  } else {
    // Add like
    await db.insert(videoLikes).values({
      userId,
      videoId,
    })

    // Increment like count
    await db
      .update(videos)
      .set({
        likeCount: (video!.likeCount || 0) + 1,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(videos.id, videoId))

    return ok(c, { liked: true }, 'Video liked successfully')
  }
})

likeRouter.post('/toggle/c/:commentId', async (c: Context) => {
  // const userId = c.get('user')
  const commentId = c.req.param('commentId')

  if (!commentId) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Comment ID is required')
  }

  // Check if comment exists
  const [comment] = await db
    .select()
    .from(comments)
    .where(eq(comments.id, commentId))
    .limit(1)

  if (!comment) {
    throw new ApiError(HttpStatus.NOT_FOUND, 'Comment not found')
  }

  // TODO: Comment likes functionality (needs commentLikes table)
  return ok(c, { liked: false }, 'Comment like functionality not implemented')
})

likeRouter.post('/toggle/t/:tweetId', async (c: Context) => {
  const userId = c.get('user')
  const tweetId = c.req.param('tweetId')

  if (!tweetId) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Tweet ID is required')
  }

  // Check if tweet exists
  const [tweet] = await db
    .select()
    .from(tweets)
    .where(eq(tweets.id, tweetId))
    .limit(1)

  if (!tweet) {
    throw new ApiError(HttpStatus.NOT_FOUND, 'Tweet not found')
  }

  // Check if user already liked the tweet
  const [existingLike] = await db
    .select()
    .from(tweetLikes)
    .where(and(eq(tweetLikes.userId, userId), eq(tweetLikes.tweetId, tweetId)))
    .limit(1)

  if (existingLike) {
    // Remove like
    await db
      .delete(tweetLikes)
      .where(
        and(eq(tweetLikes.userId, userId), eq(tweetLikes.tweetId, tweetId))
      )

    return ok(c, { liked: false }, 'Tweet unliked successfully')
  } else {
    // Add like
    await db.insert(tweetLikes).values({
      userId,
      tweetId,
    })

    return ok(c, { liked: true }, 'Tweet liked successfully')
  }
})

likeRouter.get('/videos', async (c: Context) => {
  const userId = c.get('user')

  const likedVideos = await db
    .select({
      id: videos.id,
      title: videos.title,
      thumbnail: videos.thumbnail,
      videoFile: videos.videoFile,
      duration: videos.duration,
      viewCount: videos.viewCount,
      likeCount: videos.likeCount,
      commentCount: videos.commentCount,
      createdAt: videos.createdAt,
      user: {
        id: users.id,
        username: users.username,
        fullname: users.fullname,
        avatar: users.avatar,
      },
    })
    .from(videoLikes)
    .leftJoin(videos, eq(videoLikes.videoId, videos.id))
    .leftJoin(users, eq(videos.userId, users.id))
    .where(eq(videoLikes.userId, userId))

  return ok(c, { videos: likedVideos }, 'Liked videos retrieved successfully')
})

export default likeRouter
