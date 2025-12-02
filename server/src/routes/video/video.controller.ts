import type { Context } from 'hono'

const getAllVideos = async (c: Context) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy,
    sortType,
    userId,
  } = c.req.query()
  //TODO: get all videos based on query, sort, pagination
}

const publishAVideo = async (c: Context) => {
  const { title, description } = await c.req.json()
  // TODO: get video, upload to cloudinary, create video
}

const getVideoById = async (c: Context) => {
  const videoId = c.req.param('videoId')
  //TODO: get video by id
}

const updateVideo = async (c: Context) => {
  const videoId = c.req.param('videoId')
  //TODO: update video details like title, description, thumbnail
}

const deleteVideo = async (c: Context) => {
  const videoId = c.req.param('videoId')
  //TODO: delete video
}

const togglePublishStatus = async (c: Context) => {
  const videoId = c.req.param('videoId')
}

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
}
