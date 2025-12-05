import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { env } from '@/lib/env'
import { secureHeaders } from 'hono/secure-headers'
/**
 * IMPORT ROUTES
 */
import { healthCheck } from './routes/health'
import userRouter from './routes/user/user.route'
import tweetRouter from './routes/tweet/tweet.route'
import subscriptionRouter from './routes/subscription/subscription.route'
import videoRouter from './routes/video/video.route'
import commentRouter from './routes/comment/comment.route'
import likeRouter from './routes/like/like.route'
import playlistRouter from './routes/playlist/playlist.route'
import dashboardRouter from './routes/dashboard/dashboard.route'
import { Prisma } from './generated/prisma/client'
import { ApiError } from './lib/http'

const app = new Hono()

const allowsOrigins = [env.CLIENT_URL, 'http://localhost:3000']

app.use(secureHeaders())

app.use(
  cors({
    origin: allowsOrigins,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  })
)

app.route('/api/v1/healthcheck', healthCheck)
app.route('/api/v1/users', userRouter)
app.route('/api/v1/tweets', tweetRouter)
app.route('/api/v1/subscriptions', subscriptionRouter)
app.route('/api/v1/videos', videoRouter)
app.route('/api/v1/comments', commentRouter)
app.route('/api/v1/likes', likeRouter)
app.route('/api/v1/playlist', playlistRouter)
app.route('/api/v1/dashboard', dashboardRouter)

// @ts-ignore
app.onError((err, c) => {
  let apiError: ApiError
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    apiError = new ApiError(400, 'DATABASE ERROR')
  } else if (err instanceof ApiError) {
    apiError = err
  } else {
    apiError = new ApiError(500, err.message || 'INTERNAL SERVER ERROR')
  }

  return c.json(
    {
      ...apiError,
      message: apiError.message,
    },
    apiError.statusCode! as any
  )
})

export default app
