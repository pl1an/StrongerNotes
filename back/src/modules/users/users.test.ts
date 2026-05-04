import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { createTestApp, createTestUser, loginTestUser } from '../../test/helpers.js';

let app: FastifyInstance;
let authToken = '';

beforeAll(async () => {
  app = await createTestApp();
});

beforeEach(async () => {
  await createTestUser(app, { name: 'Auth Helper', email: 'auth-helper@example.com', password: 'password123' });
  const { data } = await loginTestUser(app, 'auth-helper@example.com', 'password123');
  authToken = data.token;
});

afterAll(async () => {
  await app.close();
});

// ──────────────────────────────────────────────────────────────
// Phase 1 — Health & Users CRUD
// ──────────────────────────────────────────────────────────────

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    const body = res.json<{ status: string }>();
    expect(body.status).toBe('ok');
    expect(body).toHaveProperty('timestamp');
  });
});

describe('POST /api/v1/users', () => {
  it('creates a user and returns 201 without passwordHash', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/users',
      payload: { name: 'Alice', email: 'alice@example.com', password: 'strongpass1' },
    });
    expect(res.statusCode).toBe(201);
    const { data } = res.json<{ data: Record<string, unknown> }>();
    expect(data.email).toBe('alice@example.com');
    expect(data.name).toBe('Alice');
    expect(data).toHaveProperty('_id');
    expect(data.passwordHash).toBeUndefined();
  });

  it('normalises email to lowercase', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/users',
      payload: { name: 'Bob', email: 'BOB@EXAMPLE.COM', password: 'strongpass1' },
    });
    expect(res.statusCode).toBe(201);
    expect(res.json<{ data: { email: string } }>().data.email).toBe('bob@example.com');
  });

  it('returns 400 when required fields are missing', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/users',
      payload: { email: 'missing@example.com' },
    });
    expect(res.statusCode).toBe(400);
  });

  it('returns 400 for invalid email format', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/users',
      payload: { name: 'Eve', email: 'not-an-email', password: 'strongpass1' },
    });
    expect(res.statusCode).toBe(400);
  });

  it('returns 400 when password is shorter than 8 characters', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/users',
      payload: { name: 'Eve', email: 'eve@example.com', password: 'short' },
    });
    expect(res.statusCode).toBe(400);
  });

  it('returns 409 when email is already registered', async () => {
    await createTestUser(app, { name: 'Carol', email: 'carol@example.com', password: 'password123' });
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/users',
      payload: { name: 'Carol 2', email: 'carol@example.com', password: 'password123' },
    });
    expect(res.statusCode).toBe(409);
  });
});

describe('GET /api/v1/users', () => {
  it('returns 200 with an array', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/users',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json<{ data: unknown[] }>().data).toBeInstanceOf(Array);
  });

  it('lists created users without passwordHash', async () => {
    await createTestUser(app, { name: 'Dan', email: 'dan@example.com', password: 'password123' });
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/users',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const { data } = res.json<{ data: Record<string, unknown>[] }>();
    expect(data.length).toBeGreaterThan(0);
    expect(data[0].passwordHash).toBeUndefined();
  });

  it('returns 401 when no token is provided', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/v1/users' });
    expect(res.statusCode).toBe(401);
  });
});

describe('GET /api/v1/users/:id', () => {
  it('returns 200 with the user when id exists', async () => {
    const { data: created } = await createTestUser(app);
    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/users/${created._id}`,
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json<{ data: { _id: string } }>().data._id).toBe(created._id);
  });

  it('returns 404 when user does not exist', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/users/000000000000000000000001',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(res.statusCode).toBe(404);
  });

  it('returns 400 for an invalid ObjectId format', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/users/not-an-id',
      headers: { Authorization: `Bearer ${authToken}` },
    });
    expect(res.statusCode).toBe(400);
  });
});
