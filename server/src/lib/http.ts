import { HttpStatus } from '@/lib/const'
import type { Context } from 'hono'

export class ApiResponse<T = any> {
  success: boolean
  constructor(
    public statusCode: number,
    public data: T,
    public message: string
  ) {
    this.success = statusCode >= 200 && statusCode < 400
  }
}

export class ApiError extends Error {
  private readonly success: boolean
  private readonly data: null
  constructor(
    public statusCode: number,
    message = 'Something went wrong',
    stack = ''
  ) {
    super(message)
    this.statusCode = statusCode
    this.data = null
    this.success = false
    this.message = message

    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export const ok = <T>(c: Context, data: T, message = 'Success') =>
  c.json(new ApiResponse(HttpStatus.OK, data, message), 200)

export const created = <T>(c: Context, data: T, message = 'Created') =>
  c.json(new ApiResponse(HttpStatus.CREATED, data, message), 201)

export const error = (status: number, message: string): void => {
  throw new ApiError(status, message)
}
