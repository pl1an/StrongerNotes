import type { FastifyPluginAsync } from 'fastify';
import {
  createUserController,
  deleteUserController,
  getUserByIdController,
  getUsersController,
  updateUserController,
} from './users.controller.js';

export const usersRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', getUsersController);
  app.post('/', createUserController);
  app.get('/:id', getUserByIdController);
  app.put('/:id', { preHandler: [app.authenticate] }, updateUserController);
  app.delete('/:id', { preHandler: [app.authenticate] }, deleteUserController);
};
