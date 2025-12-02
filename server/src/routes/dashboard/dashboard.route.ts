import { Hono } from 'hono'
import { getChannelStats, getChannelVideos } from './dashboard.controller'

const dashboardRouter = new Hono()

// dashboardRouter.use(verifyJWT)

dashboardRouter.get('/stats', getChannelStats)
dashboardRouter.get('/videos', getChannelVideos)

export default dashboardRouter
