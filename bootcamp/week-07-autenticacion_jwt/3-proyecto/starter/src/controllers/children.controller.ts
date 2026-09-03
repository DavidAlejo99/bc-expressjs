import { Request, Response, NextFunction } from 'express';
import * as childrenService from '../services/children.service';
import { createChildSchema, updateChildSchema } from '../schemas/child.schema';

export async function getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const children = await childrenService.getAll();
    res.status(200).json(children);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const child = await childrenService.getById(req.params['id'] as string);
    res.status(200).json(child);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = createChildSchema.parse(req.body);
    const userId = req.user!.sub;
    const child = await childrenService.create(dto, userId);
    res.status(201).json(child);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = updateChildSchema.parse(req.body);
    const child = await childrenService.update(req.params['id'] as string, dto);
    res.status(200).json(child);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await childrenService.remove(req.params['id'] as string);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
