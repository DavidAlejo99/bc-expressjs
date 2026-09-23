import { AppError } from '../errors/AppError.js';
import type { CreateChildDto, UpdateChildDto } from '../types/index.js';
import type { IChild } from '../models/child.model.js';
import * as childrenRepo from '../repositories/children.repository.js';

export async function getAll(): Promise<IChild[]> {
  return childrenRepo.findAllChildren();
}

export async function getById(id: string): Promise<IChild> {
  const child = await childrenRepo.findChildById(id);
  if (!child) throw new AppError(404, 'Child not found');
  return child;
}

export async function create(dto: CreateChildDto, createdBy: string): Promise<IChild> {
  return childrenRepo.createChild(dto, createdBy);
}

export async function update(
  id: string,
  dto: UpdateChildDto,
  requesterId: string,
  requesterRole: string,
): Promise<IChild> {
  const existing = await childrenRepo.findChildById(id);
  if (!existing) throw new AppError(404, 'Child not found');

  if (existing.createdBy !== requesterId && requesterRole !== 'admin') {
    throw new AppError(403, 'Insufficient permissions');
  }

  const updated = await childrenRepo.updateChild(id, dto);
  if (!updated) throw new AppError(404, 'Child not found');
  return updated;
}

export async function remove(
  id: string,
  requesterId: string,
  requesterRole: string,
): Promise<void> {
  const existing = await childrenRepo.findChildById(id);
  if (!existing) throw new AppError(404, 'Child not found');

  if (existing.createdBy !== requesterId && requesterRole !== 'admin') {
    throw new AppError(403, 'Insufficient permissions');
  }

  await childrenRepo.deleteChild(id);
}
