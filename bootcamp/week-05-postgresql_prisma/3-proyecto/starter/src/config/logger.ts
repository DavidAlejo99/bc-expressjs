import winston from 'winston';

const level = process.env.NODE_ENV === 'production' ? 'warn' : 'info';

const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
);

const prodFormat = winston.format.combine(winston.format.timestamp(), winston.format.json());

export const logger = winston.createLogger({
  level,
  format: process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
  transports: [
    new winston.transports.Console(),
    ...(process.env.NODE_ENV === 'production'
      ? [new winston.transports.File({ filename: 'logs/error.log', level: 'error' })]
      : []),
  ],
});