import { USER_TEMPORARY_TOKEN_EXPIRY } from './const'
import { JWTPayload, SignJWT, jwtVerify } from 'jose'
import { env } from './env'

export const hashPassword = async (password: string) =>
  await Bun.password.hash(password)

export const passwordMatch = async (
  enteredPassword: string,
  storedPassword: string
) => await Bun.password.verify(enteredPassword, storedPassword)

export const generateAccessAndRefreshTokens = async (payload: JWTPayload) => {
  const accessTokenSecret = new TextEncoder().encode(env.ACCESS_TOKEN_SECRET)
  const refreshTokenSecret = new TextEncoder().encode(env.REFRESH_TOKEN_SECRET)

  const accessToken = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer('https://myapp.com')
    .setSubject('user_123')
    .setAudience('https://api.myapp.com')
    .setIssuedAt()
    .setExpirationTime(env.ACCESS_TOKEN_EXPIRY)
    .sign(accessTokenSecret)

  const refreshToken = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer('https://myapp.com')
    .setSubject('user_123')
    .setAudience('https://api.myapp.com')
    .setIssuedAt()
    .setExpirationTime(env.REFRESH_TOKEN_EXPIRY)
    .sign(refreshTokenSecret)


  return { accessToken, refreshToken }
}