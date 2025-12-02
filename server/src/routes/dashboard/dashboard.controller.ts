import type { Context } from 'hono'

const getChannelStats = async (c: Context) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
}

const getChannelVideos = async (c: Context) => {
  // TODO: Get all the videos uploaded by the channel
}

export { getChannelStats, getChannelVideos }
