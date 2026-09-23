import { z } from 'zod';

const GROUPS = [
  'Sala Cuna',
  'Maternal',
  'Párvulos',
  'Pre-jardín',
  'Jardín',
  'Transición',
] as const;

export const createChildSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(120)
      .regex(/^[\p{L}\p{M}\s'.-]+$/u, 'Name must not contain HTML or special characters'),
    enrollmentCode: z
      .string()
      .regex(/^[A-Z0-9-]{4,20}$/, 'Enrollment code must be 4-20 uppercase letters, numbers or dashes'),
    group: z.enum(GROUPS, { error: 'Invalid group' }),
    monthlyFee: z.number().positive('Monthly fee must be positive'),
    birthDate: z.coerce.date({ error: 'Invalid birth date' }),
  }),
});

export const updateChildSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2)
      .max(120)
      .regex(/^[\p{L}\p{M}\s'.-]+$/u)
      .optional(),
    group: z.enum(GROUPS).optional(),
    monthlyFee: z.number().positive().optional(),
    birthDate: z.coerce.date().optional(),
    active: z.boolean().optional(),
  }),
});

export type CreateChildDto = z.infer<typeof createChildSchema>['body'];
export type UpdateChildDto = z.infer<typeof updateChildSchema>['body'];
