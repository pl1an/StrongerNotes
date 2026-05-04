import type { FastifyReply, FastifyRequest } from 'fastify';
import { loginBodySchema } from './auth.schema.js';
import { authenticateUser } from './auth.service.js';

export async function loginController(request: FastifyRequest, reply: FastifyReply) {
  const parsed = loginBodySchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({ error: 'Validation error', details: parsed.error.format() });
  }

  const { email, password } = parsed.data;
  const user = await authenticateUser(email, password);

  if (!user) {
    return reply.status(401).send({ error: 'Invalid credentials' });
  }

  const token = await reply.jwtSign(
    { sub: user._id, email: user.email, name: user.name },
    { expiresIn: '7d' },
  );

  return reply.status(200).send({ data: { token, user } });
}
