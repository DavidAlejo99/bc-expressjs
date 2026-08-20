import { Request, Response, NextFunction } from 'express';
import { childrenService } from '../services/children.service';
import { createChildSchema, updateChildSchema } from '../schemas/child.schema';

export const childrenController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query['page'] ?? 1);
      const limit = Number(req.query['limit'] ?? 10);
      const result = await childrenService.getAll(page, limit);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params['id'] as string, 10);
      const child = await childrenService.getById(id);
      res.status(200).json({ data: child });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = createChildSchema.parse(req.body);
      const child = await childrenService.create(dto);
      res.status(201).json({ data: child });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params['id'] as string, 10);
      const dto = updateChildSchema.parse(req.body);
      const child = await childrenService.update(id, dto);
      res.status(200).json({ data: child });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params['id'] as string, 10);
      await childrenService.remove(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};