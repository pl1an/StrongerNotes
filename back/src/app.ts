import fastify, { type FastifyError, type FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { env } from './env/index.js';
import { authenticate } from './middleware/authenticate.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { exercisesRoutes } from './modules/exercises/exercises.routes.js';
import { sessionsRoutes } from './modules/sessions/sessions.routes.js';
import { usersRoutes } from './modules/users/users.routes.js';
import { workoutsRoutes } from './modules/workouts/workouts.routes.js';

export function buildApp(): FastifyInstance {
  const app = fastify({
    logger: env.NODE_ENV !== 'test',
  });

  app.register(cors, {
    origin: true,
  });

  app.register(jwt, {
    secret: env.JWT_SECRET,
  });

  app.decorate('authenticate', authenticate);

  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  app.register(authRoutes, { prefix: '/api/v1/auth' });
  app.register(usersRoutes, { prefix: '/api/v1/users' });
  app.register(exercisesRoutes, { prefix: '/api/v1/exercises' });
  app.register(workoutsRoutes, { prefix: '/api/v1/workouts' });
  app.register(sessionsRoutes, { prefix: '/api/v1/sessions' });

  app.setErrorHandler((error: FastifyError, _request, reply) => {
    const status = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    reply.status(status).send({ error: message, statusCode: status });
  });

  return app;
}
