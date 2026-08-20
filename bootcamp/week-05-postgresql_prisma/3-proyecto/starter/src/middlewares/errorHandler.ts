import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError, isAppError } from '../errors/AppError';
import { logger } from '../config/logger';

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'ValidationError',
      message: 'Los datos enviados no son válidos',
      issues: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const field = (err.meta?.['target'] as string[])?.join(', ') ?? 'campo único';
      res.status(409).json({
        error: 'ConflictError',
        message: `Ya existe un registro con ese valor en: ${field}`,
      });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({
        error: 'NotFoundError',
        message: 'El recurso solicitado no existe',
      });
      return;
    }
  }

  if (isAppError(err)) {
    logger.warn(`${req.method} ${req.originalUrl} -> ${err.statusCode}: ${err.message}`);
    res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
    });
    return;
  }

  const message = err instanceof Error ? err.message : 'Error interno del servidor';
  logger.error(`${req.method} ${req.originalUrl} -> 500: ${message}`);
  res.status(500).json({
    error: 'InternalServerError',
    message: 'Ocurrió un error inesperado',
    ...(process.env.NODE_ENV !== 'production' && err instanceof Error ? { stack: err.stack } : {}),
  });
}