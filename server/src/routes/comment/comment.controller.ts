import type { Context } from 'hono'

const getVideoComments = async (c: Context) => {
  //TODO: get all comments for a video
  const videoId = c.req.param('videoId')
  const { page = 1, limit = 10 } = c.req.query()
}

const addComment = async (c: Context) => {
  // TODO: add a comment to a video
}

const updateComment = async (c: Context) => {
  // TODO: update a comment
}

const deleteComment = async (c: Context) => {
  // TODO: delete a comment
}

export { getVideoComments, addComment, updateComment, deleteComment }
