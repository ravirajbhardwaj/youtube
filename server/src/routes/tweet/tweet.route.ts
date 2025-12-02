import { Hono } from 'hono'
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from './tweet.controller'

const tweetRouter = new Hono()
// tweetRouter.use(verifyJWT)

tweetRouter.post('/', createTweet)
tweetRouter.get('/user/:userId', getUserTweets)
tweetRouter.patch('/:tweetId', updateTweet).delete(deleteTweet)

export default tweetRouter
