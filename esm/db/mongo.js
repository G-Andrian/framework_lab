import fp from 'fastify-plugin';
import mongoose from 'mongoose';

async function mongoPlugin(fastify) {
  try {
    await mongoose.connect(
      fastify.config.MONGO_URL,
      {
        dbName:
          fastify.config.MONGO_DB_NAME
      }
    );

    fastify.log.info(
      'MongoDB connected'
    );

    fastify.decorate(
      'mongoose',
      mongoose
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  fastify.addHook(
    'onClose',
    async () => {
      await mongoose.connection.close();
    }
  );
}

export default fp(mongoPlugin);