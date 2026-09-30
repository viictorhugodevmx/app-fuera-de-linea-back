import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app.js';

describe('GET /api/health', () => {
  it('responde con la identidad y disponibilidad del servicio', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.body).toEqual({
      status: 'ok',
      service: 'fuera-de-linea-api',
    });
  });
});
