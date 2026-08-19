import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as service from '../services/products.service';
import { SingleResponse, PaginatedResponse } from '../types';
import {
  createProductSchema,
  updateProductSchema,
  CreateProductDto,
  UpdateProductDto,
} from '../schemas/product.schema';

const idSchema = z.coerce.number().int().positive({
  message: 'El id debe ser un número entero positivo',
});

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 10;
    const result = await service.findAll({ page, limit });
    res.json(result satisfies PaginatedResponse<typeof result.data[number]>);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = idSchema.safeParse(req.params['id']);
    if (!parsed.success) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Parámetro inválido',
        issues: parsed.error.issues.map((issue) => ({
          field: issue.path.join('.') || 'id',
          message: issue.message,
        })),
      });
      return;
    }
    const id = parsed.data;

    const product = await service.findById(id);
    if (!product) {
      res.status(404).json({ error: 'Not Found', message: `Product ${id} not found` });
      return;
    }
    res.json({ data: product } satisfies SingleResponse<typeof product>);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = createProductSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Datos de entrada inválidos',
        issues: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
      return;
    }
    const dto: CreateProductDto = result.data;

    const product = await service.create(dto);
    res.status(201).json({ data: product } satisfies SingleResponse<typeof product>);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedId = idSchema.safeParse(req.params['id']);
    if (!parsedId.success) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Parámetro inválido',
        issues: parsedId.error.issues.map((issue) => ({
          field: issue.path.join('.') || 'id',
          message: issue.message,
        })),
      });
      return;
    }
    const id = parsedId.data;

    const result = updateProductSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Datos de entrada inválidos',
        issues: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
      return;
    }
    const dto: UpdateProductDto = result.data;

    const product = await service.update(id, dto);
    if (!product) {
      res.status(404).json({ error: 'Not Found', message: `Product ${id} not found` });
      return;
    }
    res.json({ data: product } satisfies SingleResponse<typeof product>);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = idSchema.safeParse(req.params['id']);
    if (!parsed.success) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Parámetro inválido',
        issues: parsed.error.issues.map((issue) => ({
          field: issue.path.join('.') || 'id',
          message: issue.message,
        })),
      });
      return;
    }
    const id = parsed.data;

    const deleted = await service.remove(id);
    if (!deleted) {
      res.status(404).json({ error: 'Not Found', message: `Product ${id} not found` });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}