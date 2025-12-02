import { Hono } from 'hono'

import {
  getLikedVideos,
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from './like.controller'

const likeRouter = new Hono()
// likeRouter.use(verifyJWT)

likeRouter.post('/toggle/v/:videoId', toggleVideoLike)
likeRouter.post('/toggle/c/:commentId', toggleCommentLike)
likeRouter.post('/toggle/t/:tweetId', toggleTweetLike)
likeRouter.get('/videos', getLikedVideos)

export default likeRouter
