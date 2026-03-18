const validateSchema = require('../validators/validate');
const configSchema = require('../validators/config.schema');

const envConfig = {
  PORT: Number(process.env.PORT),
  HOST: process.env.HOST,
  NODE_ENV: process.env.NODE_ENV,
};

const result = validateSchema(configSchema, envConfig);

if (!result.isValid) {
  console.log('Invalid or missing environment variables!');
  console.log(result.errors);
}

module.exports = envConfig;
