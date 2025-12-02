import { Hono } from 'hono'
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from './comment.controller'

const commentRouter = new Hono()

// commentRouter.use(verifyJWT)

commentRouter.get('/:videoId', getVideoComments).post(addComment)
commentRouter.delete('/c/:commentId', deleteComment).patch(updateComment)

export default commentRouter
