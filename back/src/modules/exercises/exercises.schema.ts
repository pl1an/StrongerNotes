import { z } from 'zod';

export const createExerciseBodySchema = z.object({
  name: z.string().trim().min(1, 'Exercise name is required'),
  category: z.enum(['strength', 'cardio'], { message: 'Category must be strength or cardio' }),
  muscleGroup: z.string().trim().min(1, 'Muscle group is required'),
}).strict();

export type CreateExerciseBody = z.infer<typeof createExerciseBodySchema>;
