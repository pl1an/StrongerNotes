import type { FastifyPluginAsync } from 'fastify';
import {
  getExercisesController,
  createExerciseController,
  getExerciseProgressController,
} from './exercises.controller.js';

export const exercisesRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', { preHandler: [app.authenticate] }, getExercisesController);
  app.post('/', { preHandler: [app.authenticate] }, createExerciseController);
  app.get('/:id/progress', { preHandler: [app.authenticate] }, getExerciseProgressController);
};
