import mongoose from 'mongoose';
import { Child } from '../models/child.model';
import { AppError } from '../errors/AppError';
import { isDuplicateKeyError } from '../lib/mongo-errors';
import type { CreateChildDto, UpdateChildDto } from '../schemas/child.schema';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export async function findAll(
  page: number,
  limit: number,
  search?: string,
): Promise<PaginatedResult<unknown>> {
  const skip = (page - 1) * limit;
  const filter = search ? { name: { $regex: search, $options: 'i' } } : {};
  const [data, total] = await Promise.all([
    Child.find(filter).populate('parent').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Child.countDocuments(filter),
  ]);
  return { data, total, page, totalPages: Math.ceil(total / limit) };
}

export async function findById(id: string): Promise<unknown> {
  try {
    const child = await Child.findById(id).populate('parent').lean();
    if (!child) throw new AppError(404, 'Niño no encontrado');
    return child;
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
    throw err;
  }
}

export async function create(dto: CreateChildDto): Promise<unknown> {
  try {
    const child = await Child.create(dto);
    return child.toJSON();
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      throw new AppError(409, 'Ya existe un niño con ese código de matrícula');
    }
    throw err;
  }
}

export async function update(id: string, dto: UpdateChildDto): Promise<unknown> {
  try {
    const child = await Child.findByIdAndUpdate(id, dto, { new: true, runValidators: true }).lean();
    if (!child) throw new AppError(404, 'Niño no encontrado');
    return child;
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
    if (isDuplicateKeyError(err)) {
      throw new AppError(409, 'Ya existe un niño con ese código de matrícula');
    }
    throw err;
  }
}

export async function remove(id: string): Promise<void> {
  try {
    const child = await Child.findByIdAndDelete(id);
    if (!child) throw new AppError(404, 'Niño no encontrado');
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
    throw err;
  }
}