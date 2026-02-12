import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware } from '@/middlewares/auth.middleware'
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './auth.schema'
import { handleZodError } from '@/lib/handleZodError'
import type { Context } from 'hono'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq, or } from 'drizzle-orm'
import {
  generateAccessAndRefreshTokens,
  hashPassword,
  passwordMatch,
  verifyRefreshToken,
} from '@/lib/helper'
import { uploadToCloudinary } from '@/lib/cloudinary'
import type {
  RegisterInput,
  LoginInput,
  ChangePasswordInput,
  RefreshTokenInput,
} from './auth.schema'
import { created, ok, ApiError } from '@/lib/http'
import { HttpStatus } from '@/lib/const'

const authRouter = new Hono()

// Custom hook to use existing handleZodError logic
const validatorHook = (result: any, c: Context) => {
  if (!result.success) {
    handleZodError(result)
  }
}

// Public routes
authRouter.post(
  '/register',
  zValidator('form', registerSchema, validatorHook),
  async (c: Context) => {
    const validated = c.req.valid('form' as never) as RegisterInput
    console.log({ validated })
    const { username, fullname, email, password, avatar, coverImage } =
      validated

    // Check for existing user
    const existing = await db
      .select({ id: users })
      .from(users)
      .where(or(eq(users.email, email), eq(users.username, username)))
      .limit(1)

    if (existing.length > 0) {
      throw new ApiError(
        HttpStatus.CONFLICT,
        'User with same email or username already exists'
      )
    }

    const hashedPassword = await hashPassword(password)

    // Handle avatar upload
    const avatarUpload =
      avatar instanceof File ? await uploadToCloudinary(avatar) : null
    const coverUpload =
      coverImage instanceof File ? await uploadToCloudinary(coverImage) : null

    const userId = crypto.randomUUID()
    const now = new Date().toISOString()

    const [newUser] = await db
      .insert(users)
      .values({
        id: userId,
        username,
        fullname,
        email,
        password: hashedPassword,
        avatar: avatarUpload?.secure_url ?? avatarUpload?.url ?? null,
        coverImage: coverUpload?.secure_url ?? coverUpload?.url ?? null,
        updatedAt: now,
      })
      .returning({
        id: users.id,
        username: users.username,
        fullname: users.fullname,
        email: users.email,
        avatar: users.avatar,
        coverImage: users.coverImage,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })

    const tokens = await generateAccessAndRefreshTokens({ userId })

    await db
      .update(users)
      .set({ refreshToken: tokens.refreshToken, updatedAt: now })
      .where(eq(users.id, userId))

    return created(
      c,
      {
        user: newUser,
        tokens,
      },
      'User registered successfully'
    )
  }
)

authRouter.post(
  '/login',
  zValidator('json', loginSchema, validatorHook),
  async (c: Context) => {
    const validated = c.req.valid('json' as never) as LoginInput
    const { username, password } = validated

    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        fullname: users.fullname,
        email: users.email,
        password: users.password,
        avatar: users.avatar,
        coverImage: users.coverImage,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(or(eq(users.username, username), eq(users.email, username)))
      .limit(1)

    if (!user) {
      throw new ApiError(
        HttpStatus.UNAUTHORIZED,
        'Invalid username or password'
      )
    }

    const isValid = await passwordMatch(password, user.password)
    if (!isValid) {
      throw new ApiError(
        HttpStatus.UNAUTHORIZED,
        'Invalid username or password'
      )
    }

    const tokens = await generateAccessAndRefreshTokens({ userId: user.id })
    await db
      .update(users)
      .set({
        refreshToken: tokens.refreshToken,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, user.id))

    const { password: _, ...safeUser } = user

    return ok(
      c,
      {
        user: safeUser,
        tokens,
      },
      'Login successful'
    )
  }
)

authRouter.post(
  '/forgot-password',
  zValidator('json', forgotPasswordSchema, validatorHook),
  async (c: Context) => {
    // Placeholder for forgot password logic
    return ok(c, null, 'Password reset email sent if the email exists')
  }
)

authRouter.post(
  '/reset-password',
  zValidator('json', resetPasswordSchema, validatorHook),
  async (c: Context) => {
    // Placeholder for reset password logic
    return ok(c, null, 'Password reset successfully')
  }
)

// Semi-secured routes (using refresh token)
authRouter.post(
  '/refresh-token',
  zValidator('json', refreshTokenSchema, validatorHook),
  async (c: Context) => {
    const validated = c.req.valid('json' as never) as RefreshTokenInput
    const token = validated?.refreshToken

    const userPayload = await verifyRefreshToken(token)

    if (!userPayload?.userId || typeof userPayload.userId !== 'string') {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Invalid refresh token')
    }

    const userId = userPayload.userId

    const [user] = await db
      .select({
        id: users.id,
        refreshToken: users.refreshToken,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user || user.refreshToken !== token) {
      throw new ApiError(
        HttpStatus.UNAUTHORIZED,
        'Refresh token not recognized'
      )
    }

    const tokens = await generateAccessAndRefreshTokens({ userId: user.id })

    await db
      .update(users)
      .set({
        refreshToken: tokens.refreshToken,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, user.id))

    return ok(c, { tokens }, 'Access token refreshed')
  }
)

// Secured routes (using access token)
authRouter.use('/logout', authMiddleware)
authRouter.post('/logout', async (c: Context) => {
  const userId = c.get('user')
  await db
    .update(users)
    .set({ refreshToken: null, updatedAt: new Date().toISOString() })
    .where(eq(users.id, userId))

  return ok(c, null, 'Logged out successfully')
})

authRouter.use('/change-password', authMiddleware)
authRouter.post(
  '/change-password',
  zValidator('json', changePasswordSchema, validatorHook),
  async (c: Context) => {
    const userId = c.get('user')
    const validated = c.req.valid('json' as never) as ChangePasswordInput
    const { currentPassword, newPassword } = validated

    const [user] = await db
      .select({
        id: users.id,
        password: users.password,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'User not found')
    }

    const isValid = await passwordMatch(currentPassword, user.password)
    if (!isValid) {
      throw new ApiError(
        HttpStatus.UNAUTHORIZED,
        'Current password is incorrect'
      )
    }

    const hashedPassword = await hashPassword(newPassword)
    await db
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, userId))

    return ok(c, null, 'Password changed successfully')
  }
)

authRouter.use('/current-user', authMiddleware)
authRouter.get('/current-user', async (c: Context) => {
  const userId = c.get('user')

  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      fullname: users.fullname,
      email: users.email,
      avatar: users.avatar,
      coverImage: users.coverImage,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!user) {
    throw new ApiError(HttpStatus.NOT_FOUND, 'User not found')
  }

  return ok(c, { user }, 'Current user retrieved successfully')
})

export default authRouter
