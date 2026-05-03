import type { FastifyPluginAsync } from 'fastify';
import {
  createWorkoutController,
  deleteWorkoutController,
  getWorkoutByIdController,
  getWorkoutsController,
  updateWorkoutController,
} from './workouts.controller.js';

export const workoutsRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', { preHandler: [app.authenticate] }, getWorkoutsController);
  app.post('/', { preHandler: [app.authenticate] }, createWorkoutController);
  app.get('/:id', { preHandler: [app.authenticate] }, getWorkoutByIdController);
  app.put('/:id', { preHandler: [app.authenticate] }, updateWorkoutController);
  app.delete('/:id', { preHandler: [app.authenticate] }, deleteWorkoutController);
};
