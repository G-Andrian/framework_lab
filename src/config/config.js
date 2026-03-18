import 'dotenv/config';

const processEnv = process.env;

const config = {
  PORT: parseInt(processEnv.PORT, 10),
  HOSTNAME: processEnv.HOSTNAME,
  NODE_ENV: processEnv.NODE_ENV,
};

if (!config.PORT || isNaN(config.PORT)) {
  console.error(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message: 'PORT is missing or invalid',
    })
  );
  process.exit(1);
}

if (!config.HOSTNAME) {
  console.error(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message: 'HOSTNAME is missing',
    })
  );
  process.exit(1);
}

if (!['development', 'production'].includes(config.NODE_ENV)) {
  console.error(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message: "NODE_ENV must be 'development' or 'production'",
    })
  );
  process.exit(1);
}

export default config;
