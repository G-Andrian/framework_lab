import Fastify from 'fastify';

import fastifyEnv from '@fastify/env';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import sensible from '@fastify/sensible';
import multipart from '@fastify/multipart';

import apiRoutes from './routes/api.routes.js';
import { envSchema } from './config/env.schema.js';

import fastifyStatic from '@fastify/static';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import apiV2Routes from './routes/api.v2.routes.js';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';

import mongoPlugin from './db/mongo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  await app.register(
  mongoPlugin
);

  await app.register(swagger, {
  openapi: {
    info: {
      title: 'Inventory API',
      description: 'Lab 6 API Documentation',
      version: '1.0.0'
    }
  }
});

await app.register(swaggerUI, {
  routePrefix: '/docs'
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

  await app.register(rateLimit, {
  max: 5,
  timeWindow: '1 minute'
});

  await app.register(multipart, {
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

await app.register(fastifyStatic, {
  root: path.join(__dirname, 'data/images'),
  prefix: '/images/'
});

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
  prefix: '/api/v1'
});

await app.register(apiV2Routes, {
  prefix: '/api/v2'
});

  app.addHook('onClose', async instance => {
    instance.log.info('Server closed');
  });

await app.ready();

  return app;
}