import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const nonEmptyString = (name: string) =>
  z
    .string()
    .nonempty(`${name} cannot be empty`);

const validNumber = (name: string) =>
  z.preprocess(
    (val) => Number(val),
    z.number(`${name} must be a valid number`),
  );

const validURL = (name: string) =>
  z
    .string()
    .url(`${name} must be a valid URL`);

const envSchema = z.object({
  PORT: validNumber("PORT"),

  DATABASE_URL: validURL("DATABASE_URL"),

  ACCESS_TOKEN_SECRET: nonEmptyString("ACCESS_TOKEN_SECRET"),
  ACCESS_TOKEN_EXPIRY: nonEmptyString("ACCESS_TOKEN_EXPIRY"),
  REFRESH_TOKEN_SECRET: nonEmptyString("REFRESH_TOKEN_SECRET"),
  REFRESH_TOKEN_EXPIRY: nonEmptyString("REFRESH_TOKEN_EXPIRY"),

  MAILTRAP_TOKEN: nonEmptyString("MAILTRAP_TOKEN"),
  MAILTRAP_SENDERMAIL: z.string().email("MAILTRAP_SENDERMAIL must be a valid email"),

  CLOUDINARY_NAME: nonEmptyString("CLOUDINARY_NAME"),
  CLOUDINARY_API_KEY: nonEmptyString("CLOUDINARY_API_KEY"),
  CLOUDINARY_SECRET_KEY: nonEmptyString("CLOUDINARY_SECRET_KEY"),

  SERVER_URL: validURL("SERVER_URL"),
  CLIENT_URL: validURL("CLIENT_URL"),

  NODE_ENV: nonEmptyString("NODE_ENV").includes('production'),
});

const createEnv = (env: NodeJS.ProcessEnv) => {
  const result = envSchema.safeParse(env);

  if (!result.success) {
    const messages = result.error;

    console.error('Environment variable validation failed:', messages.format ? messages.format() : messages);
    process.exit(1);
  }

  return result.data;
};

export const env = createEnv(process.env);