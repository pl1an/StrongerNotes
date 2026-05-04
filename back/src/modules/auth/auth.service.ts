import { compare } from 'bcryptjs';
import { User } from '../users/users.model.js';

export async function authenticateUser(email: string, password: string) {
  const user = await User.findOne({ email }).lean();
  if (!user) return null;

  const passwordMatches = await compare(password, user.passwordHash);
  if (!passwordMatches) return null;

  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}
