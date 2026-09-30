import 'dotenv/config';

export type DatabaseTarget = 'app' | 'test';

export function getDatabaseConfig(target: DatabaseTarget) {
  const prefix = target === 'test' ? 'TEST_DB_' : 'DB_';

  function required(name: string): string {
    const key = `${prefix}${name}`;
    const value = process.env[key];

    if (!value) {
      throw new Error(`Falta la variable ${key}.`);
    }

    return value;
  }

  const port = Number(required('PORT'));

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`${prefix}PORT debe estar entre 1 y 65535.`);
  }

  const database = required('NAME');

  if (target === 'test' && !database.endsWith('_test')) {
    throw new Error('La base de pruebas debe terminar en _test.');
  }

  return {
    host: required('HOST'),
    port,
    database,
    user: required('USER'),
    password: required('PASSWORD'),
  };
}
