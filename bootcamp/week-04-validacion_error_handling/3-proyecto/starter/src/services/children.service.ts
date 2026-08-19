import { Child, PaginatedResponse } from '../types';
import * as repo from '../repositories/children.repository';
import { AppError } from '../errors/AppError';

interface FindAllOptions {
  page: number;
  limit: number;
}

export async function findAll(opts: FindAllOptions): Promise<PaginatedResponse<Child>> {
  const { page, limit } = opts;
  const all = await repo.findAll();
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);
  return { data, total: all.length, page, limit };
}

export async function findById(id: number): Promise<Child> {
  const child = await repo.findById(id);
  if (!child) throw new AppError(404, `Child ${id} not found`);
  return child;
}

export async function create(dto: repo.CreateChildRepoDto): Promise<Child> {
  return repo.create(dto);
}

export async function update(id: number, dto: repo.UpdateChildRepoDto): Promise<Child> {
  const exists = await repo.findById(id);
  if (!exists) throw new AppError(404, `Child ${id} not found`);
  const updated = await repo.update(id, dto);
  return updated!;
}

export async function remove(id: number): Promise<void> {
  const exists = await repo.findById(id);
  if (!exists) throw new AppError(404, `Child ${id} not found`);
  await repo.remove(id);
}