import { CreateChildDto, UpdateChildDto, Child, PaginatedResponse, PaginationParams } from '../types';
import * as repo from '../repositories/children.repository';

export async function findAll(params: PaginationParams): Promise<PaginatedResponse<Child>> {
  const { page, limit } = params;
  const all = await repo.findAll();
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);
  return { data, total: all.length, page, limit };
}

export async function findById(id: number): Promise<Child | undefined> {
  return repo.findById(id);
}

export async function create(dto: CreateChildDto): Promise<Child> {
  return repo.create(dto);
}

export async function update(id: number, dto: UpdateChildDto): Promise<Child | undefined> {
  const exists = await repo.findById(id);
  if (!exists) return undefined;
  return repo.update(id, dto);
}

export async function remove(id: number): Promise<boolean> {
  const exists = await repo.findById(id);
  if (!exists) return false;
  return repo.remove(id);
}