import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createRegistrationLimiter } from '../../src/middleware/registration-limit.js';

describe('Límite de solicitudes', () => {
  it('rechaza límites inválidos', () => {
    expect(() => createRegistrationLimiter(0)).toThrow(
      'El límite de solicitudes debe ser un entero positivo.',
    );
  });

  it('responde 429 cuando se supera la cuota', async () => {
    const app = express();

    app.use(createRegistrationLimiter(2));
    app.post('/test', (_request, response) => {
      response.status(204).end();
    });

    const first = await request(app).post('/test');
    const second = await request(app).post('/test');
    const third = await request(app).post('/test');

    expect(first.status).toBe(204);
    expect(second.status).toBe(204);
    expect(third.status).toBe(429);
    expect(third.headers['cache-control']).toBe('no-store');
    expect(Number(third.headers['retry-after'])).toBeGreaterThan(0);

    expect(third.body).toEqual({
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Has realizado demasiados intentos. Espera un momento.',
      },
    });
  });
});
