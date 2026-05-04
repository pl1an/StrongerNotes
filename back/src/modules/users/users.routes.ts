import type { FastifyPluginAsync } from 'fastify';
import {
  createUserController,
  deleteUserController,
  getMeController,
  getUserByIdController,
  getUsersController,
  updateUserController,
} from './users.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

export const usersRoutes: FastifyPluginAsync = async (app) => {
  app.post('/', createUserController);
  app.get('/me', { preHandler: [authenticate] }, getMeController);
  app.get('/', { preHandler: [authenticate] }, getUsersController);
  app.get('/:id', { preHandler: [authenticate] }, getUserByIdController);
  app.put('/:id', { preHandler: [authenticate] }, updateUserController);
  app.delete('/:id', { preHandler: [authenticate] }, deleteUserController);
};
