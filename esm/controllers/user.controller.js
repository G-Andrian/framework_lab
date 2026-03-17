import { count } from '../state/request-counter.js';
import {
  initPermissions,
  getPublicUsers,
  getUserFormatted,
} from '../services/user.service.js';

initPermissions();

export const getUsers = async (request, reply) => {
  count++;

  const users = await getPublicUsers();
  return { users };
};

export const getUserById = async (request, reply) => {
  count++;

  const { id } = request.params;
  const user = await getUserFormatted(id);

  if (!user) {
    return reply.status(404).send({ error: 'User not found' });
  }

  return { user };
};

export default {
  getUsers,
  getUserById,
};