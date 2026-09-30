import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.js';
import { getAllowedOrigins } from '../../src/config/cors.js';

const closers: Array<() => Promise<void>> = [];

function createTestApp(limit = 30) {
  const instance = createApp('test', Date.now, limit);
  closers.push(instance.closeDatabase);
  return instance.app;
}

afterEach(async () => {
  await Promise.all(closers.map((close) => close()));
  closers.length = 0;
});

describe('Protección de la API', () => {
  it('comparte la cuota entre sesiones y registro, dejando health fuera', async () => {
    const app = createTestApp(1);

    const session = await request(app).post('/api/registration-sessions');

    const registration = await request(app).post('/api/registrations').send({});

    const health = await request(app).get('/api/health');

    expect(session.status).toBe(201);
    expect(registration.status).toBe(429);
    expect(registration.body.error.code).toBe('TOO_MANY_REQUESTS');
    expect(Number(registration.headers['retry-after'])).toBeGreaterThan(0);
    expect(health.status).toBe(200);
  });

  it('no consume cuota durante el preflight de CORS', async () => {
    const app = createTestApp(1);
    const origin = getAllowedOrigins()[0];

    const preflight = await request(app)
      .options('/api/registration-sessions')
      .set('Origin', origin)
      .set('Access-Control-Request-Method', 'POST');

    const session = await request(app)
      .post('/api/registration-sessions')
      .set('Origin', origin);

    expect(preflight.status).toBe(204);
    expect(session.status).toBe(201);
  });

  it('rechaza cuerpos mayores de 16 KB con 413', async () => {
    const app = createTestApp();

    const response = await request(app)
      .post('/api/registrations')
      .send({
        name: 'Prueba',
        email: 'test@example.com',
        message: 'a'.repeat(20_000),
        sessionToken: 'invalid-token',
      });

    expect(response.status).toBe(413);
    expect(response.body).toEqual({
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'La solicitud supera el tamaño permitido.',
      },
    });
  });
});
