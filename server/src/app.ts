import { Hono } from 'hono'
import { healthCheck } from './routes/health'

const app = new Hono()

app.route('/api/v1/healthcheck', healthCheck)
// app.route("/api/v1/routers", authRoute)
// app.route("/api/v1/tweets", tweetRouter)
// app.route("/api/v1/subscriptions", subscriptionRouter)
// app.route("/api/v1/videos", videoRouter)
// app.route("/api/v1/comments", commentRouter)
// app.route("/api/v1/likes", likeRouter)
// app.route("/api/v1/playlist", playlistRouter)
// app.route("/api/v1/dashboard", dashboardRouter)

export default app
