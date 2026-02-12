import { Hono } from 'hono'
import { authMiddleware as verifyJWT } from '@/middlewares/auth.middleware'
import { zValidator } from '@hono/zod-validator'
import { createPlaylistSchema, updatePlaylistSchema } from './playlist.schema'
import type {
  CreatePlaylistInput,
  UpdatePlaylistInput,
} from './playlist.schema'
import type { Context } from 'hono'
import { db } from '@/db'
import { playlists, playlistToVideo, videos, users } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { ok, created, ApiError } from '@/lib/http'
import { HttpStatus } from '@/lib/const'

const playlistRouter = new Hono()

playlistRouter.use(verifyJWT)

playlistRouter.post(
  '/',
  zValidator('json', createPlaylistSchema),
  async (c: Context) => {
    const userId = c.get('user')

    const body = c.req.valid('json' as never) as CreatePlaylistInput
    const { name, description } = body

    const [newPlaylist] = await db
      .insert(playlists)
      .values({
        id: crypto.randomUUID(),
        userId,
        name,
        description,
        updatedAt: new Date().toISOString(),
      })
      .returning({
        id: playlists.id,
        userId: playlists.userId,
        name: playlists.name,
        description: playlists.description,
        createdAt: playlists.createdAt,
        updatedAt: playlists.updatedAt,
      })

    return created(
      c,
      { playlist: newPlaylist },
      'Playlist created successfully'
    )
  }
)

playlistRouter
  .get('/:playlistId', async (c: Context) => {
    const playlistId = c.req.param('playlistId')

    if (!playlistId) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Playlist ID is required')
    }

    const [playlist] = await db
      .select({
        id: playlists.id,
        userId: playlists.userId,
        name: playlists.name,
        description: playlists.description,
        createdAt: playlists.createdAt,
        updatedAt: playlists.updatedAt,
      })
      .from(playlists)
      .where(eq(playlists.id, playlistId))
      .limit(1)

    if (!playlist) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Playlist not found')
    }

    // Get videos in the playlist
    const playlistVideos = await db
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
      .from(playlistToVideo)
      .leftJoin(videos, eq(playlistToVideo.b, videos.id))
      .leftJoin(users, eq(videos.userId, users.id))
      .where(eq(playlistToVideo.a, playlistId))

    return ok(
      c,
      {
        playlist: {
          ...playlist,
          videoCount: playlistVideos.length,
          videos: playlistVideos,
        },
      },
      'Playlist retrieved successfully'
    )
  })
  .patch(
    '/:playlistId',
    zValidator('json', updatePlaylistSchema),
    async (c: Context) => {
      const userId = c.get('user')
      const playlistId = c.req.param('playlistId')

      if (!playlistId) {
        throw new ApiError(HttpStatus.BAD_REQUEST, 'Playlist ID is required')
      }

      // Check if playlist exists and belongs to user
      const [existingPlaylist] = await db
        .select()
        .from(playlists)
        .where(eq(playlists.id, playlistId))
        .limit(1)

      if (!existingPlaylist) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'Playlist not found')
      }

      if (existingPlaylist && existingPlaylist.userId !== userId) {
        throw new ApiError(
          HttpStatus.FORBIDDEN,
          'You are not authorized to update this playlist'
        )
      }

      const body = c.req.valid('json' as never) as UpdatePlaylistInput
      const { name, description } = body

      const [updatedPlaylist] = await db
        .update(playlists)
        .set({
          name: name ?? undefined,
          description: description ?? undefined,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(playlists.id, playlistId))
        .returning({
          id: playlists.id,
          userId: playlists.userId,
          name: playlists.name,
          description: playlists.description,
          createdAt: playlists.createdAt,
          updatedAt: playlists.updatedAt,
        })

      return ok(
        c,
        { playlist: updatedPlaylist },
        'Playlist updated successfully'
      )
    }
  )
  .delete('/:playlistId', async (c: Context) => {
    const userId = c.get('user')
    const playlistId = c.req.param('playlistId')

    if (!playlistId) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Playlist ID is required')
    }

    // Check if playlist exists and belongs to user
    const [existingPlaylist] = await db
      .select()
      .from(playlists)
      .where(eq(playlists.id, playlistId))
      .limit(1)

    if (!existingPlaylist) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Playlist not found')
    }

    if (existingPlaylist && existingPlaylist.userId !== userId) {
      throw new ApiError(
        HttpStatus.FORBIDDEN,
        'You are not authorized to delete this playlist'
      )
    }

    // Delete playlist and all associated video entries
    await db.delete(playlistToVideo).where(eq(playlistToVideo.a, playlistId))
    await db.delete(playlists).where(eq(playlists.id, playlistId))

    return ok(c, null, 'Playlist deleted successfully')
  })

