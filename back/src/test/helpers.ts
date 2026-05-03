import { buildApp } from '../app.js';
import type { FastifyInstance } from 'fastify';

export async function createTestApp(): Promise<FastifyInstance> {
  const app = buildApp();
  await app.ready();
  return app;
}

export interface UserPayload {
  name: string;
  email: string;
  password: string;
}

export async function createTestUser(app: FastifyInstance, payload: UserPayload = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
}) {
  const res = await app.inject({
    method: 'POST',
    url: '/api/v1/users',
    payload,
  });
  return res.json<{ data: { _id: string; name: string; email: string } }>();
}

export async function loginTestUser(app: FastifyInstance, email: string, password: string) {
  const res = await app.inject({
    method: 'POST',
    url: '/api/v1/auth/login',
    payload: { email, password },
  });
  return res.json<{ data: { token: string; user: { _id: string; name: string; email: string } } }>();
}
