import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware } from '@/middlewares/auth.middleware'
import {
  searchVideosSchema,
  createVideoSchema,
  updateVideoSchema,
} from './video/video.schema'
import type {
  CreateVideoInput,
  UpdateVideoInput,
  SearchVideosInput,
} from './video/video.schema'
import type { Context } from 'hono'
import { ok, created } from '@/lib/http'
import { HttpStatus } from '@/lib/const'
import { ApiError } from '@/lib/http'
import { db } from '@/db'
import { videos, users } from '@/db/schema'
import { eq, or, ilike, and, desc, asc } from 'drizzle-orm'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { coerceFile, parseRequestBody } from '@/lib/helper'

const videoRouter = new Hono()

// Public routes
videoRouter.get(
  '/',
  zValidator('query', searchVideosSchema),
  async (c: Context) => {
    const params = c.req.valid('query') as unknown as SearchVideosInput
    const {
      page = 1,
      limit = 10,
      query,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      userId,
    } = params

    const normalizedPage = Math.max(1, Number(page))
    const normalizedLimit = Math.min(50, Math.max(1, Number(limit)))
    const offset = (normalizedPage - 1) * normalizedLimit

    const whereConditions: any[] = []
    if (query) {
      whereConditions.push(
        or(
          ilike(videos.title, `%${query}%`),
          ilike(videos.description, `%${query}%`)
        )
      )
    }
    if (userId) {
      whereConditions.push(eq(videos.userId, userId))
    }
    whereConditions.push(eq(videos.isPublished, true))

    const orderByClause =
      sortOrder === 'asc'
        ? asc(videos[sortBy as keyof typeof videos._.columns])
        : desc(videos[sortBy as keyof typeof videos._.columns])

    const [total, videoList] = await Promise.all([
      db
        .select({ count: videos.id })
        .from(videos)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .then(res => res.length),
      db
        .select({
          id: videos.id,
          title: videos.title,
          description: videos.description,
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
          user: {
            id: users.id,
            username: users.username,
            fullname: users.fullname,
            avatar: users.avatar,
          },
        })
        .from(videos)
        .leftJoin(users, eq(videos.userId, users.id))
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .orderBy(orderByClause)
        .limit(normalizedLimit)
        .offset(offset),
    ])

    const totalPages = Math.ceil(total / normalizedLimit)

    const result = {
      videos: videoList,
      pagination: {
        page: normalizedPage,
        limit: normalizedLimit,
        total,
        totalPages,
      },
    }

    return ok(c, result, 'Videos retrieved successfully')
  }
)

videoRouter.get('/:videoId', async (c: Context) => {
  const videoId = c.req.param('videoId')
  if (!videoId) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Video ID is required')
  }

  const [video] = await db
    .select({
      id: videos.id,
      title: videos.title,
      description: videos.description,
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
      user: {
        id: users.id,
        username: users.username,
        fullname: users.fullname,
        avatar: users.avatar,
      },
    })
    .from(videos)
    .leftJoin(users, eq(videos.userId, users.id))
    .where(eq(videos.id, videoId))
    .limit(1)

  if (!video) {
    throw new ApiError(HttpStatus.NOT_FOUND, 'Video not found')
  }

  // Increment view count
  await db
    .update(videos)
    .set({
      viewCount: (video.viewCount || 0) + 1,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(videos.id, videoId))

  return ok(c, { video }, 'Video retrieved successfully')
})

// Protected routes
videoRouter.use('/*', authMiddleware)

