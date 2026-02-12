import { z } from 'zod'
import { ACCEPTED_MIMES, MAX_IMAGE_BYTES } from '@/lib/const'

const strongPassword = z
  .string()
  .min(6, { message: 'Password must be at least 6 characters long' })
  .max(16, { message: 'Password must be at most 16 characters long' })
  .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, number and one special character.',
  })

const imageFile = z
  .instanceof(File)
  .refine(file => file.size > 0, 'File required')
  .refine(file => file.size <= MAX_IMAGE_BYTES, {
    message: `Max size ${MAX_IMAGE_BYTES} bytes`,
  })
  .refine(file => !file.type || ACCEPTED_MIMES.includes(file.type), {
    message: `Allowed types: ${ACCEPTED_MIMES.join(', ')}`,
  })

export const registerSchema = z.object({
  username: z
    .string()
    .nonempty()
    .max(12, { message: 'Username must be at most 12 characters long' }),
  fullname: z
    .string()
    .min(6, { message: 'Fullname must be at least 6 characters long' })
    .max(15, { message: 'Fullname must be at most 15 characters long' }),
  email: z.string().nonempty().email({ message: 'Invalid email address' }),
  password: strongPassword,
  avatar: imageFile.optional(),
  coverImage: imageFile.optional(),
})

export const loginSchema = registerSchema.pick({
  username: true,
  password: true,
})

export const refreshTokenSchema = z.object({
  refreshToken: z.string().nonempty(),
})

export const changePasswordSchema = z.object({
  currentPassword: strongPassword,
  newPassword: strongPassword,
})

export const forgotPasswordSchema = z.object({
  email: z.string().nonempty().email({ message: 'Invalid email address' }),
})

export const resetPasswordSchema = z.object({
  newPassword: strongPassword,
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>

export const validateRegister = (data: unknown) => {
  return registerSchema.safeParse(data)
}

export const validateLogin = (data: unknown) => {
  return loginSchema.safeParse(data)
}

export const validateRefreshToken = (data: unknown) => {
  return refreshTokenSchema.safeParse(data)
}

export const validateChangePassword = (data: unknown) => {
  return changePasswordSchema.safeParse(data)
}

export const validateForgotPassword = (data: unknown) => {
  return forgotPasswordSchema.safeParse(data)
}
