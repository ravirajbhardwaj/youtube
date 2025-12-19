import { Hono } from 'hono'

const userRouter = new Hono()

import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  updateAccountDetails,
} from './user.controller'

// Public routes
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

// Secured routes
userRouter.post('/logout', logoutUser)
userRouter.post('/refresh-token', refreshAccessToken)
userRouter.post('/change-password', changeCurrentPassword)
userRouter.get('/current-user', getCurrentUser)
userRouter.patch('/update-account', updateAccountDetails)

// File upload routes
userRouter.patch('/avatar', updateUserAvatar)
userRouter.patch('/cover-image', updateUserCoverImage)

// User-specific routes
userRouter.get('/c/:username', getUserChannelProfile)
userRouter.get('/history', getWatchHistory)

export default userRouter
