import { z } from 'zod';

export const createParentSchema = z.object({
  fullName: z
    .string({ error: 'fullName es obligatorio' })
    .trim()
    .regex(/^\p{L}[\p{L}\p{M}'\- ]{1,59}$/u, 'fullName debe ser un nombre válido (letras, tildes, espacios)'),
  email: z.string({ error: 'email es obligatorio' }).email('email debe tener un formato válido').max(254),
  phone: z.string({ error: 'phone es obligatorio' }).regex(/^\d{7,10}$/, 'phone debe tener entre 7 y 10 dígitos'),
});

export const updateParentSchema = createParentSchema.partial();

export type CreateParentDto = z.infer<typeof createParentSchema>;
export type UpdateParentDto = z.infer<typeof updateParentSchema>;