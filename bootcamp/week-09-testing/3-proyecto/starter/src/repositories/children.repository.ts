import { ChildModel, type IChild } from '../models/child.model.js';
import type { CreateChildDto, UpdateChildDto } from '../types/index.js';

export async function findAllChildren(createdBy?: string): Promise<IChild[]> {
  const filter = createdBy ? { createdBy } : {};
  return ChildModel.find(filter).lean<IChild[]>().exec();
}

export async function findChildById(id: string): Promise<IChild | null> {
  return ChildModel.findById(id).lean<IChild>().exec();
}

export async function createChild(dto: CreateChildDto, createdBy: string): Promise<IChild> {
  const child = new ChildModel({ ...dto, createdBy });
  await child.save();
  return child.toObject() as IChild;
}

export async function updateChild(id: string, dto: UpdateChildDto): Promise<IChild | null> {
  return ChildModel.findByIdAndUpdate(id, dto, { new: true }).lean<IChild>().exec();
}

export async function deleteChild(id: string): Promise<IChild | null> {
  return ChildModel.findByIdAndDelete(id).lean<IChild>().exec();
}
