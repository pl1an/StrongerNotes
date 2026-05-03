import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../modules/users/users.model.js', () => ({
  User: {
    findOne: vi.fn(),
  },
}));

vi.mock('bcryptjs', () => ({
  compare: vi.fn(),
  hash: vi.fn(),
}));

import { validateCredentials } from '../modules/auth/auth.service.js';
import { User } from '../modules/users/users.model.js';
import { compare } from 'bcryptjs';

const mockUser = {
  _id: '507f1f77bcf86cd799439011',
  name: 'John Doe',
  email: 'john@example.com',
  passwordHash: 'hashed_password',
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('validateCredentials', () => {
  it('returns public user when credentials are valid', async () => {
    vi.mocked(User.findOne).mockReturnValue({ lean: () => Promise.resolve(mockUser) } as never);
    vi.mocked(compare).mockResolvedValue(true as never);

    const result = await validateCredentials('john@example.com', 'password123');

    expect(result).not.toBeNull();
    expect(result).not.toHaveProperty('passwordHash');
    expect(result).toMatchObject({ email: 'john@example.com', name: 'John Doe' });
  });

  it('returns null when user is not found', async () => {
    vi.mocked(User.findOne).mockReturnValue({ lean: () => Promise.resolve(null) } as never);

    const result = await validateCredentials('nobody@example.com', 'password123');

    expect(result).toBeNull();
    expect(compare).not.toHaveBeenCalled();
  });

  it('returns null when password does not match', async () => {
    vi.mocked(User.findOne).mockReturnValue({ lean: () => Promise.resolve(mockUser) } as never);
    vi.mocked(compare).mockResolvedValue(false as never);

    const result = await validateCredentials('john@example.com', 'wrong_password');

    expect(result).toBeNull();
  });
});
