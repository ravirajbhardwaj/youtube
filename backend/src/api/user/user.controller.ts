import asyncHandler from "../../utils/asyncHandler.js";
import { Request, Response } from "express";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";


// const generateAccessAndRefereshTokens = async (userId) => {
//   try {
//     const user = await User.findById(userId)
//     const accessToken = user.generateAccessToken()
//     const refreshToken = user.generateRefreshToken()

//     user.refreshToken = refreshToken
//     await user.save({ validateBeforeSave: false })

//     return { accessToken, refreshToken }


//   } catch (error) {
//     throw new ApiError(500, "Something went wrong while generating referesh and access token")
//   }
// }

const registerUser = asyncHandler(async (req: Request, res: Response) => {

})

const loginUser = asyncHandler(async (req: Request, res: Response) => {

})

const logoutUser = asyncHandler(async (req: Request, res: Response) => {

})

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {

})

const changeCurrentPassword = asyncHandler(async (req: Request, res: Response) => {

})

const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {

})

const updateAccountDetails = asyncHandler(async (req: Request, res: Response) => {

});

const updateUserAvatar = asyncHandler(async (req: Request, res: Response) => {

})

const updateUserCoverImage = asyncHandler(async (req: Request, res: Response) => {

})

const getWatchHistory = asyncHandler(async (req: Request, res: Response) => {

})

const getUserChannelProfile = asyncHandler(async (req: Request, res: Response) => {

})

const forgotPasswordRequest = asyncHandler(async (req: Request, res: Response) => {

})
const resetForgottenPassword = asyncHandler(async (req: Request, res: Response) => {

})
const resendEmailVerification = asyncHandler(async (req: Request, res: Response) => {

})
const verifyEmail = asyncHandler(async (req: Request, res: Response) => {

})


export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  forgotPasswordRequest,
  resetForgottenPassword,
  resendEmailVerification,
  verifyEmail,
}