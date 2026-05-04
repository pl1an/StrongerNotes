import type { FastifyPluginAsync } from 'fastify';
import {
  getExercisesController,
  createExerciseController,
  getExerciseProgressController,
  getAllExercisesProgressController,
} from './exercises.controller.js';

export const exercisesRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', { preHandler: [app.authenticate] }, getExercisesController);
  app.post('/', { preHandler: [app.authenticate] }, createExerciseController);
  app.get('/progress', { preHandler: [app.authenticate] }, getAllExercisesProgressController);
  app.get('/:id/progress', { preHandler: [app.authenticate] }, getExerciseProgressController);
};
