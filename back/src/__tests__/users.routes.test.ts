import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';

vi.mock('../modules/users/users.model.js', () => ({
  User: {
    findOne: vi.fn(),
    find: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock('bcryptjs', () => ({
  hash: vi.fn().mockResolvedValue('hashed_password'),
  compare: vi.fn(),
}));

import { app } from '../app.js';
import { User } from '../modules/users/users.model.js';

const mockUser = {
  _id: { toString: () => '507f1f77bcf86cd799439011' },
  name: 'John Doe',
  email: 'john@example.com',
  passwordHash: 'hashed_password',
  createdAt: new Date(),
  updatedAt: new Date(),
  toObject: function () {
    return { ...this, _id: this._id.toString() };
  },
};

const mockPublicUser = {
  _id: '507f1f77bcf86cd799439011',
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: mockUser.createdAt,
  updatedAt: mockUser.updatedAt,
};

let validToken: string;

beforeAll(async () => {
  await app.ready();
  validToken = app.jwt.sign({
    sub: '507f1f77bcf86cd799439011',
    email: 'john@example.com',
    name: 'John Doe',
  });
});

afterAll(async () => {
  await app.close();
});

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// POST /api/v1/users — Registration (public)
// ---------------------------------------------------------------------------
describe('POST /api/v1/users', () => {
  it('returns 201 with public user data on success', async () => {
    vi.mocked(User.create).mockResolvedValue(mockUser as never);

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/users',
      payload: { name: 'John Doe', email: 'john@example.com', password: 'password123' },
    });

    expect(response.statusCode).toBe(201);
    const body = response.json<{ data: Record<string, unknown> }>();
    expect(body.data).toHaveProperty('email', 'john@example.com');
    expect(body.data).not.toHaveProperty('passwordHash');
  });

  it('returns 400 when name is missing', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/users',
      payload: { email: 'john@example.com', password: 'password123' },
    });
    expect(response.statusCode).toBe(400);
  });

  it('returns 400 when password is shorter than 8 characters', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/users',
      payload: { name: 'John', email: 'john@example.com', password: 'short' },
    });
    expect(response.statusCode).toBe(400);
  });

  it('returns 409 when email is already registered', async () => {
    const duplicateError = Object.assign(new Error('duplicate'), { code: 11000 });
    vi.mocked(User.create).mockRejectedValue(duplicateError);

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/users',
      payload: { name: 'John Doe', email: 'john@example.com', password: 'password123' },
    });

    expect(response.statusCode).toBe(409);
    expect(response.json()).toMatchObject({ error: 'E-mail already registered' });
  });
});

// ---------------------------------------------------------------------------
// GET /api/v1/users/me — Authenticated user's own profile
// ---------------------------------------------------------------------------
describe('GET /api/v1/users/me', () => {
  it('returns 401 when no token is provided', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/v1/users/me' });
    expect(response.statusCode).toBe(401);
  });

  it('returns 401 when token is malformed', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/users/me',
      headers: { authorization: 'Bearer this.is.not.a.valid.token' },
    });
    expect(response.statusCode).toBe(401);
  });

  it('returns 200 with user data when token is valid', async () => {
    vi.mocked(User.findOne).mockReturnValue({
      select: () => ({ lean: () => Promise.resolve(mockPublicUser) }),
    } as never);

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/users/me',
      headers: { authorization: `Bearer ${validToken}` },
    });

    expect(response.statusCode).toBe(200);
    const body = response.json<{ data: Record<string, unknown> }>();
    expect(body.data).toHaveProperty('email', 'john@example.com');
    expect(body.data).not.toHaveProperty('passwordHash');
  });

  it('returns 404 when authenticated user no longer exists in the database', async () => {
    vi.mocked(User.findOne).mockReturnValue({
      select: () => ({ lean: () => Promise.resolve(null) }),
    } as never);

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/users/me',
      headers: { authorization: `Bearer ${validToken}` },
    });

    expect(response.statusCode).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// GET /api/v1/users — Protected list
// ---------------------------------------------------------------------------
describe('GET /api/v1/users', () => {
  it('returns 401 when no token is provided', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/v1/users' });
    expect(response.statusCode).toBe(401);
  });

  it('returns 200 with array of users when token is valid', async () => {
    vi.mocked(User.find).mockReturnValue({
      select: () => ({ sort: () => ({ lean: () => Promise.resolve([mockPublicUser]) }) }),
    } as never);

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/users',
      headers: { authorization: `Bearer ${validToken}` },
    });

    expect(response.statusCode).toBe(200);
    const body = response.json<{ data: unknown[] }>();
    expect(Array.isArray(body.data)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// GET /api/v1/users/:id — Protected single user
// ---------------------------------------------------------------------------
describe('GET /api/v1/users/:id', () => {
  it('returns 401 when no token is provided', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/users/507f1f77bcf86cd799439011',
    });
    expect(response.statusCode).toBe(401);
  });

  it('returns 400 when id format is invalid', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/users/not-a-valid-id',
      headers: { authorization: `Bearer ${validToken}` },
    });
    expect(response.statusCode).toBe(400);
  });

  it('returns 404 when user is not found', async () => {
    vi.mocked(User.findById).mockReturnValue({
      select: () => ({ lean: () => Promise.resolve(null) }),
    } as never);

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/users/507f1f77bcf86cd799439011',
      headers: { authorization: `Bearer ${validToken}` },
    });

    expect(response.statusCode).toBe(404);
  });

  it('returns 200 with user data when found', async () => {
    vi.mocked(User.findById).mockReturnValue({
      select: () => ({ lean: () => Promise.resolve(mockPublicUser) }),
    } as never);

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/users/507f1f77bcf86cd799439011',
      headers: { authorization: `Bearer ${validToken}` },
    });

    expect(response.statusCode).toBe(200);
    const body = response.json<{ data: Record<string, unknown> }>();
    expect(body.data).toHaveProperty('email', 'john@example.com');
  });
});
