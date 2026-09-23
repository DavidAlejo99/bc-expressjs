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
    name:           z.string().min(2).max(120),
    enrollmentCode: z.string().regex(/^[A-Z0-9-]{4,20}$/, 'Invalid enrollment code format'),
    group:          z.enum(GROUPS),
    monthlyFee:     z.number().positive(),
    birthDate:      z.coerce.date(),
  }),
});

export const updateChildSchema = z.object({
  body: z.object({
    name:       z.string().min(2).max(120).optional(),
    group:      z.enum(GROUPS).optional(),
    monthlyFee: z.number().positive().optional(),
    birthDate:  z.coerce.date().optional(),
    active:     z.boolean().optional(),
  }),
});

export const childIdSchema = z.object({
  params: z.object({
    id: z.string().length(24, 'Invalid MongoDB ID'),
  }),
});
