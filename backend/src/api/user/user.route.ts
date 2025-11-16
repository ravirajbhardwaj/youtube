import { Router } from "express";
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
  forgotPasswordRequest,
  resetForgottenPassword,
  resendEmailVerification,
  verifyEmail,
} from "./user.controller";
// import {upload} from "../middlewares/multer.middleware.js"
// import { verifyJWT } from '../../middlewares/auth.middleware';


const router = Router()

router.route("/register").post(
  // upload.fields([
  //   {
  //     name: "avatar",
  //     maxCount: 1
  //   },
  //   {
  //     name: "coverImage",
  //     maxCount: 1
  //   }
  // ]),
  registerUser
)

router.route("/login").post(loginUser)

router.route("/forgot-password").post(forgotPasswordRequest);

//secured routes
router.route("/logout").post(logoutUser)
router.route("/resend-email-verification").post(resendEmailVerification);
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(changeCurrentPassword)
router.route("/current-user").get(getCurrentUser)
router.route("/update-account").patch(updateAccountDetails)

router.route("/reset-password/:resetToken").post(resetForgottenPassword);

router.route("/avatar").patch(/*  upload.single("avatar"),*/ updateUserAvatar)
router.route("/cover-image").patch(/*  upload.single("coverImage"),*/ updateUserCoverImage)

router.route("/c/:username").get(getUserChannelProfile)
router.route("/history").get(getWatchHistory)

export default router