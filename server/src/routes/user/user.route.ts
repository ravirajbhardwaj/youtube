import { Hono } from 'hono'

const userRouter = new Hono()

import {
  changeCurrentPassword,
  forgotPasswordRequest,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  resendEmailVerification,
  resetForgottenPassword,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  verifyEmail,
} from './user.controller'

// Public routes
userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.post('/forgot-password', forgotPasswordRequest)
userRouter.post('/reset-password/:resetToken', resetForgottenPassword)
userRouter.get('/verify-email/:verificationToken', verifyEmail)

// Secured routes
userRouter.post('/logout', logoutUser)
userRouter.post('/resend-email-verification', resendEmailVerification)
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
