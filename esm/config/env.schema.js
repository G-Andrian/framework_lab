export const envSchema = {
  type: 'object',
  required: [
  'PORT',
  'HOST',
  'NODE_ENV',
  'ADMIN_API_KEY',
  'MONGO_URL',
  'MONGO_DB_NAME',
  'MYSQL_HOST',
'MYSQL_PORT',
'MYSQL_USER',
'MYSQL_PASSWORD',
'MYSQL_DATABASE'
],
  properties: {
    MYSQL_HOST: {
  type: 'string'
},
MYSQL_PORT: {
  type: 'number'
},
MYSQL_USER: {
  type: 'string'
},
MYSQL_PASSWORD: {
  type: 'string'
},
MYSQL_DATABASE: {
  type: 'string'
},
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