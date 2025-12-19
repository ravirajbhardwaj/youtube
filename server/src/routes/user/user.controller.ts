import type { Context } from 'hono'
import { validateLogin, validateRegister } from './user.schema'
import { handleZodError } from '@/lib/handleZodError'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { error, ok } from '@/lib/http'
import { HttpStatus } from '@/lib/const'
import { prisma } from '@/lib/prisma'
import { hashPassword, passwordMatch } from '@/lib/helper'
import { User } from '@/generated/prisma/client'

const registerUser = async (c: Context) => {
  const fd = await c.req.formData()

  const fullname = fd.get('fullname')
  const username = fd.get('username')
  const email = fd.get('email')
  const password = fd.get('password')

  const avatar = fd.get('avatar') as File | null
  const coverImage = fd.get('coverImage') as File | null

  const parsedPayload = handleZodError(
    validateRegister({
      fullname,
      username,
      email,
      password,
      avatar,
      coverImage,
    })
  )

  let avatarUrl: string | null = null
  let coverImageUrl: string | null = null

  const existedUser = await prisma.user.findUnique({
    where: { email: parsedPayload.email, username: parsedPayload.username },
  })
  if (existedUser) {
    error(HttpStatus.CONFLICT, 'User with username or email already exists')
  }

  try {
    if (avatar && avatar instanceof File) {
      const uploaded = await uploadToCloudinary(avatar)
      avatarUrl = uploaded.secure_url
    }

    if (coverImage && coverImage instanceof File) {
      const uploaded = await uploadToCloudinary(coverImage)
      coverImageUrl = uploaded.secure_url
    }
  } catch (err: any) {
    error(HttpStatus.INTERNAL_SERVER_ERROR, 'Image upload failed')
  }

  const hashedPassword = await hashPassword(parsedPayload.password)

  // If the user does not exist, create a new user
  const user = await prisma.user.create({
    data: {
      username: parsedPayload.username,
      fullname: parsedPayload.fullname,
      email: parsedPayload.email,
      password: hashedPassword,
      avatar: avatarUrl,
      coverImage: coverImageUrl,
    },
  })

  return ok(c, { user }, 'User registration successful')
}

const loginUser = async (c: Context) => {
  const body = await c.req.json()
  const parsedPayload = handleZodError(validateLogin(body))

  const user = await prisma.user.findUnique({
    where: { email: parsedPayload.username },
    select: {
      id: true,
      username: true,
      fullname: true,
      email: true,
      password: true,
      avatar: true,
      coverImage: true,
    }
  });

  if (!user) {
    error(HttpStatus.NOT_FOUND, "User does not exist");
  }

  const isPassowrdMatch = await passwordMatch(parsedPayload.password, (user as User).password as string);

  if (!isPassowrdMatch) {
    error(HttpStatus.UNAUTHORIZED, "Invalid user credentials");
  }

  // Generate access and refresh tokens
  // const { accessToken, refreshToken } = await generateAccessAndRefreshTokens({
  //   _id: user.id,
  //   username: user.username,
  //   email: user.email,
  // });

  // Update refresh token in database
  // await prisma.user.update({
  //   where: { id: (user as User).id },
  //   data: { refreshToken },
  // });
}

const logoutUser = async (c: Context) => { }

const refreshAccessToken = async (c: Context) => { }

const changeCurrentPassword = async (c: Context) => { }

const getCurrentUser = async (c: Context) => { }

const updateAccountDetails = async (c: Context) => { }

const updateUserAvatar = async (c: Context) => { }

const updateUserCoverImage = async (c: Context) => { }

const getUserChannelProfile = async (c: Context) => { }

const getWatchHistory = async (c: Context) => { }

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
}
