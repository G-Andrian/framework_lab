import userController from '../controllers/user.controller.js';
import { getStats } from '../state/request-counter.js';
import { stringify } from 'csv-stringify/sync';
import { parse } from 'csv-parse/sync';
import * as userRepository from '../repositories/user.repository.js';
import fs from 'node:fs/promises';
import path from 'node:path';

const getUserByIdSchema = {
  schema: {
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer' }
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
              id: { type: 'integer' },
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
                id: { type: 'integer' },
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
    '/users/:id',
    getUserByIdSchema,
    userController.getUserById
  );

  fastify.get(
    '/users',
    getUsersSchema,
    userController.getUsers
  );

  fastify.post(
    '/users',
    userBodySchema,
    userController.createUser
  );

  fastify.put(
    '/users/:id',
    userBodySchema,
    userController.updateUser
  );

  fastify.delete(
    '/users/:id',
    userController.deleteUser
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
