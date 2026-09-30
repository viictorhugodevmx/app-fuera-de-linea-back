import { randomUUID } from 'node:crypto';
import type { RowDataPacket } from 'mysql2/promise';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.js';
import { getDatabaseConfig } from '../../src/config/database.js';
import { createDatabasePool } from '../../src/db/pool.js';

interface DatabaseInfo extends RowDataPacket {
  database_name: string;
}

interface Registration extends RowDataPacket {
  name: string;
  email: string;
  message: string;
}

const start = Date.parse('2026-09-30T03:00:00.000Z');
let currentTime = start;

const config = getDatabaseConfig('test');
const instance = createApp('test', () => currentTime);
const pool = createDatabasePool('test');
const emails = new Set<string>();

let databaseVerified = false;

beforeAll(async () => {
  const [rows] = await pool.query<DatabaseInfo[]>(
    'SELECT DATABASE() AS database_name',
  );

  expect(rows[0]?.database_name).toBe(config.database);
  expect(config.database.endsWith('_test')).toBe(true);

  databaseVerified = true;
});

beforeEach(() => {
  currentTime = start;
});

afterAll(async () => {
  try {
    if (databaseVerified && emails.size > 0) {
      const values = [...emails];
      const placeholders = values.map(() => '?').join(', ');

      await pool.execute(
        `DELETE FROM registrations WHERE email IN (${placeholders})`,
        values,
      );
    }
  } finally {
    await Promise.all([pool.end(), instance.closeDatabase()]);
  }
});

function createEmail() {
  const email = `registration-${randomUUID()}@example.com`;
  emails.add(email);
  return email;
}

function form(email: string, sessionToken: string) {
  return {
    name: 'Registro de prueba',
    email,
    message: 'Me interesa asistir.',
    sessionToken,
  };
}

async function issueSession(): Promise<string> {
  const response = await request(instance.app).post(
    '/api/registration-sessions',
  );

  expect(response.status).toBe(201);

  const token: unknown = response.body.data.sessionToken;

  if (typeof token !== 'string') {
    throw new Error('El endpoint no devolvió un token.');
  }

  return token;
}

async function findRegistrations(email: string) {
  const [rows] = await pool.execute<Registration[]>(
    'SELECT name, email, message FROM registrations WHERE email = ?',
    [email],
  );

  return rows;
}

describe('Registro HTTP con MySQL', () => {
  it('confirma y persiste los datos normalizados', async () => {
    const email = createEmail();
    const token = await issueSession();

    const response = await request(instance.app)
      .post('/api/registrations')
      .send({
        ...form(email, token),
        name: '  Registro de prueba  ',
        email: `  ${email.toUpperCase()}  `,
        message: '  Me interesa asistir.  ',
      });

    expect(response.status).toBe(201);
    expect(response.headers['cache-control']).toBe('no-store');
    expect(response.body).toEqual({
      data: {
        message: 'Tu registro fue confirmado.',
      },
    });

    expect(await findRegistrations(email)).toEqual([
      {
        name: 'Registro de prueba',
        email,
        message: 'Me interesa asistir.',
      },
    ]);
  });

  it('responde 409 al repetir el correo y conserva el primer registro', async () => {
    const email = createEmail();
    const token = await issueSession();

    const first = await request(instance.app)
      .post('/api/registrations')
      .send(form(email, token));

    expect(first.status).toBe(201);

    const second = await request(instance.app)
      .post('/api/registrations')
      .send({
        ...form(email.toUpperCase(), token),
        name: 'Segundo intento',
      });

    expect(second.status).toBe(409);
    expect(second.body.error.code).toBe('EMAIL_ALREADY_REGISTERED');

    const rows = await findRegistrations(email);

    expect(rows).toHaveLength(1);
    expect(rows[0]?.name).toBe('Registro de prueba');
  });

  it('acepta solo uno de dos envíos simultáneos con el mismo correo', async () => {
    const email = createEmail();
    const token = await issueSession();

    const responses = await Promise.all([
      request(instance.app).post('/api/registrations').send(form(email, token)),
      request(instance.app).post('/api/registrations').send(form(email, token)),
    ]);

    expect(responses.map((response) => response.status).sort()).toEqual([
      201, 409,
    ]);

    expect(await findRegistrations(email)).toHaveLength(1);
  });

  it('rechaza datos inválidos sin insertar un registro', async () => {
    const email = createEmail();
    const token = await issueSession();

    const response = await request(instance.app)
      .post('/api/registrations')
      .send({
        ...form(email, token),
        name: '',
      });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('INVALID_INPUT');
    expect(response.body.error.fields.name).toEqual(expect.any(String));
    expect(await findRegistrations(email)).toHaveLength(0);
  });

  it('rechaza una sesión inválida sin insertar un registro', async () => {
    const email = createEmail();

    const response = await request(instance.app)
      .post('/api/registrations')
      .send(form(email, 'invalid-token'));

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('INVALID_SESSION');
    expect(await findRegistrations(email)).toHaveLength(0);
  });

  it('responde 410 exactamente al vencer y no inserta', async () => {
    const email = createEmail();
    const token = await issueSession();

    currentTime = start + 300_000;

    const response = await request(instance.app)
      .post('/api/registrations')
      .send(form(email, token));

    expect(response.status).toBe(410);
    expect(response.body.error.code).toBe('SESSION_EXPIRED');
    expect(await findRegistrations(email)).toHaveLength(0);
  });

  it('acepta un envío un milisegundo antes del vencimiento', async () => {
    const email = createEmail();
    const token = await issueSession();

    currentTime = start + 299_999;

    const response = await request(instance.app)
      .post('/api/registrations')
      .send(form(email, token));

    expect(response.status).toBe(201);
    expect(await findRegistrations(email)).toHaveLength(1);
  });
});
