import { User } from './users.model.js';
import { hash } from 'bcryptjs';
import type { CreateUserBody, UpdateUserBody } from './users.schema.js';

const PASSWORD_SALT_ROUNDS = 12;

function toPublicUser<T extends { passwordHash?: string }>(user: T) {
  const { passwordHash: _passwordHash, ...publicUser } = user;
  return publicUser;
}

export async function listUsers() {
  return User.find().select('-passwordHash').sort({ createdAt: -1 }).lean();
}

export async function createUser(payload: CreateUserBody) {
  const passwordHash = await hash(payload.password, PASSWORD_SALT_ROUNDS);
  const user = await User.create({ name: payload.name, email: payload.email, passwordHash });
  return toPublicUser(user.toObject());
}

export async function findUserById(id: string) {
  return User.findById(id).select('-passwordHash').lean();
}

export async function updateUser(id: string, payload: UpdateUserBody) {
  const updated = await User.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true },
  ).select('-passwordHash').lean();
  return updated;
}

export async function deleteUser(id: string) {
  return User.findByIdAndDelete(id).lean();
}
