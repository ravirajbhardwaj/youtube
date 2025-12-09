import { ApiError } from './http'
import { HttpStatus } from './const'
import { env } from './env'

export const uploadToCloudinary = async (file: File) => {
  try {
    const cloudName = env.CLOUDINARY_CLOUD_NAME
    const uploadPreset = env.CLOUDINARY_UPLOAD_PRESET

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`

    const form = new FormData()
    form.append('file', file)
    form.append('upload_preset', uploadPreset)

    const res = await fetch(url, {
      method: 'POST',
      body: form,
    })

    const body = await res.json()

    if (!res.ok) {
      throw new Error(body?.error?.message ?? 'Cloudinary upload failed')
    }

    return body
  } catch (error) {
    throw new ApiError(HttpStatus.BAD_REQUEST, 'Failed to upload on cloudinary')
  }
}
