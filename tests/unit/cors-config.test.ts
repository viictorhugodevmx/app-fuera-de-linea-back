import { afterEach, describe, expect, it, vi } from 'vitest';
import { getAllowedOrigins } from '../../src/config/cors.js';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('Configuración CORS', () => {
  it('acepta orígenes exactos y elimina duplicados', () => {
    vi.stubEnv(
      'ALLOWED_ORIGINS',
      'http://localhost:3000, https://example.com, http://localhost:3000',
    );

    expect(getAllowedOrigins()).toEqual([
      'http://localhost:3000',
      'https://example.com',
    ]);
  });

  it('rechaza una lista vacía', () => {
    vi.stubEnv('ALLOWED_ORIGINS', '');

    expect(() => getAllowedOrigins()).toThrow(
      'ALLOWED_ORIGINS debe contener al menos un origen.',
    );
  });

  it('rechaza el comodín como origen', () => {
    vi.stubEnv('ALLOWED_ORIGINS', '*');

    expect(() => getAllowedOrigins()).toThrow(
      'Origen inválido en ALLOWED_ORIGINS: *',
    );
  });

  it('rechaza URLs con rutas en lugar de orígenes', () => {
    vi.stubEnv('ALLOWED_ORIGINS', 'https://example.com/event');

    expect(() => getAllowedOrigins()).toThrow(
      'Origen inválido en ALLOWED_ORIGINS: https://example.com/event',
    );
  });
});
