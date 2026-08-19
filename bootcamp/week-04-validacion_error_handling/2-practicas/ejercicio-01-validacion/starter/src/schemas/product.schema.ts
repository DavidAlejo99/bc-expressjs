import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100).trim(),
  price: z.number({ message: 'El precio debe ser un número' }).positive('Debe ser mayor a 0'),
  stock: z.number().int('Debe ser un número entero').nonnegative('No puede ser negativo').default(0),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;