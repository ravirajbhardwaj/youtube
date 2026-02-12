import { z } from 'zod'
import { ACCEPTED_MIMES, MAX_IMAGE_BYTES } from '@/lib/const'

// Image file validation
const imageFile = z
  .instanceof(File)
  .refine(file => file.size > 0, 'File required')
  .refine(file => file.size <= MAX_IMAGE_BYTES, {
    message: `Max size ${MAX_IMAGE_BYTES} bytes`,
  })
  .refine(file => !file.type || ACCEPTED_MIMES.includes(file.type), {
    message: `Allowed types: ${ACCEPTED_MIMES.join(', ')}`,
  })

// Update avatar schema
export const updateAvatarSchema = z.object({
  avatar: imageFile,
})

// Update cover image schema
export const updateCoverImageSchema = z.object({
  coverImage: imageFile,
})

// Update account details schema
export const updateAccountDetailsSchema = z.object({
  fullname: z
    .string()
    .min(6, { message: 'Fullname must be at least 6 characters long' })
    .max(15, { message: 'Fullname must be at most 15 characters long' })
    .optional(),
  email: z.string().email({ message: 'Invalid email address' }).optional(),
  username: z
    .string()
    .max(12, { message: 'Username must be at most 12 characters long' })
    .optional(),
})

// Schema types
export type UpdateAccountDetailsInput = z.infer<
  typeof updateAccountDetailsSchema
>

// Validation helper functions
export const validateUpdateAccountDetails = (data: unknown) => {
  return updateAccountDetailsSchema.safeParse(data)
}
