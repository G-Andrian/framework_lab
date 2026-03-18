module.exports = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 2 },
    email: { type: 'string', format: 'email' },
    role: { type: 'string', enum: ['admin', 'user'] },
  },
  required: ['name', 'email', 'role'],
  additionalProperties: false,
};
