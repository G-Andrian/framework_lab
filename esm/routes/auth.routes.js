import {
  findUserByEmail,
  createAuthUser
} from '../repositories/drizzle.repository.js';

import {
  hashPassword,
  verifyPassword
} from '../services/auth.service.js';

const authSchema = {
  schema: {
    body: {
      type: 'object',
      required: [
        'email',
        'password'
      ],
      properties: {
        email: {
          type: 'string'
        },
        password: {
          type: 'string'
        }
      }
    }
  }
};

export default async function authRoutes(
  fastify
){
  fastify.post(
    '/register',
    authSchema,
    async (request, reply) => {
      const {
        email,
        password
      } = request.body;

      const existingUser =
        await findUserByEmail(
          email
        );

      if (existingUser) {
        return reply
          .status(400)
          .send({
            error:
              'User already exists'
          });
      }

      const passwordHash =
        await hashPassword(
          password
        );

      const user =
        await createAuthUser({
          email,
          password:
            passwordHash
        });

      return reply
        .status(201)
        .send({
          user
        });
    }
  );

  fastify.post(
    '/login',
    authSchema,
    async (request, reply) => {
      const {
        email,
        password
      } = request.body;

      const user =
        await findUserByEmail(
          email
        );

      if (!user) {
        return reply
          .status(401)
          .send({
            error:
              'Invalid credentials'
          });
      }

      const valid =
        await verifyPassword(
          password,
          user.password
        );

      if (!valid) {
        return reply
          .status(401)
          .send({
            error:
              'Invalid credentials'
          });
      }

      request.session.user = {
        id: user.id,
        email: user.email
      };

      return {
        success: true
      };
    }
  );

  fastify.post(
    '/logout',
    authSchema,
    async (request, reply) => {
      request.session.destroy();

      return reply
        .status(204)
        .send();
    }
  );
}