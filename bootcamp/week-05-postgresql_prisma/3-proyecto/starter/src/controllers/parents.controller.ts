import { Request, Response, NextFunction } from 'express';
import { parentsService } from '../services/parents.service';
import { createParentSchema, updateParentSchema } from '../schemas/parent.schema';

export const parentsController = {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const parents = await parentsService.getAll();
      res.status(200).json({ data: parents });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params['id'] as string, 10);
      const parent = await parentsService.getById(id);
      res.status(200).json({ data: parent });
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = createParentSchema.parse(req.body);
      const parent = await parentsService.create(dto);
      res.status(201).json({ data: parent });
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params['id'] as string, 10);
      const dto = updateParentSchema.parse(req.body);
      const parent = await parentsService.update(id, dto);
      res.status(200).json({ data: parent });
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params['id'] as string, 10);
      await parentsService.remove(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};