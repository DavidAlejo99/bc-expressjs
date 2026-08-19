import { Request, Response, NextFunction } from 'express';
import * as service from '../services/children.service';
import { CreateChildDto, UpdateChildDto, ErrorResponse } from '../types';

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query['page'] as string) || 1;
    const limit = parseInt(req.query['limit'] as string) || 10;
    const result = await service.findAll({ page, limit });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params['id'] as string);
    const child = await service.findById(id);
    if (!child) {
      const errRes: ErrorResponse = { error: 'Not Found', message: `Child ${id} not found` };
      res.status(404).json(errRes);
      return;
    }
    res.json({ data: child });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = req.body as CreateChildDto;
    const child = await service.create(dto);
    res.status(201).json({ data: child });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params['id'] as string);
    const dto = req.body as UpdateChildDto;
    const child = await service.update(id, dto);
    if (!child) {
      const errRes: ErrorResponse = { error: 'Not Found', message: `Child ${id} not found` };
      res.status(404).json(errRes);
      return;
    }
    res.json({ data: child });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params['id'] as string);
    const deleted = await service.remove(id);
    if (!deleted) {
      const errRes: ErrorResponse = { error: 'Not Found', message: `Child ${id} not found` };
      res.status(404).json(errRes);
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}