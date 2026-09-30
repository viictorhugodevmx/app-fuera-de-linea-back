import cors from 'cors';
import express from 'express';
import { getAllowedOrigins } from './config/cors.js';
import type { DatabaseTarget } from './config/database.js';
import { getSessionConfig } from './config/session.js';
import { createDatabasePool } from './db/pool.js';
import { apiErrorHandler } from './middleware/api-error.js';
import { createRegistrationLimiter } from './middleware/registration-limit.js';
import { createRegistrationService } from './services/registration.js';
import { createSessionService } from './services/registration-session.js';

export function createApp(
  databaseTarget: DatabaseTarget = 'app',
  now: () => number = Date.now,
  requestLimit = 30,
) {
  const app = express();
  const allowedOrigins = getAllowedOrigins();
  const sessionConfig = getSessionConfig();
  const pool = createDatabasePool(databaseTarget);

  const sessionService = createSessionService(sessionConfig, now);
  const registrationService = createRegistrationService(pool, sessionConfig);

  app.disable('x-powered-by');

  app.use((request, response, next) => {
    response.locals.receivedAt = now();

    const origin = request.get('Origin');

    if (origin && !allowedOrigins.includes(origin)) {
      response.status(403).json({
        error: {
          code: 'ORIGIN_NOT_ALLOWED',
          message: 'El origen de la solicitud no está permitido.',
        },
      });
      return;
    }

    next();
  });

  app.use(
    cors({
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type'],
      credentials: false,
      maxAge: 600,
    }),
  );

  app.use(
    ['/api/registration-sessions', '/api/registrations'],
    createRegistrationLimiter(requestLimit),
  );

  app.use(express.json({ limit: '16kb' }));

  app.get('/api/health', (_request, response) => {
    response.status(200).json({
      status: 'ok',
      service: 'fuera-de-linea-api',
    });
  });

  app.post('/api/registration-sessions', (_request, response) => {
    response.set('Cache-Control', 'no-store');

    response.status(201).json({
      data: sessionService.issue(),
    });
  });

  app.post('/api/registrations', async (request, response) => {
    response.set('Cache-Control', 'no-store');

    const result = await registrationService.register(
      request.body,
      response.locals.receivedAt,
    );

    response.status(201).json({
      data: result,
    });
  });

  app.use(apiErrorHandler);

  return {
    app,
    closeDatabase: () => pool.end(),
  };
}

export const { app, closeDatabase } = createApp();
