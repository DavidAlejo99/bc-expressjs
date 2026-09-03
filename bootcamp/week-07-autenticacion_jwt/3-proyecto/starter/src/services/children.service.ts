import { IChild } from '../models/child.model';
import * as childrenRepository from '../repositories/children.repository';
import { CreateChildDto, UpdateChildDto } from '../schemas/child.schema';
import { AppError } from '../errors/AppError';

export async function getAll(): Promise<IChild[]> {
  return childrenRepository.findAll();
}

export async function getById(id: string): Promise<IChild> {
  const child = await childrenRepository.findById(id);
  if (!child) throw new AppError(404, 'Niño no encontrado');
  return child;
}

export async function create(dto: CreateChildDto, userId: string): Promise<IChild> {
  return childrenRepository.create(dto, userId);
}

export async function update(id: string, dto: UpdateChildDto): Promise<IChild> {
  const child = await childrenRepository.updateById(id, dto);
  if (!child) throw new AppError(404, 'Niño no encontrado');
  return child;
}

export async function remove(id: string): Promise<void> {
  const deleted = await childrenRepository.deleteById(id);
  if (!deleted) throw new AppError(404, 'Niño no encontrado');
}
