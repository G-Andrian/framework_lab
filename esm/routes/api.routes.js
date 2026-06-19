import userController from '../controllers/user.controller.js';
import { getStats } from '../state/request-counter.js';

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

export default async function apiRoutes(fastify, options) {
  fastify.get('/users/:id', getUserByIdSchema, userController.getUserById);
  fastify.get('/users', getUsersSchema, userController.getUsers);

  fastify.get('/stats', async () => getStats());
}
