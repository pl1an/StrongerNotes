import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { createTestApp, createTestUser, loginTestUser } from '../../test/helpers.js';

let app: FastifyInstance;

beforeAll(async () => {
  app = await createTestApp();
});

afterAll(async () => {
  await app.close();
});

// ──────────────────────────────────────────────────────────────
// Phase 2 — Auth, profile edit and account deletion
// ──────────────────────────────────────────────────────────────

describe('POST /api/v1/auth/login', () => {
  it('returns 200 with a JWT token on valid credentials', async () => {
    await createTestUser(app, { name: 'Alice', email: 'alice@example.com', password: 'password123' });
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email: 'alice@example.com', password: 'password123' },
    });
    expect(res.statusCode).toBe(200);
    const { data } = res.json<{ data: { token: string; user: { email: string } } }>();
    expect(typeof data.token).toBe('string');
    expect(data.token.length).toBeGreaterThan(0);
    expect(data.user.email).toBe('alice@example.com');
  });

  it('returns 401 on wrong password', async () => {
    await createTestUser(app, { name: 'Bob', email: 'bob@example.com', password: 'correctpass' });
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email: 'bob@example.com', password: 'wrongpass' },
    });
    expect(res.statusCode).toBe(401);
  });

  it('returns 401 when email does not exist', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email: 'ghost@example.com', password: 'password123' },
    });
    expect(res.statusCode).toBe(401);
  });

  it('returns 400 when payload is missing required fields', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email: 'alice@example.com' },
    });
    expect(res.statusCode).toBe(400);
  });
});

describe('PUT /api/v1/users/:id', () => {
  it('updates the user name and returns the updated data', async () => {
    const { data: user } = await createTestUser(app, { name: 'Carol', email: 'carol@example.com', password: 'password123' });
    const { data: auth } = await loginTestUser(app, 'carol@example.com', 'password123');

    const res = await app.inject({
      method: 'PUT',
      url: `/api/v1/users/${user._id}`,
      headers: { Authorization: `Bearer ${auth.token}` },
      payload: { name: 'Carol Updated' },
    });
    expect(res.statusCode).toBe(200);
    const { data } = res.json<{ data: { name: string } }>();
    expect(data.name).toBe('Carol Updated');
  });

  it('updates the user email', async () => {
    const { data: user } = await createTestUser(app, { name: 'Dan', email: 'dan@example.com', password: 'password123' });
    const { data: auth } = await loginTestUser(app, 'dan@example.com', 'password123');

    const res = await app.inject({
      method: 'PUT',
      url: `/api/v1/users/${user._id}`,
      headers: { Authorization: `Bearer ${auth.token}` },
      payload: { email: 'dan.new@example.com' },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json<{ data: { email: string } }>().data.email).toBe('dan.new@example.com');
  });

  it('returns 401 when no token is provided', async () => {
    const { data: user } = await createTestUser(app);
    const res = await app.inject({
      method: 'PUT',
      url: `/api/v1/users/${user._id}`,
      payload: { name: 'Hacker' },
    });
    expect(res.statusCode).toBe(401);
  });

  it('returns 403 when trying to edit another user\'s profile', async () => {
    const { data: user1 } = await createTestUser(app, { name: 'Eve', email: 'eve@example.com', password: 'password123' });
    await createTestUser(app, { name: 'Frank', email: 'frank@example.com', password: 'password123' });
    const { data: frankAuth } = await loginTestUser(app, 'frank@example.com', 'password123');

    const res = await app.inject({
      method: 'PUT',
      url: `/api/v1/users/${user1._id}`,
      headers: { Authorization: `Bearer ${frankAuth.token}` },
      payload: { name: 'Hacker' },
    });
    expect(res.statusCode).toBe(403);
  });

  it('returns 409 when new email is already taken', async () => {
    const { data: user1 } = await createTestUser(app, { name: 'Grace', email: 'grace@example.com', password: 'password123' });
    await createTestUser(app, { name: 'Heidi', email: 'heidi@example.com', password: 'password123' });
    const { data: auth } = await loginTestUser(app, 'grace@example.com', 'password123');

    const res = await app.inject({
      method: 'PUT',
      url: `/api/v1/users/${user1._id}`,
      headers: { Authorization: `Bearer ${auth.token}` },
      payload: { email: 'heidi@example.com' },
    });
    expect(res.statusCode).toBe(409);
  });

  it('returns 400 when body is empty', async () => {
    const { data: user } = await createTestUser(app, { name: 'Ivan', email: 'ivan@example.com', password: 'password123' });
    const { data: auth } = await loginTestUser(app, 'ivan@example.com', 'password123');

    const res = await app.inject({
      method: 'PUT',
      url: `/api/v1/users/${user._id}`,
      headers: { Authorization: `Bearer ${auth.token}` },
      payload: {},
    });
    expect(res.statusCode).toBe(400);
  });
});

describe('DELETE /api/v1/users/:id', () => {
  it('deletes the authenticated user and returns 204', async () => {
    const { data: user } = await createTestUser(app, { name: 'Judy', email: 'judy@example.com', password: 'password123' });
    const { data: auth } = await loginTestUser(app, 'judy@example.com', 'password123');

    const res = await app.inject({
      method: 'DELETE',
      url: `/api/v1/users/${user._id}`,
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    expect(res.statusCode).toBe(204);

    await createTestUser(app, { name: 'Witness', email: 'witness@example.com', password: 'password123' });
    const { data: witnessAuth } = await loginTestUser(app, 'witness@example.com', 'password123');
    const check = await app.inject({
      method: 'GET',
      url: `/api/v1/users/${user._id}`,
      headers: { Authorization: `Bearer ${witnessAuth.token}` },
    });
    expect(check.statusCode).toBe(404);
  });

  it('returns 401 when no token is provided', async () => {
    const { data: user } = await createTestUser(app);
    const res = await app.inject({ method: 'DELETE', url: `/api/v1/users/${user._id}` });
    expect(res.statusCode).toBe(401);
  });

  it('returns 403 when trying to delete another user', async () => {
    const { data: target } = await createTestUser(app, { name: 'Karl', email: 'karl@example.com', password: 'password123' });
    await createTestUser(app, { name: 'Leo', email: 'leo@example.com', password: 'password123' });
    const { data: leoAuth } = await loginTestUser(app, 'leo@example.com', 'password123');

    const res = await app.inject({
      method: 'DELETE',
      url: `/api/v1/users/${target._id}`,
      headers: { Authorization: `Bearer ${leoAuth.token}` },
    });
    expect(res.statusCode).toBe(403);
  });
});
