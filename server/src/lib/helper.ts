import { USER_TEMPORARY_TOKEN_EXPIRY } from './const'

export const hashPassword = async (password: string) =>
  await Bun.password.hash(password)

export const passwordMatch = async (
  enteredPassword: string,
  storedPassword: string
) => await Bun.password.verify(enteredPassword, storedPassword)
