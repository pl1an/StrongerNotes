import fastify, { type FastifyError, type FastifyInstance, type FastifyReply, type FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import { env } from './env/index.js';
import { usersRoutes } from './modules/users/users.routes.js';
import { authRoutes } from './modules/auth/auth.routes.js';

export function buildApp(): FastifyInstance {
  const app = fastify({
    logger: env.NODE_ENV !== 'test',
  });

  app.register(cors, {
    origin: true,
  });

  app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
  });

  app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
  });

  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  app.register(usersRoutes, { prefix: '/api/v1/users' });
  app.register(authRoutes, { prefix: '/api/v1/auth' });

  app.setErrorHandler((error: FastifyError, _request, reply) => {
    const status = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    reply.status(status).send({ error: message, statusCode: status });
  });

  return app;
}
