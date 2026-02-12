import { Hono } from 'hono'
import { authMiddleware } from '@/middlewares/auth.middleware'
import { zValidator } from '@hono/zod-validator'
import {
  updateAccountDetailsSchema,
  updateAvatarSchema,
  updateCoverImageSchema,
} from '../schema/user.schema'
import type { UpdateAccountDetailsInput } from '../schema/user.schema'
import type { Context } from 'hono'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq, or, and, not } from 'drizzle-orm'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { ok } from '@/lib/http'
import { HttpStatus } from '@/lib/const'
import { ApiError } from '@/lib/http'

const userRouter = new Hono()

// Secured routes
userRouter.use('/update-account', authMiddleware)
userRouter.patch(
  '/update-account',
  zValidator('json', updateAccountDetailsSchema),
  async (c: Context) => {
    const userId = c.get('user')
    const body = c.req.valid('json' as never) as UpdateAccountDetailsInput
    const { fullname, username, email } = body

    // Check if email or username is already taken by another user
    if (email || username) {
      const conditions = []
      if (email) conditions.push(eq(users.email, email))
      if (username) conditions.push(eq(users.username, username))

      const [existingUser] = await db
        .select()
        .from(users)
        .where(and(or(...conditions), not(eq(users.id, userId))))
        .limit(1)

      if (existingUser) {
        throw new ApiError(
          HttpStatus.CONFLICT,
          'Email or username already exists'
        )
      }
    }

    const [updatedUser] = await db
      .update(users)
      .set({
        fullname: fullname ?? undefined,
        username: username ?? undefined,
        email: email ?? undefined,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        fullname: users.fullname,
        username: users.username,
        email: users.email,
        avatar: users.avatar,
        coverImage: users.coverImage,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })

    return ok(c, { user: updatedUser }, 'Account details updated successfully')
  }
)

// File upload routes
userRouter.use('/avatar', authMiddleware)
userRouter.patch(
  '/avatar',
  zValidator('form', updateAvatarSchema),
  async (c: Context) => {
    const userId = c.get('user')
    const { avatar } = c.req.valid('form' as never)

    if (!avatar || !((avatar as any) instanceof File)) {
      throw new ApiError(
        HttpStatus.BAD_REQUEST,
        'Valid avatar file is required'
      )
    }

    const avatarUrl = await uploadToCloudinary(avatar)

    const [updatedUser] = await db
      .update(users)
      .set({
        avatar: avatarUrl?.secure_url || avatarUrl?.url,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        fullname: users.fullname,
        username: users.username,
        email: users.email,
        avatar: users.avatar,
        coverImage: users.coverImage,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })

    return ok(c, { user: updatedUser }, 'Avatar updated successfully')
  }
)

userRouter.use('/cover-image', authMiddleware)
userRouter.patch(
  '/cover-image',
  zValidator('form', updateCoverImageSchema),
  async (c: Context) => {
    const userId = c.get('user')
    const { coverImage } = c.req.valid('form' as never)

    if (!coverImage || !((coverImage as any) instanceof File)) {
      throw new ApiError(
        HttpStatus.BAD_REQUEST,
        'Valid cover image file is required'
      )
    }

    const coverImageUrl = await uploadToCloudinary(coverImage)

    const [updatedUser] = await db
      .update(users)
      .set({
        coverImage: coverImageUrl?.secure_url || coverImageUrl?.url,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        fullname: users.fullname,
        username: users.username,
        email: users.email,
        avatar: users.avatar,
        coverImage: users.coverImage,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })

    return ok(c, { user: updatedUser }, 'Cover image updated successfully')
  }
)

// User-specific routes
userRouter.get('/c/:username', async (c: Context) => {
  const username = c.req.param('username')
  if (!username) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Username parameter is required')
  }

  const [user] = await db
    .select({
      id: users.id,
      fullname: users.fullname,
      username: users.username,
      email: users.email,
      avatar: users.avatar,
      coverImage: users.coverImage,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.username, username))
    .limit(1)

  if (!user) {
    throw new ApiError(HttpStatus.NOT_FOUND, 'User not found')
  }

  return ok(c, { user }, 'User channel profile retrieved successfully')
})

userRouter.use('/history', authMiddleware)
userRouter.get('/history', async (c: Context) => {
  const userId = c.get('user')
  // TODO: Implement watch history functionality with proper schema
  const history: any[] = [] // Explicit type to avoid implicit any error if strict
  return ok(c, { history }, 'Watch history retrieved successfully')
})

export default userRouter
