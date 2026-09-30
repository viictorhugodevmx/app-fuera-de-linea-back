import { afterEach, describe, expect, it, vi } from 'vitest';
import { getSessionConfig } from '../../src/config/session.js';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('Configuración de sesiones', () => {
  it('acepta un secreto propio y fija cinco minutos de duración', () => {
    vi.stubEnv('SESSION_SECRET', 'a'.repeat(64));

    expect(getSessionConfig()).toEqual({
      secret: 'a'.repeat(64),
      ttlSeconds: 300,
    });
  });

  it('rechaza un secreto vacío', () => {
    vi.stubEnv('SESSION_SECRET', '');

    expect(() => getSessionConfig()).toThrow(
      'SESSION_SECRET debe contener un secreto propio de al menos 32 caracteres.',
    );
  });

  it('rechaza un secreto demasiado corto', () => {
    vi.stubEnv('SESSION_SECRET', 'short');

    expect(() => getSessionConfig()).toThrow();
  });

  it('rechaza el valor de ejemplo sin reemplazar', () => {
    vi.stubEnv(
      'SESSION_SECRET',
      'REPLACE_WITH_RANDOM_SECRET_AT_LEAST_32_CHARACTERS',
    );

    expect(() => getSessionConfig()).toThrow();
  });
});
