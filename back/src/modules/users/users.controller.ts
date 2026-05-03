import type { FastifyReply, FastifyRequest } from 'fastify';
import { createUserBodySchema, updateUserBodySchema, userIdParamsSchema } from './users.schema.js';
import { createUser, deleteUser, findUserByEmail, findUserById, listUsers, updateUser } from './users.service.js';

export async function getUsersController(_request: FastifyRequest, reply: FastifyReply) {
  const users = await listUsers();
  return reply.status(200).send({ data: users });
}

export async function createUserController(request: FastifyRequest, reply: FastifyReply) {
  const parsed = createUserBodySchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({ error: 'Validation error', details: parsed.error.format() });
  }

  try {
    const createdUser = await createUser(parsed.data);
    return reply.status(201).send({ data: createdUser });
  } catch (error: any) {
    if ((error as { code?: number }).code === 11000) {
      return reply.status(409).send({ error: 'E-mail already registered' });
    }
    throw error;
  }
}

// returns the authenticated user's own profile
export async function getMeController(request: FastifyRequest, reply: FastifyReply) {
  const user = await findUserByEmail(request.user.email);

  if (!user) {
    return reply.status(404).send({ error: 'User not found' });
  }

  return reply.status(200).send({ data: user });
}

// validates id and returns a single user
export async function getUserByIdController(request: FastifyRequest, reply: FastifyReply) {
  const parsed = userIdParamsSchema.safeParse(request.params);
  if (!parsed.success) {
    return reply.status(400).send({ error: 'Validation error', details: parsed.error.format() });
  }

  const user = await findUserById(parsed.data.id);
  if (!user) return reply.status(404).send({ error: 'User not found' });

  return reply.status(200).send({ data: user });
}

export async function updateUserController(request: FastifyRequest, reply: FastifyReply) {
  const parsedParams = userIdParamsSchema.safeParse(request.params);
  if (!parsedParams.success) {
    return reply.status(400).send({ error: 'Validation error', details: parsedParams.error.format() });
  }

  const parsedBody = updateUserBodySchema.safeParse(request.body);
  if (!parsedBody.success) {
    return reply.status(400).send({ error: 'Validation error', details: parsedBody.error.format() });
  }

  const { id } = parsedParams.data;
  const requestingUserId = request.user.sub;

  if (id !== requestingUserId) {
    return reply.status(403).send({ error: 'Forbidden' });
  }

  try {
    const updated = await updateUser(id, parsedBody.data);
    if (!updated) return reply.status(404).send({ error: 'User not found' });

    return reply.status(200).send({ data: updated });
  } catch (error) {
    if ((error as { code?: number }).code === 11000) {
      return reply.status(409).send({ error: 'E-mail already registered' });
    }
    throw error;
  }
}

export async function deleteUserController(request: FastifyRequest, reply: FastifyReply) {
  const parsed = userIdParamsSchema.safeParse(request.params);
  if (!parsed.success) {
    return reply.status(400).send({ error: 'Validation error', details: parsed.error.format() });
  }

  const { id } = parsed.data;
  const requestingUserId = request.user.sub;

  if (id !== requestingUserId) {
    return reply.status(403).send({ error: 'Forbidden' });
  }

  const deleted = await deleteUser(id);
  if (!deleted) return reply.status(404).send({ error: 'User not found' });

  return reply.status(204).send();
}
