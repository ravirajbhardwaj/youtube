import type { Context } from 'hono'

const toggleVideoLike = async (c: Context) => {
  // const { videoId } = req.params
  //TODO: toggle like on video
}

const toggleCommentLike = async (c: Context) => {
  // const { commentId } = req.params
  //TODO: toggle like on comment
}

const toggleTweetLike = async (c: Context) => {
  // const { tweetId } = req.params
  //TODO: toggle like on tweet
}

const getLikedVideos = async (c: Context) => {
  //TODO: get all liked videos
}
export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos }
