import http from 'node:http';
import config from '../config/config.js';

const server = http.createServer((req, res) => {
  const logData = {
    timestamp: new Date().toISOString(),
    level: 'INFO',
    method: req.method,
    url: req.url,
  };

  if (req.method === 'GET' && req.url === '/health') {
    const healthInfo = {
      pid: process.pid,
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(healthInfo));

    if (config.NODE_ENV === 'development') {
      console.log(JSON.stringify({ ...logData, status: 200 }));
    }

    return;
  }

  if (config.NODE_ENV === 'development') {
    console.log(JSON.stringify({ ...logData, status: 404 }));
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

function gracefulShutdown(signal) {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message: `Received ${signal}. Shutting down gracefully...`,
    })
  );

  const shutdownTimeout = setTimeout(() => {
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'ERROR',
        message: 'Server did not close in time, forcing shutdown',
      })
    );
    process.exit(1);
  }, 10000);

  server.close((err) => {
    clearTimeout(shutdownTimeout);

    if (err) {
      console.error(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level: 'ERROR',
          message: `Error during server shutdown: ${err.message}`,
        })
      );
      process.exit(1);
    } else {
      console.log(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          level: 'INFO',
          message: 'Server closed successfully',
        })
      );
      process.exit(0);
    }
  });
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

process.on('uncaughtException', (err) => {
  console.error(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message: `Uncaught Exception: ${err.message}`,
    })
  );
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason) => {
  console.error(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      message: `Unhandled Rejection: ${reason}`,
    })
  );
  gracefulShutdown('unhandledRejection');
});

server.listen(config.PORT, config.HOSTNAME, () => {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'INFO',
      message: `Server running at http://${config.HOSTNAME}:${config.PORT}/`,
    })
  );
});
