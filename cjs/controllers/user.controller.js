const userService = require('../services/user.service');

const getUsers = async (request, reply) => {
  const { increment } = require('../state/request-counter');
  increment();

  const users = await userService.getPublicUsers();
  return { users };
};

const getUserById = async (request, reply) => {
  const { increment } = require('../state/request-counter');
  increment();

  const { id } = request.params;
  const user = await userService.getUserFormatted(id);

  if (!user) {
    return reply.status(404).send({ error: 'User not found' });
  }

  return { user };
};

module.exports = {
  getUsers,
  getUserById
};
