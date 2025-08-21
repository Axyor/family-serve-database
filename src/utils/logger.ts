import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'production' ? undefined : {
    target: 'pino-pretty',
    options: { colorize: true, translateTime: 'SYS:standard' }
  }
});

export function logError(context: string, err: unknown) {
  if (err instanceof Error) {
    logger.error({ msg: err.message, stack: err.stack, context });
  } else {
    logger.error({ msg: 'Unknown error', err, context });
  }
}