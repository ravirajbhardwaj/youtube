import type { Context } from 'hono'

const registerUser = async (c: Context) => {
  // const { fullname, username, email, password } = handleZodError(
  //   validateRegister(c.req.body)
  // )
  //   logger.info({ email, ip: req.ip }, 'REGISTRATION ATTEMPT')
  //   const existedUser = await prisma.user.findUnique({
  //     where: { email, username },
  //   })
  //   if (existedUser) {
  //     logger.info({ email, username }, 'USER ALREADY EXIST')
  //     throw new ApiError(
  //       ERROR_CODE.CONFLICT,
  //       'User with username or email already exists'
  //     )
  //   }
  //   // let avatarUrl;
  //   // let coverImageUrl;
  //   // if (req.files) {
  //   //   try {
  //   //     const avatarFile = req.files?.avatar?.[0];
  //   //     const coverFile = req.files?.coverImage?.[0];
  //   //     const  = await uploadOnCloudinary(avatarFile)
  //   //     avatarUrl = uploaded?.secure_url;
  //   //     logger.info({ email, avatarUrl }, "Avatar uploaded successfully");
  //   //   } catch (err: any) {
  //   //     logger.warn(`Avatar upload failed for ${email} due to ${err.message}`);
  //   //   }
  //   // }
  //   // let avatarUrl, coverImageUrl;
  //   // if (req.files) {
  //   //   const avatarFile = req.files?.avatar?.[0];
  //   //   const coverFile = req.files?.coverImage?.[0];
  //   //   try {
  //   //     const avatarUpload = await uploadOnCloudinary(avatarFile);
  //   //     avatarUrl = avatarUpload.secure_url;
  //   //   } catch (err) {
  //   //     logger.warn(`Avatar upload failed for ${email} due to ${(err as Error).message}`);
  //   //     return res.status(500).json({ error: "Avatar upload failed" });
  //   //   }
  //   //   try {
  //   //     const coverUpload = await uploadOnCloudinary(coverFile);
  //   //     coverImageUrl = coverUpload.secure_url;
  //   //   } catch (err) {
  //   //     return res.status(500).json({ error: "Cover image upload failed" });
  //   //   }
  //   // }
  //   const hashedPassword = await hashPassword('')
  //   const { unHashedToken, hashedToken, tokenExpiry } = generateTemporaryToken()
  //   const user = await prisma.user.create({
  //     data: {
  //       // avatar: avatarUrl,
  //       // coverImage: coverImageUrl,
  //       fullname,
  //       username,
  //       email,
  //       password: hashedPassword,
  //       emailVerificationToken: hashedToken,
  //       emailVerificationExpiry: tokenExpiry,
  //       isEmailVerified: false,
  //     },
  //   })
  //   await sendMail({
  //     email: user.email,
  //     subject: 'Please verify your email',
  //     mailgenContent: emailVerificationMailgenContent(
  //       user?.username,
  //       `${req.protocol}://${req.get('host')}/api/v1/users/verify-email/${unHashedToken}`
  //     ),
  //   })
  //   return res.json()
}

const loginUser = async (c: Context) => {}

const logoutUser = async (c: Context) => {}

const refreshAccessToken = async (c: Context) => {}

const changeCurrentPassword = async (c: Context) => {}

const getCurrentUser = async (c: Context) => {}

const updateAccountDetails = async (c: Context) => {}

const updateUserAvatar = async (c: Context) => {}

const updateUserCoverImage = async (c: Context) => {}

const getWatchHistory = async (c: Context) => {}

const getUserChannelProfile = async (c: Context) => {}

const forgotPasswordRequest = async (c: Context) => {}
const resetForgottenPassword = async (c: Context) => {}
const resendEmailVerification = async (c: Context) => {}
const verifyEmail = async (c: Context) => {}

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
