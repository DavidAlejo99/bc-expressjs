// src/repositories/products.repository.ts — Acceso a datos con Prisma
// Toda interacción con la base de datos ocurre aquí
import { prisma } from '../lib/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AppError } from '../errors/AppError';
import { CreateProductDto, UpdateProductDto } from '../schemas/product.schema';

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export async function findAll(page: number, limit: number): Promise<PaginatedResult<unknown>> {
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.product.count(),
  ]);
  return { data: products, total, page, limit };
}

export async function findById(id: number) {
  const product = await prisma.product.findUnique({ where: { id } });
  return product;
}

export async function create(data: CreateProductDto) {
  try {
    return await prisma.product.create({ data });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      throw new AppError(409, 'El SKU ya existe');
    }
    throw err;
  }
}

export async function update(id: number, data: UpdateProductDto) {
  try {
    return await prisma.product.update({ where: { id }, data });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError(404, 'Producto no encontrado');
    }
    throw err;
  }
}

export async function remove(id: number) {
  try {
    await prisma.product.delete({ where: { id } });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError(404, 'Producto no encontrado');
    }
    throw err;
  }
}