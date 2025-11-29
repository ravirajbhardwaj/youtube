import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import path from "path";
import { env } from "./env";
import { logger } from "./logger";
import { ApiError } from "@/utils/ApiError";

cloudinary.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_SECRET_KEY,
});

export const uploadOnCloudinary = async (localFilePath: string) => {
  if (!localFilePath) {
    throw new ApiError(400, "No file path provided");
  }

  try {
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    return response;
  } catch (error: any) {
    throw new ApiError(500, error.message);
  } finally {
    try {
      const absolutePath = path.resolve(localFilePath);
      await fs.unlink(absolutePath);
    } catch (unlinkErr) {
      logger.warn({ unlinkErr }, `Failed to delete local file: ${localFilePath}`);
    }
  }
};