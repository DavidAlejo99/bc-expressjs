import { parentsRepository } from '../repositories/parents.repository';
import { CreateParentDto, UpdateParentDto } from '../schemas/parent.schema';
import { AppError } from '../errors/AppError';

export const parentsService = {
  getAll() {
    return parentsRepository.findAll();
  },

  async getById(id: number) {
    const parent = await parentsRepository.findById(id);
    if (!parent) {
      throw new AppError(404, `No se encontró el acudiente con id ${id}`);
    }
    return parent;
  },

  create(dto: CreateParentDto) {
    return parentsRepository.create(dto);
  },

  async update(id: number, dto: UpdateParentDto) {
    await this.getById(id);
    return parentsRepository.update(id, dto);
  },

  async remove(id: number) {
    await this.getById(id);
    return parentsRepository.remove(id);
  },
};