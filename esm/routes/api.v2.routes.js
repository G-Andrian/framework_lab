import * as userRepository from '../repositories/user.repository.js';

export default async function apiV2Routes(fastify) {
  fastify.get('/items', async (request) => {
    const page =
      Number(request.query.page) || 1;

    const limit =
      Number(request.query.limit) || 10;

    const cacheKey =
      `items:${page}:${limit}`;

    const cached =
      await fastify.redis.get(
        cacheKey
      );

      fastify.log.info(
  'CACHE HIT'
);

fastify.log.info(
  'CACHE MISS'
);

    if (cached) {
      return JSON.parse(cached);
    }

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

    const result = {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages
      }
    };

    await fastify.redis.set(
      cacheKey,
      JSON.stringify(result),
      'EX',
      86400
    );

    return result;
  });
}