import type { FastifyPluginAsync } from 'fastify';
import { createUserController, getMeController, getUserByIdController, getUsersController } from './users.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

export const usersRoutes: FastifyPluginAsync = async (app) => {
  app.post('/', createUserController);
  app.get('/me', { preHandler: [authenticate] }, getMeController);
  app.get('/', { preHandler: [authenticate] }, getUsersController);
  app.get('/:id', { preHandler: [authenticate] }, getUserByIdController);
};
