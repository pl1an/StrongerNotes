import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { createTestApp, createTestUser, loginTestUser } from '../../test/helpers.js';

let app: FastifyInstance;
let token: string;

beforeAll(async () => {
  app = await createTestApp();
  await createTestUser(app);
  const res = await loginTestUser(app, 'test@example.com', 'password123');
  token = res.data.token;
});

afterAll(async () => {
  await app.close();
});

describe('GET /api/v1/exercises', () => {
  it('returns 401 without token', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/exercises' });
    expect(res.statusCode).toBe(401);
  });

  it('returns 200 with array when authenticated', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/exercises',
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json<{ data: unknown[] }>().data).toBeInstanceOf(Array);
  });
});

describe('POST /api/v1/exercises', () => {
  it('returns 401 without token', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/exercises',
      payload: { name: 'Cable Fly', category: 'strength', muscleGroup: 'Chest' },
    });
    expect(res.statusCode).toBe(401);
  });

  it('creates a custom exercise and returns 201', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/exercises',
      headers: { Authorization: `Bearer ${token}` },
      payload: { name: 'Cable Fly', category: 'strength', muscleGroup: 'Chest' },
    });
    expect(res.statusCode).toBe(201);
    const { data } = res.json<{ data: Record<string, unknown> }>();
    expect(data.name).toBe('Cable Fly');
    expect(data.isCustom).toBe(true);
    expect(data).toHaveProperty('_id');
  });

  it('returns 400 for missing required fields', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/exercises',
      headers: { Authorization: `Bearer ${token}` },
      payload: { name: 'Cable Fly' },
    });
    expect(res.statusCode).toBe(400);
  });

  it('returns 400 for invalid category', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/exercises',
      headers: { Authorization: `Bearer ${token}` },
      payload: { name: 'Cable Fly', category: 'yoga', muscleGroup: 'Chest' },
    });
    expect(res.statusCode).toBe(400);
  });
});
