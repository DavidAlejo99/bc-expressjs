import { childrenRepository } from '../repositories/children.repository';
import { CreateChildDto, UpdateChildDto } from '../schemas/child.schema';
import { AppError } from '../errors/AppError';

export const childrenService = {
  async getAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await childrenRepository.findAll(skip, limit);
    return { data, total, page, limit };
  },

  async getById(id: number) {
    const child = await childrenRepository.findById(id);
    if (!child) {
      throw new AppError(404, `No se encontró el niño con id ${id}`);
    }
    return child;
  },

  create(dto: CreateChildDto) {
    return childrenRepository.create(dto);
  },

  async update(id: number, dto: UpdateChildDto) {
    await this.getById(id);
    return childrenRepository.update(id, dto);
  },

  async remove(id: number) {
    await this.getById(id);
    return childrenRepository.remove(id);
  },
};