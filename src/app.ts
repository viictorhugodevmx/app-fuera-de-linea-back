import cors from 'cors';
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { getAllowedOrigins } from './config/cors.js';
import { getSessionConfig } from './config/session.js';
import { createSessionService } from './services/registration-session.js';

export const app = express();

const allowedOrigins = getAllowedOrigins();
const sessionService = createSessionService(getSessionConfig());

app.disable('x-powered-by');

app.use((request, response, next) => {
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
