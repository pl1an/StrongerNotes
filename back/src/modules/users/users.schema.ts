import { z } from 'zod';

export const createUserBodySchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email().toLowerCase(),
  password: z.string().min(8),
}).strict();

export const updateUserBodySchema = z.object({
  name: z.string().trim().min(1).optional(),
  email: z.string().trim().email().toLowerCase().optional(),
}).strict().refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});

export const userIdParamsSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid ObjectId'),
}).strict();

export type CreateUserBody = z.infer<typeof createUserBodySchema>;
export type UpdateUserBody = z.infer<typeof updateUserBodySchema>;
export type UserIdParams = z.infer<typeof userIdParamsSchema>;
