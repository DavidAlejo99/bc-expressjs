import { z } from 'zod';

export const createChildSchema = z.object({
  name: z.string({ error: 'name es obligatorio' }).min(1, 'name no puede estar vacío').trim(),
  group: z.enum(
    ['Sala Cuna', 'Maternal', 'Párvulos', 'Pre-jardín', 'Jardín', 'Transición'],
    { error: 'group debe ser uno de los grupos válidos' }
  ),
  monthlyFee: z.number({ error: 'monthlyFee es obligatorio' }).positive('monthlyFee debe ser mayor a 0'),
  active: z.boolean().default(true),
});

export const updateChildSchema = createChildSchema.partial();

export type CreateChildDto = z.infer<typeof createChildSchema>;
export type UpdateChildDto = z.infer<typeof updateChildSchema>;