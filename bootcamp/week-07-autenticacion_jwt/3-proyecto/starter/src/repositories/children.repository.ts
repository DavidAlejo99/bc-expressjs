import mongoose from 'mongoose';
import { ChildModel, IChild } from '../models/child.model';
import { AppError } from '../errors/AppError';
import { isDuplicateKeyError } from '../lib/mongo-errors';
import type { CreateChildDto, UpdateChildDto } from '../schemas/child.schema';

export async function findAll(): Promise<IChild[]> {
  return ChildModel.find().sort({ createdAt: -1 });
}

export async function findById(id: string): Promise<IChild | null> {
  try {
    return await ChildModel.findById(id);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
    throw err;
  }
}

export async function create(dto: CreateChildDto, createdBy: string): Promise<IChild> {
  try {
    return await ChildModel.create({ ...dto, createdBy });
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      throw new AppError(409, 'Ya existe un niño con ese código de matrícula');
    }
    throw err;
  }
}

export async function updateById(id: string, dto: UpdateChildDto): Promise<IChild | null> {
  try {
    return await ChildModel.findByIdAndUpdate(id, dto, { new: true, runValidators: true });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
    if (isDuplicateKeyError(err)) {
      throw new AppError(409, 'Ya existe un niño con ese código de matrícula');
    }
    throw err;
  }
}

export async function deleteById(id: string): Promise<boolean> {
  try {
    const result = await ChildModel.findByIdAndDelete(id);
    return result !== null;
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, 'ID inválido');
    throw err;
  }
}
