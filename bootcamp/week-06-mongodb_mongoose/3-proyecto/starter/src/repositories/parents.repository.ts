import mongoose from 'mongoose';
import { Parent } from '../models/parent.model';
import { AppError } from '../errors/AppError';
import { isDuplicateKeyError } from '../lib/mongo-errors';
import type { CreateParentDto, UpdateParentDto } from '../schemas/parent.schema';

export async function findAll(): Promise<unknown[]> {
  return Parent.find().sort({ fullName: 1 }).lean();
}

export async function findById(id: string): Promise<unknown> {
  try {
    const parent = await Parent.findById(id).lean();
    if (!parent) throw new AppError(404, 'Acudiente no encontrado');
    return parent;
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
    throw err;
  }
}

export async function create(dto: CreateParentDto): Promise<unknown> {
  try {
    const parent = await Parent.create(dto);
    return parent.toJSON();
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      throw new AppError(409, 'Ya existe un acudiente con ese email');
    }
    throw err;
  }
}

export async function update(id: string, dto: UpdateParentDto): Promise<unknown> {
  try {
    const parent = await Parent.findByIdAndUpdate(id, dto, { new: true, runValidators: true }).lean();
    if (!parent) throw new AppError(404, 'Acudiente no encontrado');
    return parent;
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
    if (isDuplicateKeyError(err)) {
      throw new AppError(409, 'Ya existe un acudiente con ese email');
    }
    throw err;
  }
}

export async function remove(id: string): Promise<void> {
  try {
    const parent = await Parent.findByIdAndDelete(id);
    if (!parent) throw new AppError(404, 'Acudiente no encontrado');
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
    throw err;
  }
}