playlistRouter.patch('/add/:videoId/:playlistId', async (c: Context) => {
  const userId = c.get('user')
  const playlistId = c.req.param('playlistId')
  const videoId = c.req.param('videoId')

  if (!playlistId || !videoId) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      'Playlist ID and Video ID are required'
    )
  }

  // Check if playlist exists and belongs to user
  const [playlist] = await db
    .select()
    .from(playlists)
    .where(eq(playlists.id, playlistId))
    .limit(1)

  if (!playlist) {
    throw new ApiError(HttpStatus.NOT_FOUND, 'Playlist not found')
  }

  if (playlist && playlist.userId !== userId) {
    throw new ApiError(
      HttpStatus.FORBIDDEN,
      'You are not authorized to modify this playlist'
    )
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

  // Check if video already exists in playlist
  const [existingEntry] = await db
    .select()
    .from(playlistToVideo)
    .where(
      and(eq(playlistToVideo.a, playlistId), eq(playlistToVideo.b, videoId))
    )
    .limit(1)

  if (existingEntry) {
    throw new ApiError(HttpStatus.CONFLICT, 'Video already exists in playlist')
  }

  await db.insert(playlistToVideo).values({
    a: playlistId,
    b: videoId,
  })

  return ok(c, null, 'Video added to playlist successfully')
})

playlistRouter.patch('/remove/:videoId/:playlistId', async (c: Context) => {
  const userId = c.get('user')
  const playlistId = c.req.param('playlistId')
  const videoId = c.req.param('videoId')

  if (!playlistId || !videoId) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      'Playlist ID and Video ID are required'
    )
  }

  // Check if playlist exists and belongs to user
  const [playlist] = await db
    .select()
    .from(playlists)
    .where(eq(playlists.id, playlistId))
    .limit(1)

  if (!playlist) {
    throw new ApiError(HttpStatus.NOT_FOUND, 'Playlist not found')
  }

  if (playlist && playlist.userId !== userId) {
    throw new ApiError(
      HttpStatus.FORBIDDEN,
      'You are not authorized to modify this playlist'
    )
  }

  await db
    .delete(playlistToVideo)
    .where(
      and(eq(playlistToVideo.a, playlistId), eq(playlistToVideo.b, videoId))
    )

  return ok(c, null, 'Video removed from playlist successfully')
})

playlistRouter.get('/user/:userId', async (c: Context) => {
  const userId = c.req.param('userId')

  if (!userId) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'User ID is required')
  }

  const userPlaylists = await db
    .select({
      id: playlists.id,
      userId: playlists.userId,
      name: playlists.name,
      description: playlists.description,
      createdAt: playlists.createdAt,
      updatedAt: playlists.updatedAt,
    })
    .from(playlists)
    .where(eq(playlists.userId, userId))

  // Get video count for each playlist
  const playlistsWithVideoCount = await Promise.all(
    userPlaylists.map(async playlist => {
      const videoCount = await db
        .select()
        .from(playlistToVideo)
        .where(eq(playlistToVideo.a, playlist.id))
        .then(res => res.length)

      return {
        ...playlist,
        videoCount,
      }
    })
  )

  return ok(
    c,
    { playlists: playlistsWithVideoCount },
    'User playlists retrieved successfully'
  )
})

export default playlistRouter
