import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger";
import { ApiError } from "../utils/ApiError";
import { ERROR_CODE, ERROR_NAME } from "../utils/constant";
import { Prisma } from "../generated/prisma/client";

export const errorHandler = (error: any, req: Request, res: Response, _: NextFunction): void => {
  let apiError: ApiError;

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    apiError = new ApiError(ERROR_CODE.DATABASE_ERROR, ERROR_NAME.DATABASE_ERROR)
  } else if (error instanceof ApiError) {
    apiError = error
  } else {
    apiError = new ApiError(ERROR_CODE.INTERNAL_SERVER_ERROR, error.message || ERROR_NAME.INTERNAL_SERVER_ERROR)
  }

  logger.error({
    path: req.path,
    method: req.method,
    ip: req.ip,
    stack: apiError.stack || ""
  }, apiError.message)

  res.status(apiError.statusCode).json({
    code: apiError.statusCode,
    message: apiError.message,
    data: apiError.data,
    success: apiError.success
  })
}