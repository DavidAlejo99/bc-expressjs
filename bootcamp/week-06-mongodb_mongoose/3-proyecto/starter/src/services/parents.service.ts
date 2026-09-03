import * as repo from '../repositories/parents.repository';
import type { CreateParentDto, UpdateParentDto } from '../schemas/parent.schema';

export async function getAll() {
  return repo.findAll();
}
export async function getById(id: string) {
  return repo.findById(id);
}
export async function createParent(dto: CreateParentDto) {
  return repo.create(dto);
}
export async function updateParent(id: string, dto: UpdateParentDto) {
  return repo.update(id, dto);
}
export async function deleteParent(id: string) {
  return repo.remove(id);
}