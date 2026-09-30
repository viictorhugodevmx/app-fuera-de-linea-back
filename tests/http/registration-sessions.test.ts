import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../../src/app.js';
import { getAllowedOrigins } from '../../src/config/cors.js';
import { getSessionConfig } from '../../src/config/session.js';
import { createSessionService } from '../../src/services/registration-session.js';

const allowedOrigin = getAllowedOrigins()[0];

describe('POST /api/registration-sessions', () => {
  it('emite una sesión válida de cinco minutos sin permitir caché', async () => {
    const response = await request(app).post('/api/registration-sessions');

    expect(response.status).toBe(201);
    expect(response.headers['cache-control']).toBe('no-store');
    expect(response.body).toEqual({
      data: {
        sessionToken: expect.any(String),
        expiresAt: expect.any(String),
        serverTime: expect.any(String),
      },
    });

    const { sessionToken, expiresAt, serverTime } = response.body.data;

    expect(Date.parse(expiresAt) - Date.parse(serverTime)).toBe(300_000);

    const service = createSessionService(getSessionConfig());

    expect(() => service.verify(sessionToken)).not.toThrow();
  });

  it('permite una solicitud desde el origen configurado', async () => {
    const response = await request(app)
      .post('/api/registration-sessions')
      .set('Origin', allowedOrigin);

    expect(response.status).toBe(201);
    expect(response.headers['access-control-allow-origin']).toBe(allowedOrigin);
  });

  it('responde al preflight para POST con Content-Type', async () => {
    const response = await request(app)
      .options('/api/registration-sessions')
      .set('Origin', allowedOrigin)
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'Content-Type');

    expect(response.status).toBe(204);
    expect(response.headers['access-control-allow-origin']).toBe(allowedOrigin);
    expect(response.headers['access-control-allow-methods']).toContain('POST');
    expect(response.headers['access-control-allow-headers']).toContain(
      'Content-Type',
    );
  });

  it('rechaza un origen no configurado con un error JSON', async () => {
    const response = await request(app)
      .post('/api/registration-sessions')
      .set('Origin', 'https://not-allowed.invalid');

    expect(response.status).toBe(403);
    expect(response.headers['access-control-allow-origin']).toBeUndefined();
    expect(response.body).toEqual({
      error: {
        code: 'ORIGIN_NOT_ALLOWED',
        message: 'El origen de la solicitud no está permitido.',
      },
    });
  });

  it('responde 400 cuando recibe JSON malformado', async () => {
    const response = await request(app)
      .post('/api/registration-sessions')
      .set('Content-Type', 'application/json')
      .send('{"broken":');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: {
        code: 'INVALID_INPUT',
        message: 'El cuerpo de la solicitud debe contener JSON válido.',
      },
    });
  });
});
