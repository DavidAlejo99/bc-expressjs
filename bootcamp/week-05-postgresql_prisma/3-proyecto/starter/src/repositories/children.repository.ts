import { prisma } from '../lib/prisma';
import { CreateChildDto, UpdateChildDto } from '../schemas/child.schema';

export const childrenRepository = {
  findAll(skip: number, take: number) {
    return prisma.$transaction([
      prisma.child.findMany({ skip, take, include: { parent: true }, orderBy: { id: 'asc' } }),
      prisma.child.count(),
    ]);
  },

  findById(id: number) {
    return prisma.child.findUnique({ where: { id }, include: { parent: true } });
  },

  create(data: CreateChildDto) {
    return prisma.child.create({ data });
  },

  update(id: number, data: UpdateChildDto) {
    return prisma.child.update({ where: { id }, data });
  },

  remove(id: number) {
    return prisma.child.delete({ where: { id } });
  },
};