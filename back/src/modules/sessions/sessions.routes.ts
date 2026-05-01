import type { FastifyPluginAsync } from 'fastify';
import {
  getSessionsController,
  createSessionController,
  getSessionByIdController,
  deleteSessionController,
  createSetController,
  updateSetController,
  deleteSetController,
} from './sessions.controller.js';

export const sessionsRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', { preHandler: [app.authenticate] }, getSessionsController);
  app.post('/', { preHandler: [app.authenticate] }, createSessionController);
  app.get('/:id', { preHandler: [app.authenticate] }, getSessionByIdController);
  app.delete('/:id', { preHandler: [app.authenticate] }, deleteSessionController);

  app.post('/:id/sets', { preHandler: [app.authenticate] }, createSetController);
  app.put('/:id/sets/:setId', { preHandler: [app.authenticate] }, updateSetController);
  app.delete('/:id/sets/:setId', { preHandler: [app.authenticate] }, deleteSetController);
};
