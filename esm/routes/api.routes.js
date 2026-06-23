import userController from '../controllers/user.controller.js';
import { getStats } from '../state/request-counter.js';
import { stringify } from 'csv-stringify/sync';
import { parse } from 'csv-parse/sync';
import * as userRepository from '../repositories/user.repository.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { requireJwt } from '../middlewares/jwt.middleware.js';

const clearItemsCache = async (fastify) => {
  const keys =
    await fastify.redis.keys('items:*');

  if (keys.length) {
    await fastify.redis.del(keys);
  }
};

const getUserByIdSchema = {
  schema: {
    params: {
      type: 'object',
      properties: {
        id: { type: 'string' }
      },
      required: ['id']
    },

    response: {
      200: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              role: { type: 'string' }
            }
          }
        }
      }
    }
  }
};

const getUsersSchema = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          users: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                role: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }
};

const userBodySchema = {
  schema: {
    body: {
      type: 'object',
      required: ['name', 'role'],
      properties: {
        name: { type: 'string' },
        role: { type: 'string' },
        category: { type: 'string' }
      }
    }
  }
};

export default async function apiRoutes(fastify, options) {

  fastify.get(
  '/users/stream',
  userController.streamUsers
);

  fastify.get(
    '/users/:id',
    getUserByIdSchema,
    userController.getUserById
  );

  fastify.get(
  '/users/:id/details',
  userController.getUserDetails
);

  fastify.get(
    '/users',
    getUsersSchema,
    userController.getUsers
  );

  fastify.post(
  '/users',
  {
    ...userBodySchema,
    onRequest: [requireJwt]
  },
  async (request, reply) => {
    const result =
      await userController.createUser(
        request,
        reply
      );

    await clearItemsCache(fastify);

    return result;
  }
);

  fastify.put(
  '/users/:id',
  {
    ...userBodySchema,
    onRequest: [requireJwt]
  },
  async (request, reply) => {
    const result =
      await userController.updateUser(
        request,
        reply
      );

    await clearItemsCache(fastify);

    return result;
  }
);

  fastify.delete(
  '/users/:id',
  {
    onRequest: [requireJwt]
  },
  async (request, reply) => {
    const result =
      await userController.deleteUser(
        request,
        reply
      );

    await clearItemsCache(fastify);

    return result;
  }
);

fastify.get('/users/export', async (request, reply) => {
  const users = await userController.getUsers();

  const csv = stringify(
    users.users,
    {
      header: true
    }
  );

  reply
    .header(
      'Content-Disposition',
      'attachment; filename="users.csv"'
    )
    .type('text/csv');

  return csv;
});

fastify.post('/users/import', async (request, reply) => {
  const data = await request.file();

  const buffer = await data.toBuffer();

  let records = [];

  if (
    data.mimetype === 'application/json' ||
    data.filename.endsWith('.json')
  ) {
    records = JSON.parse(buffer.toString());
  } else if (
    data.mimetype === 'text/csv' ||
    data.filename.endsWith('.csv')
  ) {
    records = parse(buffer.toString(), {
      columns: true,
      skip_empty_lines: true
    });
  } else {
    return reply.badRequest(
      'Only CSV and JSON supported'
    );
  }

  let imported = 0;

  const rejected = [];

  for (let i = 0; i < records.length; i++) {
    const item = records[i];

    if (!item.name || !item.role) {
      rejected.push({
        row: i + 1,
        reason: 'Missing required fields'
      });

      continue;
    }

    await userRepository.create({
      name: item.name,
      role: item.role,
      category: item.category || ''
    });

    imported++;
  }

  return {
    imported,
    rejected
  };
});

fastify.post('/users/:id/image', async (request, reply) => {
  const { id } = request.params;

  const file = await request.file();

  if (!file) {
    return reply.badRequest('File required');
  }

  const imageName =
    `${id}-${Date.now()}-${file.filename}`;

  const imagePath = path.join(
    process.cwd(),
    'data',
    'images',
    imageName
  );

  await fs.writeFile(
    imagePath,
    await file.toBuffer()
  );

  const user =
    await userRepository.setImage(
      id,
      `/images/${imageName}`
    );

  return { user };
});
  fastify.get('/stats', async () => getStats());
}
