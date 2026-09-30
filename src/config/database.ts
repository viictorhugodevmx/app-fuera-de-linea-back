import 'dotenv/config';

export type DatabaseTarget = 'app' | 'test';

type DatabaseSsl = {
  ca: string;
  rejectUnauthorized: true;
};

function getSslConfig(prefix: string): DatabaseSsl | undefined {
  const mode =
    process.env[`${prefix}SSL_MODE`]?.trim().toLowerCase() || 'disabled';

  if (mode === 'disabled') {
    return undefined;
  }

  if (mode !== 'required') {
    throw new Error(`${prefix}SSL_MODE debe ser disabled o required.`);
  }

  const encodedCa = process.env[`${prefix}SSL_CA_BASE64`]?.trim();

  if (!encodedCa) {
    throw new Error(`Falta la variable ${prefix}SSL_CA_BASE64.`);
  }

  const ca = Buffer.from(encodedCa, 'base64').toString('utf8');

  if (
    !ca.includes('-----BEGIN CERTIFICATE-----') ||
    !ca.includes('-----END CERTIFICATE-----')
  ) {
    throw new Error(
      `${prefix}SSL_CA_BASE64 no contiene un certificado válido.`,
    );
  }

  return {
    ca,
    rejectUnauthorized: true,
  };
}

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

  const config = {
    host: required('HOST'),
    port,
    database,
    user: required('USER'),
    password: required('PASSWORD'),
  };

  const ssl = getSslConfig(prefix);

  return ssl ? { ...config, ssl } : config;
}
