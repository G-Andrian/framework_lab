import * as userRepository from '../repositories/user.repository.js';

export default async function apiV2Routes(fastify) {
  fastify.get('/items', async (request) => {
    const page =
      Number(request.query.page) || 1;

    const limit =
      Number(request.query.limit) || 10;

    const items =
      await userRepository.findAll();

    const total = items.length;

    const totalPages =
      Math.ceil(total / limit);

    const start =
      (page - 1) * limit;

    const data =
      items.slice(
        start,
        start + limit
      );

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages
      }
    };
  });
}