import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Datos de entrada inválidos',
      issues: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.statusCode >= 500 ? 'Internal Server Error' : 'Application Error',
      message: err.message,
    });
    return;
  }

  const isProduction = process.env['NODE_ENV'] === 'production';
  const message = isProduction ? 'Error interno del servidor' : (err as Error).message;
  res.status(500).json({
    error: 'Internal Server Error',
    message,
    ...(isProduction ? {} : { stack: (err as Error).stack }),
  });
}