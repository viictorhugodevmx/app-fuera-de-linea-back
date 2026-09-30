import express from 'express';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiErrorHandler } from '../../src/middleware/api-error.js';

afterEach(() => {
  vi.restoreAllMocks();
});

function createErrorApp(error: unknown) {
  const app = express();

  app.get('/test', (_request, _response, next) => {
    next(error);
  });

  app.use(apiErrorHandler);

  return app;
}

describe('Errores de la API', () => {
  it('traduce una conexión rechazada a 503 sin exponer detalles', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});

    const error = Object.assign(new Error('private-database-detail'), {
      code: 'ECONNREFUSED',
    });

    const response = await request(createErrorApp(error)).get('/test');

    expect(response.status).toBe(503);
    expect(response.headers['cache-control']).toBe('no-store');
    expect(response.body).toEqual({
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message:
          'El servicio no está disponible temporalmente. Intenta más tarde.',
      },
    });

    expect(log).toHaveBeenCalledWith('API_ERROR', {
      status: 503,
      code: 'ECONNREFUSED',
    });

    expect(JSON.stringify(log.mock.calls)).not.toContain(
      'private-database-detail',
    );
  });

  it('responde 500 ante un error inesperado sin exponer su mensaje', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});

    const response = await request(
      createErrorApp(new Error('private-internal-detail')),
    ).get('/test');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'No fue posible completar la solicitud.',
      },
    });

    expect(log).toHaveBeenCalledWith('API_ERROR', {
      status: 500,
      code: 'UNEXPECTED_ERROR',
    });

    expect(JSON.stringify(log.mock.calls)).not.toContain(
      'private-internal-detail',
    );
  });
});
