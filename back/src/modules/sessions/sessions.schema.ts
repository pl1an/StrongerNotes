import { z } from 'zod';

const objectIdRegex = /^[a-f\d]{24}$/i;

export const createSessionBodySchema = z.object({
  workoutId: z.string().regex(objectIdRegex, 'Invalid workout ID'),
  date: z.string().datetime().optional(),
  notes: z.string().trim().max(500).nullable().optional(),
}).strict();

export const sessionIdParamsSchema = z.object({
  id: z.string().regex(objectIdRegex, 'Invalid ObjectId'),
}).strict();

export const createSetBodySchema = z.object({
  exerciseId: z.string().regex(objectIdRegex, 'Invalid exercise ID'),
  order: z.number().int().min(0).default(0),
  reps: z.number().int().positive().nullable().optional(),
  weightKg: z.number().positive().nullable().optional(),
  durationSecs: z.number().int().positive().nullable().optional(),
  restSecs: z.number().int().positive().nullable().optional(),
  notes: z.string().trim().max(200).nullable().optional(),
}).strict();

export const updateSetBodySchema = z.object({
  order: z.number().int().min(0).optional(),
  reps: z.number().int().positive().nullable().optional(),
  weightKg: z.number().positive().nullable().optional(),
  durationSecs: z.number().int().positive().nullable().optional(),
  restSecs: z.number().int().positive().nullable().optional(),
  notes: z.string().trim().max(200).nullable().optional(),
}).strict().refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});

export const setIdParamsSchema = z.object({
  id: z.string().regex(objectIdRegex, 'Invalid ObjectId'),
  setId: z.string().regex(objectIdRegex, 'Invalid ObjectId'),
}).strict();

export type CreateSessionBody = z.infer<typeof createSessionBodySchema>;
export type SessionIdParams = z.infer<typeof sessionIdParamsSchema>;
export type CreateSetBody = z.infer<typeof createSetBodySchema>;
export type UpdateSetBody = z.infer<typeof updateSetBodySchema>;
export type SetIdParams = z.infer<typeof setIdParamsSchema>;
