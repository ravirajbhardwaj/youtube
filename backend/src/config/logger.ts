import pino, { Logger, stdTimeFunctions } from 'pino';
import { env } from './env';
import type { Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';

const redact = {
  paths: [
    'password', 'token', 'apiKey', 'authorization',
    '*.password', '*.token', 'req.headers.authorization', 'req.headers.cookie',
    'creditCard.number', 'ssn'
  ],
  remove: true
};

const serializers = {
  err: pino.stdSerializers.err,
  req: (req: Request) => req && req.method ? { method: req.method, url: req.url } : req,
  res: (res: Response) => res && res.statusCode ? { statusCode: res.statusCode } : res
};

const base = {
  env: env.NODE_ENV,
  version: env.APP_VERSION
};

function createLogger(): Logger {
  const commonOptions = {
    level: env.LOG_LEVEL,
    serializers,
    redact,
    base,
    timestamp: stdTimeFunctions.isoTime as any
  };

  if (env.NODE_ENV !== 'production') {
    return pino(
      commonOptions,
      pino.transport({
        target: 'pino-pretty',
        options: {
          colorize: true,
          singleLine: false,
          translateTime: 'yyyy-mm-dd HH:MM:ss',
          ignore: 'pid,hostname'
        }
      })
    )
  }

  try {
    return pino(commonOptions);
  } catch (err) {
    throw new ApiError(500, "LOGGER FAILED");
  }
}

export const logger: Logger = createLogger();