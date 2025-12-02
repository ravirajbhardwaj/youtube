import type { Context } from 'hono'

const toggleSubscription = async (c: Context) => {
  const channelId = c.req.param('channelId')
  // TODO: toggle subscription
}

// controller to return subscriber list of a channel
const getUserChannelSubscribers = async (c: Context) => {
  // const { channelId } = req.params
}
// controller to return channel list to which user has subscribed
const getSubscribedChannels = async (c: Context) => {
  // const { subscriberId } = req.params
}

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels }
