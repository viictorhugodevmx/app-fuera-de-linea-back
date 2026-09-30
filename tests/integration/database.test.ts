import { randomUUID } from 'node:crypto';
import type { RowDataPacket } from 'mysql2/promise';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
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

const config = getDatabaseConfig('test');
const pool = createDatabasePool('test');

const persistenceEmail = `persistence-${randomUUID()}@example.com`;
const duplicateEmail = `duplicate-${randomUUID()}@example.com`;

let databaseVerified = false;

beforeAll(async () => {
  const [rows] = await pool.query<DatabaseInfo[]>(
    'SELECT DATABASE() AS database_name',
  );

  expect(rows[0]?.database_name).toBe(config.database);
  expect(config.database.endsWith('_test')).toBe(true);

  databaseVerified = true;
});

afterAll(async () => {
  try {
    if (databaseVerified) {
      await pool.execute('DELETE FROM registrations WHERE email IN (?, ?)', [
        persistenceEmail,
        duplicateEmail,
      ]);
    }
  } finally {
    await pool.end();
  }
});

describe('Persistencia MySQL', () => {
  it('guarda y recupera un registro con consultas parametrizadas', async () => {
    await pool.execute(
      'INSERT INTO registrations (name, email, message) VALUES (?, ?, ?)',
      ['Registro de prueba', persistenceEmail, 'Me interesa asistir.'],
    );

    const [rows] = await pool.execute<Registration[]>(
      'SELECT name, email, message FROM registrations WHERE email = ?',
      [persistenceEmail],
    );

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      name: 'Registro de prueba',
      email: persistenceEmail,
      message: 'Me interesa asistir.',
    });
  });

  it('rechaza un correo repetido aunque cambien las mayúsculas', async () => {
    await pool.execute(
      'INSERT INTO registrations (name, email, message) VALUES (?, ?, ?)',
      ['Primer registro', duplicateEmail, 'Primer mensaje.'],
    );

    await expect(
      pool.execute(
        'INSERT INTO registrations (name, email, message) VALUES (?, ?, ?)',
        ['Segundo registro', duplicateEmail.toUpperCase(), 'Segundo mensaje.'],
      ),
    ).rejects.toMatchObject({
      code: 'ER_DUP_ENTRY',
      errno: 1062,
    });

    const [rows] = await pool.execute<Registration[]>(
      'SELECT name, email, message FROM registrations WHERE email = ?',
      [duplicateEmail],
    );

    expect(rows).toHaveLength(1);
    expect(rows[0]?.name).toBe('Primer registro');
  });
});
