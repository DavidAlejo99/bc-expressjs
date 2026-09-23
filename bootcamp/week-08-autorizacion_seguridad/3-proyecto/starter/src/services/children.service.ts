import { ChildModel, IChild } from '../models/child.model.js';
import type { CreateChildDto, UpdateChildDto } from '../schemas/child.schema.js';

export async function findAll(): Promise<IChild[]> {
  return ChildModel.find({ active: true }).sort({ createdAt: -1 });
}

export async function findById(id: string): Promise<IChild | null> {
  return ChildModel.findById(id);
}

export async function create(data: CreateChildDto, userId: string): Promise<IChild> {
  return ChildModel.create({ ...data, createdBy: userId });
}

export async function update(
  id: string,
  data: UpdateChildDto,
  requesterId: string,
  requesterRole: string
): Promise<IChild | null> {
  const child = await ChildModel.findById(id);
  if (!child) return null;

  // Solo el staff que lo creó, o un admin, puede editarlo
  if (requesterRole !== 'admin' && child.createdBy.toString() !== requesterId) {
    throw new Error('FORBIDDEN');
  }

  return ChildModel.findByIdAndUpdate(id, data, { new: true });
}

export async function remove(id: string): Promise<IChild | null> {
  // Eliminar queda reservado a admin — ya se aplica en la ruta con requireRole
  return ChildModel.findByIdAndDelete(id);
}
