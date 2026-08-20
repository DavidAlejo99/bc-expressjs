import { prisma } from '../lib/prisma';
import { CreateParentDto, UpdateParentDto } from '../schemas/parent.schema';

export const parentsRepository = {
  findAll() {
    return prisma.parent.findMany({ include: { children: true }, orderBy: { id: 'asc' } });
  },

  findById(id: number) {
    return prisma.parent.findUnique({ where: { id }, include: { children: true } });
  },

  create(data: CreateParentDto) {
    return prisma.parent.create({ data });
  },

  update(id: number, data: UpdateParentDto) {
    return prisma.parent.update({ where: { id }, data });
  },

  remove(id: number) {
    return prisma.parent.delete({ where: { id } });
  },
};