import Fastify from 'fastify';

import fastifyEnv from '@fastify/env';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import sensible from '@fastify/sensible';

import apiRoutes from './routes/api.routes.js';
import { envSchema } from './config/env.schema.js';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level:
        process.env.NODE_ENV === 'production'
          ? 'error'
          : 'info',

      transport:
        process.env.NODE_ENV !== 'production'
          ? {
              target: 'pino-pretty'
            }
          : undefined
    }
  });

  await app.register(fastifyEnv, {
    schema: envSchema,
    dotenv: true
  });

  await app.register(helmet, {
    global: true
  });

  await app.register(cors, {
    origin:
      app.config.NODE_ENV === 'production'
        ? 'https://example.com'
        : '*',

    methods: ['GET']
  });

  await app.register(sensible);

  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    reply.status(error.statusCode || 500).send({
      error: error.message
    });
  });

  app.get('/health', async () => ({
    status: 'ok'
  }));

  app.get('/health/details', {
  onRequest: async (request, reply) => {
    if (
      request.headers['x-api-key'] !==
      app.config.ADMIN_API_KEY
    ) {
      throw reply.unauthorized('Invalid API key');
    }
  }
}, async () => ({
  pid: process.pid,
  nodeVersion: process.version,
  platform: process.platform,
  uptime: process.uptime(),
  memoryUsage: process.memoryUsage()
}));

  await app.register(apiRoutes, {
    prefix: '/api'
  });

  app.addHook('onClose', async instance => {
    instance.log.info('Server closed');
  });

  return app;
}