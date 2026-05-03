import { z } from 'zod';

const objectIdRegex = /^[a-f\d]{24}$/i;

export const createWorkoutBodySchema = z.object({
  name: z.string().trim().min(1, 'Workout name is required'),
  exercises: z.array(z.string().regex(objectIdRegex, 'Invalid exercise ID')).default([]),
}).strict();

export const updateWorkoutBodySchema = z.object({
  name: z.string().trim().min(1, 'Workout name is required').optional(),
  exercises: z.array(z.string().regex(objectIdRegex, 'Invalid exercise ID')).optional(),
}).strict().refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});

export const workoutIdParamsSchema = z.object({
  id: z.string().regex(objectIdRegex, 'Invalid ObjectId'),
}).strict();

export type CreateWorkoutBody = z.infer<typeof createWorkoutBodySchema>;
export type UpdateWorkoutBody = z.infer<typeof updateWorkoutBodySchema>;
export type WorkoutIdParams = z.infer<typeof workoutIdParamsSchema>;
