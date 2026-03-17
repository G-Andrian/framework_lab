const userRepository = require('../repositories/user.repository');
const formatter = require('../utils/formatter.js');
const rolesMap = require('../data/roles.json');

const getPublicUsers = async () => {
  const users = await userRepository.findAll();

  return users.map((u) => ({
    id: u.id,
    name: formatter.formatName(u.name),
    roleName: rolesMap[u.id] || 'Unknown'
  }));
};

const getUserFormatted = async (id) => {
  const user = await userRepository.findById(id);

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: formatter.formatName(user.name),
    roleName: rolesMap[user.id] || user.role || 'Unknown'
  };
};

module.exports = {
  getPublicUsers,
  getUserFormatted
};