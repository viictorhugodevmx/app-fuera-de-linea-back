import { rateLimit } from 'express-rate-limit';

export function createRegistrationLimiter(limit = 30) {
  if (!Number.isSafeInteger(limit) || limit < 1) {
    throw new Error('El límite de solicitudes debe ser un entero positivo.');
  }

  return rateLimit({
    windowMs: 60_000,
    limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skip: (request) => request.method === 'OPTIONS',
    handler: (_request, response) => {
      response.set('Cache-Control', 'no-store');

      response.status(429).json({
        error: {
          code: 'TOO_MANY_REQUESTS',
          message: 'Has realizado demasiados intentos. Espera un momento.',
        },
      });
    },
  });
}
