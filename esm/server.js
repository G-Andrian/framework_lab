import { buildApp } from './app.js';
import * as userRepository from './repositories/user.repository.js';
import { createBackup } from './utils/backup.js';
import { WebSocketServer } from 'ws';
import { itemEvents } from './events/item.events.js';

let app;

const gracefulShutdown = async (signal) => {
  try {
    app.log.info(`Received signal: ${signal}`);

    await app.close();

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

process.on('uncaughtException', (err) => {
  console.error('uncaughtException:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('unhandledRejection:', err);
});

const start = async () => {
  try {
    app = await buildApp();

    await userRepository.init();

    await createBackup();

    await app.listen({
      port: app.config.PORT,
      host: app.config.HOST
    });

    const wss =
  new WebSocketServer({
    port: 8082
  });

wss.on(
  'connection',
  ws => {
    ws.send(
      JSON.stringify({
        event: 'connected'
      })
    );
  }
);

itemEvents.on(
  'item-created',
  item => {
    wss.clients.forEach(client =>
      client.send(
        JSON.stringify({
          event: 'item-created',
          item
        })
      )
    );
  }
);

itemEvents.on(
  'item-updated',
  item => {
    wss.clients.forEach(client =>
      client.send(
        JSON.stringify({
          event: 'item-updated',
          item
        })
      )
    );
  }
);

itemEvents.on(
  'item-deleted',
  item => {
    wss.clients.forEach(client =>
      client.send(
        JSON.stringify({
          event: 'item-deleted',
          item
        })
      )
    );
  }
);

    app.log.info(
      `Server -> http://${app.config.HOST}:${app.config.PORT}`
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();