import { Hono } from 'hono'
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from './subscription.controller'

const subscriptionRouter = new Hono()
// subscriptionRouter.use(verifyJWT)

subscriptionRouter
  .get('/c/:channelId', getSubscribedChannels)
  .post(toggleSubscription)

subscriptionRouter.get('/u/:subscriberId', getUserChannelSubscribers)

export default subscriptionRouter
