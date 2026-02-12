import type { Context } from 'hono'
import { JWTPayload, SignJWT, jwtVerify } from 'jose'
import { env } from './env'
import { ApiError } from './http'
import { HttpStatus } from './const'

const toSecret = (value: string) => new TextEncoder().encode(value)

export const hashPassword = async (password: string) =>
  Bun.password.hash(password)

export const passwordMatch = async (
  enteredPassword: string,
  storedPassword: string
) => Bun.password.verify(enteredPassword, storedPassword)

const buildToken = async (
  payload: JWTPayload,
  secret: Uint8Array,
  expiresIn: string
) => {
  const jwt = new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)

  const subject = typeof payload.userId === 'string' ? payload.userId : null
  if (subject) {
    jwt.setSubject(subject)
  }

  return jwt.sign(secret)
}

export const generateAccessAndRefreshTokens = async (payload: JWTPayload) => {
  const accessToken = await buildToken(
    payload,
    toSecret(env.ACCESS_TOKEN_SECRET),
    env.ACCESS_TOKEN_EXPIRY
  )

  const refreshToken = await buildToken(
    payload,
    toSecret(env.REFRESH_TOKEN_SECRET),
    env.REFRESH_TOKEN_EXPIRY
  )

  return { accessToken, refreshToken }
}

export const parseRequestBody = async (
  c: Context
): Promise<Record<string, unknown>> => {
  const contentType = c.req.header('content-type') || ''

  if (contentType.includes('application/json')) {
    return await c.req.json()
  }

  if (
    contentType.includes('multipart/form-data') ||
    contentType.includes('application/x-www-form-urlencoded')
  ) {
    return await c.req.parseBody()
  }

  try {
    return await c.req.json()
  } catch {
    return await c.req.parseBody()
  }
}

export const coerceFile = (value: unknown): File | undefined => {
  if (!value) return undefined
  if (Array.isArray(value)) {
    return value.find(item => item instanceof File) as File | undefined
  }
  return value instanceof File ? value : undefined
}

export const normalizePagination = (
  pageValue?: string | number,
  limitValue?: string | number,
  options?: { defaultPage?: number; defaultLimit?: number; maxLimit?: number }
) => {
  const defaultPage = options?.defaultPage ?? 1
  const defaultLimit = options?.defaultLimit ?? 10
  const maxLimit = options?.maxLimit ?? 50

  const pageNumber = Number(pageValue)
  const limitNumber = Number(limitValue)

  const page =
    Number.isFinite(pageNumber) && pageNumber > 0
      ? Math.floor(pageNumber)
      : defaultPage

  const limit =
    Number.isFinite(limitNumber) && limitNumber > 0
      ? Math.min(Math.floor(limitNumber), maxLimit)
      : defaultLimit

  const offset = (page - 1) * limit

  return { page, limit, offset }
}

const getBearerToken = (c: Context) => {
  const authHeader = c.req.header('authorization')
  if (!authHeader) return null

  const [type, token] = authHeader.split(' ')
  if (type?.toLowerCase() !== 'bearer' || !token) return null

  return token
}

export const verifyAccessToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(
      token,
      toSecret(env.ACCESS_TOKEN_SECRET)
    )
    return payload
  } catch {
    return null
  }
}

export const verifyRefreshToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(
      token,
      toSecret(env.REFRESH_TOKEN_SECRET)
    )
    return payload
  } catch {
    return null
  }
}

export const getOptionalAuthUserId = async (c: Context) => {
  const token = getBearerToken(c)
  if (!token) return null

  const payload = await verifyAccessToken(token)
  const userId = payload?.userId

  return typeof userId === 'string' ? userId : null
}

export const requireAuth = async (c: Context) => {
  const token = getBearerToken(c)
  if (!token) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, 'Please login first')
  }

  const payload = await verifyAccessToken(token)
  const userId = payload?.userId

  if (!userId || typeof userId !== 'string') {
    throw new ApiError(HttpStatus.UNAUTHORIZED, 'Invalid access token')
  }

  return userId
}
