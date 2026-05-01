import type { FastifyReply, FastifyRequest } from 'fastify';
import { createExerciseBodySchema } from './exercises.schema.js';
import { listExercises, createExercise } from './exercises.service.js';

export async function getExercisesController(request: FastifyRequest, reply: FastifyReply) {
  const exercises = await listExercises(request.user.sub);
  return reply.status(200).send({ data: exercises });
}

export async function createExerciseController(request: FastifyRequest, reply: FastifyReply) {
  const parsed = createExerciseBodySchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({ error: 'Validation error', details: parsed.error.format() });
  }

  const exercise = await createExercise(parsed.data, request.user.sub);
  return reply.status(201).send({ data: exercise });
}
