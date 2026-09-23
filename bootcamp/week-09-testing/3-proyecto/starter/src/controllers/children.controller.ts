import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import * as childrenService from '../services/children.service.js';
import { createChildSchema, updateChildSchema, childIdSchema } from '../validators/children.schema.js';

export async function getAllHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const children = await childrenService.getAll();
    res.status(200).json({ data: children, total: children.length });
  } catch (err) {
    next(err);
  }
}

export async function getByIdHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { params } = childIdSchema.parse({ params: req.params });
    const child = await childrenService.getById(params.id);
    res.status(200).json({ data: child });
  } catch (err) {
    if (err instanceof ZodError) return next(err);
    next(err);
  }
}

export async function createHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { body } = createChildSchema.parse({ body: req.body });
    const user = res.locals['user'] as { sub: string };
    const child = await childrenService.create(body, user.sub);
    res.status(201).json({ data: child });
  } catch (err) {
    if (err instanceof ZodError) return next(err);
    next(err);
  }
}

export async function updateHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { params } = childIdSchema.parse({ params: req.params });
    const { body } = updateChildSchema.parse({ body: req.body });
    const user = res.locals['user'] as { sub: string; role: string };
    const child = await childrenService.update(params.id, body, user.sub, user.role);
    res.status(200).json({ data: child });
  } catch (err) {
    if (err instanceof ZodError) return next(err);
    next(err);
  }
}

export async function deleteHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { params } = childIdSchema.parse({ params: req.params });
    const user = res.locals['user'] as { sub: string; role: string };
    await childrenService.remove(params.id, user.sub, user.role);
    res.status(204).send();
  } catch (err) {
    if (err instanceof ZodError) return next(err);
    next(err);
  }
}
