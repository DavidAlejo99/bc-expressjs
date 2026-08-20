import { z } from 'zod';

const GROUPS = ['Sala Cuna', 'Maternal', 'Párvulos', 'Pre-jardín', 'Jardín', 'Transición'] as const;

export const createChildSchema = z.object({
  name: z
    .string({ error: 'name es obligatorio' })
    .trim()
    .regex(/^\p{L}[\p{L}\p{M}'\- ]{1,59}$/u, 'name debe ser un nombre válido (letras, tildes, espacios)'),
  enrollmentCode: z
    .string({ error: 'enrollmentCode es obligatorio' })
    .regex(/^[A-Z]{2,4}-\d{4}-\d{3,6}$/, 'enrollmentCode debe tener el formato PREFIJO-AÑO-CORRELATIVO, ej: JI-2026-001'),
  group: z.enum(GROUPS, { error: 'group debe ser uno de los grupos válidos' }),
  monthlyFee: z.number({ error: 'monthlyFee es obligatorio' }).positive('monthlyFee debe ser mayor a 0'),
  active: z.boolean().default(true),
  birthDate: z.coerce.date({ error: 'birthDate debe ser una fecha válida' }),
  parentId: z.number().int().positive().optional(),
});

export const updateChildSchema = createChildSchema.partial();

export type CreateChildDto = z.infer<typeof createChildSchema>;
export type UpdateChildDto = z.infer<typeof updateChildSchema>;