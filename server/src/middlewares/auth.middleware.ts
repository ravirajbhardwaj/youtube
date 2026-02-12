import { createMiddleware } from 'hono/factory'
import { verifyAccessToken } from '@/lib/helper'
import { HttpStatus } from '@/lib/const'
import { ApiError } from '@/lib/http'

type AuthEnv = {
  Variables: {
    user: string
  }
}

export const authMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
  const authHeader = c.req.header('authorization')

  if (!authHeader) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, 'Please login first')
  }

  const [type, token] = authHeader.split(' ')

  if (type?.toLowerCase() !== 'bearer' || !token) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, 'Invalid token format')
  }

  const payload = await verifyAccessToken(token)

  if (!payload || !payload.userId) {
    throw new ApiError(HttpStatus.UNAUTHORIZED, 'Invalid or expired token')
  }

  c.set('user', payload.userId as string)

  await next()
})
