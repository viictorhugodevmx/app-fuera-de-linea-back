import cors from 'cors';
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { getAllowedOrigins } from './config/cors.js';
import type { DatabaseTarget } from './config/database.js';
import { getSessionConfig } from './config/session.js';
import { createDatabasePool } from './db/pool.js';
import {
  createRegistrationService,
  EmailAlreadyRegisteredError,
} from './services/registration.js';
import {
  createSessionService,
  SessionError,
} from './services/registration-session.js';
import { RegistrationInputError } from './validators/registration.js';

export function createApp(
  databaseTarget: DatabaseTarget = 'app',
  now: () => number = Date.now,
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

  app.use(
    (
      error: unknown,
      _request: Request,
      response: Response,
      next: NextFunction,
    ) => {
      if (response.headersSent) {
        next(error);
        return;
      }

      if (error instanceof RegistrationInputError) {
        response.status(400).json({
          error: {
            code: 'INVALID_INPUT',
            message: error.message,
            fields: error.fields,
          },
        });
        return;
      }

      if (error instanceof SessionError) {
        response.status(error.code === 'SESSION_EXPIRED' ? 410 : 400).json({
          error: {
            code: error.code,
            message: error.message,
          },
        });
        return;
      }

      if (error instanceof EmailAlreadyRegisteredError) {
        response.status(409).json({
          error: {
            code: 'EMAIL_ALREADY_REGISTERED',
            message: error.message,
          },
        });
        return;
      }

      if (
        error instanceof SyntaxError &&
        'status' in error &&
        error.status === 400
      ) {
        response.status(400).json({
          error: {
            code: 'INVALID_INPUT',
            message: 'El cuerpo de la solicitud debe contener JSON válido.',
          },
        });
        return;
      }

      response.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'No fue posible completar la solicitud.',
        },
      });
    },
  );

  return {
    app,
    closeDatabase: () => pool.end(),
  };
}

export const { app, closeDatabase } = createApp();
