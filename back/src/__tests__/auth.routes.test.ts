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
  compare: vi.fn(),
  hash: vi.fn(),
}));

import { app } from '../app.js';
import { User } from '../modules/users/users.model.js';
import { compare } from 'bcryptjs';

const mockUser = {
  _id: '507f1f77bcf86cd799439011',
  name: 'John Doe',
  email: 'john@example.com',
  passwordHash: 'hashed_password',
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('POST /api/v1/auth/login', () => {
  it('returns 200 with token and user on valid credentials', async () => {
    vi.mocked(User.findOne).mockReturnValue({ lean: () => Promise.resolve(mockUser) } as never);
    vi.mocked(compare).mockResolvedValue(true as never);

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email: 'john@example.com', password: 'password123' },
    });

    expect(response.statusCode).toBe(200);
    const body = response.json<{ data: { token: string; user: { id: string; email: string; name: string } } }>();
    expect(body.data).toHaveProperty('token');
    expect(typeof body.data.token).toBe('string');
    expect(body.data.user).toMatchObject({
      email: 'john@example.com',
      name: 'John Doe',
    });
    expect(body.data.user).not.toHaveProperty('passwordHash');
  });

  it('returns 401 when password is wrong', async () => {
    vi.mocked(User.findOne).mockReturnValue({ lean: () => Promise.resolve(mockUser) } as never);
    vi.mocked(compare).mockResolvedValue(false as never);

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email: 'john@example.com', password: 'wrong_pass' },
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toMatchObject({ error: 'Invalid email or password' });
  });

  it('returns 401 when user does not exist — same message as wrong password', async () => {
    vi.mocked(User.findOne).mockReturnValue({ lean: () => Promise.resolve(null) } as never);

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email: 'ghost@example.com', password: 'password123' },
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toMatchObject({ error: 'Invalid email or password' });
  });

  it('returns 400 when email is missing', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { password: 'password123' },
    });

    expect(response.statusCode).toBe(400);
  });

  it('returns 400 when email format is invalid', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email: 'not-an-email', password: 'password123' },
    });

    expect(response.statusCode).toBe(400);
  });

  it('returns 400 when password is missing', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email: 'john@example.com' },
    });

    expect(response.statusCode).toBe(400);
  });

  it('returns 400 when payload contains unknown fields', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email: 'john@example.com', password: 'password123', extra: 'field' },
    });

    expect(response.statusCode).toBe(400);
  });
});