videoRouter.post(
  '/',
  zValidator('form', createVideoSchema),
  async (c: Context) => {
    const userId = c.get('user')
    const validated = c.req.valid('form' as never) as CreateVideoInput
    const {
      title,
      description,
      isPublished = true,
      videoFile,
      thumbnail,
    } = validated

    if (!videoFile) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Video file is required')
    }

    // Upload video to Cloudinary
    const videoResult = await uploadToCloudinary(videoFile)

    // Upload thumbnail if provided
    let thumbnailUrl = null
    if (thumbnail) {
      const thumbnailResult = await uploadToCloudinary(thumbnail)
      thumbnailUrl = thumbnailResult?.secure_url || thumbnailResult?.url
    }

    const [newVideo] = await db
      .insert(videos)
      .values({
        id: crypto.randomUUID(),
        userId,
        videoFile: videoResult?.secure_url || videoResult?.url,
        thumbnail: thumbnailUrl || '',
        title,
        description,
        duration: videoResult?.duration || 0,
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        isPublished,
        publishedAt: isPublished ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString(),
      })
      .returning({
        id: videos.id,
        title: videos.title,
        description: videos.description,
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

    return created(c, { video: newVideo }, 'Video published successfully')
  }
)

videoRouter.patch(
  '/:videoId',
  zValidator('json', updateVideoSchema),
  async (c: Context) => {
    const userId = c.get('user')
    const videoId = c.req.param('videoId')

    if (!videoId) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Video ID is required')
    }

    // We need to parse body manually to handle optional file upload mixed with fields if using FormData
    const body = await parseRequestBody(c)
    const thumbnailFile = coerceFile(body.thumbnail)
    const { title, description, isPublished } = body

    // Check if video exists and belongs to user
    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(eq(videos.id, videoId))
      .limit(1)

    if (!existingVideo) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Video not found')
    }

    if (existingVideo.userId !== userId) {
      throw new ApiError(
        HttpStatus.FORBIDDEN,
        'You are not authorized to update this video'
      )
    }

    let finalThumbnailUrl = body.thumbnail as string | undefined // If string (url)
    // If file
    if (thumbnailFile) {
      const thumbnailResult = await uploadToCloudinary(thumbnailFile)
      finalThumbnailUrl = thumbnailResult?.secure_url || thumbnailResult?.url
    } else if (typeof body.thumbnail === 'string') {
      // Kept as is
    }

    const [updatedVideo] = await db
      .update(videos)
      .set({
        title: (title as string | undefined) ?? undefined,
        description: (description as string | undefined) ?? undefined,
        thumbnail:
          typeof finalThumbnailUrl === 'string' ? finalThumbnailUrl : undefined,
        isPublished:
          isPublished !== undefined
            ? isPublished === 'true' || isPublished === true
            : undefined,
        publishedAt:
          (isPublished === 'true' || isPublished === true) &&
          !existingVideo.isPublished
            ? new Date().toISOString()
            : existingVideo.publishedAt,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(videos.id, videoId))
      .returning({
        id: videos.id,
        title: videos.title,
        description: videos.description,
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

    return ok(c, { video: updatedVideo }, 'Video updated successfully')
  }
)

videoRouter.delete('/:videoId', async (c: Context) => {
  const userId = c.get('user')
  const videoId = c.req.param('videoId')

  if (!videoId) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Video ID is required')
  }

  // Check if video exists and belongs to user
  const [existingVideo] = await db
    .select()
    .from(videos)
    .where(eq(videos.id, videoId))
    .limit(1)

  if (!existingVideo) {
    throw new ApiError(HttpStatus.NOT_FOUND, 'Video not found')
  }

  if (existingVideo.userId !== userId) {
    throw new ApiError(
      HttpStatus.FORBIDDEN,
      'You are not authorized to delete this video'
    )
  }

  await db.delete(videos).where(eq(videos.id, videoId))

  return ok(c, null, 'Video deleted successfully')
})

videoRouter.patch('/toggle/publish/:videoId', async (c: Context) => {
  const userId = c.get('user')
  const videoId = c.req.param('videoId')

  if (!videoId) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Video ID is required')
  }

  const [existingVideo] = await db
    .select()
    .from(videos)
    .where(eq(videos.id, videoId))
    .limit(1)

  if (!existingVideo) {
    throw new ApiError(HttpStatus.NOT_FOUND, 'Video not found')
  }

  if (existingVideo.userId !== userId) {
    throw new ApiError(
      HttpStatus.FORBIDDEN,
      'You are not authorized to update this video'
    )
  }

  const newPublishStatus = !existingVideo.isPublished

  const [updatedVideo] = await db
    .update(videos)
    .set({
      isPublished: newPublishStatus,
      publishedAt: newPublishStatus ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(videos.id, videoId))
    .returning({
      id: videos.id,
      title: videos.title,
      isPublished: videos.isPublished,
      publishedAt: videos.publishedAt,
    })

  return ok(
    c,
    { video: updatedVideo },
    'Video publish status toggled successfully'
  )
})

export default videoRouter
