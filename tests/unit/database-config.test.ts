import { afterEach, describe, expect, it, vi } from 'vitest';
import { getDatabaseConfig } from '../../src/config/database.js';

function prepareEnvironment() {
  vi.stubEnv('TEST_DB_HOST', '127.0.0.1');
  vi.stubEnv('TEST_DB_PORT', '3306');
  vi.stubEnv('TEST_DB_NAME', 'fuera_de_linea_test');
  vi.stubEnv('TEST_DB_USER', 'fdl_test');
  vi.stubEnv('TEST_DB_PASSWORD', 'test-only-password');
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('Configuración MySQL', () => {
  it('selecciona las variables propias de pruebas', () => {
    prepareEnvironment();

    expect(getDatabaseConfig('test')).toEqual({
      host: '127.0.0.1',
      port: 3306,
      database: 'fuera_de_linea_test',
      user: 'fdl_test',
      password: 'test-only-password',
    });
  });

  it('rechaza una variable obligatoria vacía', () => {
    prepareEnvironment();
    vi.stubEnv('TEST_DB_PASSWORD', '');

    expect(() => getDatabaseConfig('test')).toThrow(
      'Falta la variable TEST_DB_PASSWORD.',
    );
  });

  it('rechaza un puerto fuera de rango', () => {
    prepareEnvironment();
    vi.stubEnv('TEST_DB_PORT', '70000');

    expect(() => getDatabaseConfig('test')).toThrow(
      'TEST_DB_PORT debe estar entre 1 y 65535.',
    );
  });

  it('impide configurar pruebas sobre una base sin sufijo _test', () => {
    prepareEnvironment();
    vi.stubEnv('TEST_DB_NAME', 'fuera_de_linea');

    expect(() => getDatabaseConfig('test')).toThrow(
      'La base de pruebas debe terminar en _test.',
    );
  });
});
