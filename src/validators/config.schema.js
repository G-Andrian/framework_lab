module.exports = {
  type: 'object',
  properties: {
    PORT: { type: 'integer', minimum: 1, maximum: 65535 },
    HOST: { type: 'string', minLength: 1 },
    NODE_ENV: {
      type: 'string',
      enum: ['development', 'production', 'test'],
    },
  },
  required: ['PORT', 'HOST', 'NODE_ENV'],
  additionalProperties: false,
};
