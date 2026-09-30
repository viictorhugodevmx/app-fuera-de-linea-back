import type { NextFunction, Request, Response } from 'express';
import { EmailAlreadyRegisteredError } from '../services/registration.js';
import { SessionError } from '../services/registration-session.js';
import { RegistrationInputError } from '../validators/registration.js';

const unavailableCodes = new Set([
  'ECONNREFUSED',
  'ECONNRESET',
  'ETIMEDOUT',
  'EHOSTUNREACH',
  'ENETUNREACH',
  'ENOTFOUND',
  'EAI_AGAIN',
  'PROTOCOL_CONNECTION_LOST',
  'ER_CON_COUNT_ERROR',
  'ER_TOO_MANY_USER_CONNECTIONS',
  'ER_SERVER_SHUTDOWN',
  'ER_LOCK_WAIT_TIMEOUT',
  'ER_LOCK_DEADLOCK',
]);

export function apiErrorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  if (response.headersSent) {
    next(error);
    return;
  }

  response.set('Cache-Control', 'no-store');

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
    error &&
    typeof error === 'object' &&
    'type' in error &&
    error.type === 'entity.too.large'
  ) {
    response.status(413).json({
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'La solicitud supera el tamaño permitido.',
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

  const candidate =
    error && typeof error === 'object' && 'code' in error
      ? error.code
      : undefined;

  const internalCode =
    typeof candidate === 'string' && /^[A-Z0-9_]{1,80}$/.test(candidate)
      ? candidate
      : 'UNEXPECTED_ERROR';

  const unavailable = unavailableCodes.has(internalCode);
  const status = unavailable ? 503 : 500;

  console.error('API_ERROR', {
    status,
    code: internalCode,
  });

  response.status(status).json({
    error: {
      code: unavailable ? 'SERVICE_UNAVAILABLE' : 'INTERNAL_ERROR',
      message: unavailable
        ? 'El servicio no está disponible temporalmente. Intenta más tarde.'
        : 'No fue posible completar la solicitud.',
    },
  });
}
