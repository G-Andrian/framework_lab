import * as userRepository from '../repositories/user.repository.js';
import { increment } from '../state/request-counter.js';
import { fetchWithRetry } from '../services/external.service.js';
// import { initPermissions } from '../services/user.service.js';

// initPermissions();

export const getUsers = async (request, reply) => {
  increment();

  const users = await userRepository.findAll();
  return { users };
};

const getUserById = async (request, reply) => {
  increment();
  const { id } = request.params;
  const user = await userRepository.findById(id);
  if (!user) {
    return reply.status(404).send({ error: 'User not found' });
  }
  return { user };
};

export const createUser = async (request, reply) => {
  increment();

  const user = await userRepository.create(request.body);

  return reply.status(201).send({ user });
};

export const updateUser = async (request, reply) => {
  increment();

  const { id } = request.params;

  const user = await userRepository.update(id, request.body);

  if (!user) {
    return reply.status(404).send({
      error: 'User not found'
    });
  }

  return { user };
};

export const deleteUser = async (request, reply) => {
  increment();

  const { id } = request.params;

  const removed = await userRepository.remove(id);

  if (!removed) {
    return reply.status(404).send({
      error: 'User not found'
    });
  }

  return {
    success: true
  };
};

export const getUserDetails = async (
  request,
  reply
) => {
  increment();

  const { id } = request.params;

  const user =
    await userRepository.findById(id);

  if (!user) {
    return reply.status(404).send({
      error: 'User not found'
    });
  }

  try {
    const response =
      await fetchWithRetry(
        'http://localhost:3001/categories'
      );

    const categories =
      await response.json();

    return {
      user,
      categories
    };
  } catch {
    return {
      user,
      categories: null
    };
  }
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserDetails
};
