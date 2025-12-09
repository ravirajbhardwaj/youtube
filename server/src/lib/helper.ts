import { USER_TEMPORARY_TOKEN_EXPIRY } from './const'

export const hashPassword = async (password: string) =>
  await Bun.password.hash(password)

export const passwordMatch = async (
  enteredPassword: string,
  storedPassword: string
) => await Bun.password.verify(enteredPassword, storedPassword)

const encoder = new TextEncoder()

function toHex(buffer: ArrayBuffer | Uint8Array) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function createHash(token: string) {
  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    encoder.encode(token)
  )
  return toHex(hashBuffer)
}

export async function generateTemporaryToken() {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)

  const unHashedToken = toHex(array)
  const hashedToken = await createHash(unHashedToken)
  const tokenExpiry = new Date(Date.now() + USER_TEMPORARY_TOKEN_EXPIRY)

  return { unHashedToken, hashedToken, tokenExpiry }
}
