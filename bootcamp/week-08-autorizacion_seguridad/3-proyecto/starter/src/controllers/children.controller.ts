import { Request, Response, NextFunction } from 'express';
import * as childrenService from '../services/children.service.js';
import { createChildSchema, updateChildSchema } from '../schemas/child.schema.js';
import { AppError } from '../errors/AppError.js';
import { isDuplicateKeyError } from '../lib/mongo-errors.js';

export async function getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const children = await childrenService.findAll();
    res.json({ data: children, total: children.length });
  } catch (err) {
    next(err);
  }
}

export async function getById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const child = await childrenService.findById(req.params.id);
    if (!child) throw new AppError(404, 'Child not found');
    res.json({ data: child });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) throw new AppError(401, 'Not authenticated');

    const { body } = createChildSchema.parse({ body: req.body });
    const child = await childrenService.create(body, req.user.sub);
    res.status(201).json({ message: 'Child created', data: child });
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      return next(new AppError(409, 'Enrollment code already in use'));
    }
    next(err);
  }
}

export async function update(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) throw new AppError(401, 'Not authenticated');

    const { body } = updateChildSchema.parse({ body: req.body });
    const child = await childrenService.update(
      req.params.id,
      body,
      req.user.sub,
      req.user.role as string
    );

    if (!child) throw new AppError(404, 'Child not found');
    res.json({ message: 'Child updated', data: child });
  } catch (err) {
    if (err instanceof Error && err.message === 'FORBIDDEN') {
      return next(new AppError(403, 'You can only update children you registered'));
    }
    if (isDuplicateKeyError(err)) {
      return next(new AppError(409, 'Enrollment code already in use'));
    }
    next(err);
  }
}

export async function remove(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const child = await childrenService.remove(req.params.id);
    if (!child) throw new AppError(404, 'Child not found');
    res.json({ message: 'Child deleted' });
  } catch (err) {
    next(err);
  }
}
