import config from '../../config/env.js';

async function errorHandler(app) {
  app.setErrorHandler(async (error, request, reply) => {
    request.log.error(error);

    return reply.status(500).send({
      message:
        config.nodeEnv === 'development'
          ? error.message
          : 'Internal Server Error',
    });
  });
}

export default errorHandler;