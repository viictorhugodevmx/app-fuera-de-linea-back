import 'dotenv/config';
import { app, closeDatabase } from './app.js';

const port = Number(process.env.PORT ?? 3001);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT debe ser un número entero entre 1 y 65535.');
}

const server = app.listen(port, () => {
  console.info(`Fuera de Línea API disponible en http://localhost:${port}`);
});

let stopping = false;

async function shutdown(signal: string) {
  if (stopping) {
    return;
  }

  stopping = true;
  console.info(`Cierre iniciado: ${signal}`);

  const timeout = setTimeout(() => {
    console.error('SHUTDOWN_TIMEOUT');
    server.closeAllConnections();
    process.exit(1);
  }, 10_000);

  timeout.unref();

  try {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

    await closeDatabase();

    clearTimeout(timeout);
    console.info('Servidor HTTP y conexiones MySQL cerrados.');
    process.exitCode = 0;
  } catch {
    clearTimeout(timeout);
    console.error('SHUTDOWN_FAILED');
    process.exit(1);
  }
}

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});

process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

server.on('error', (error: NodeJS.ErrnoException) => {
  console.error('SERVER_ERROR', {
    code: error.code ?? 'UNKNOWN',
  });

  void shutdown('SERVER_ERROR');
});
