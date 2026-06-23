export const envSchema = {
  type: 'object',
  required: [
  'PORT',
  'HOST',
  'NODE_ENV',
  'ADMIN_API_KEY',
  'MONGO_URL',
  'MONGO_DB_NAME'
],
  properties: {
    MONGO_URL: {
  type: 'string'
},
MONGO_DB_NAME: {
  type: 'string'
},
    PORT: {
      type: 'number',
      default: 8081
    },
    HOST: {
      type: 'string',
      default: '0.0.0.0'
    },
    NODE_ENV: {
      type: 'string',
      enum: ['development', 'production', 'test']
    },
    ADMIN_API_KEY: {
      type: 'string'
    }
  }
};