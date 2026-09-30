import { readFile } from 'node:fs/promises';
import type { RowDataPacket } from 'mysql2/promise';
import { getDatabaseConfig, type DatabaseTarget } from '../config/database.js';
import { createDatabasePool } from './pool.js';

interface TableInfo extends RowDataPacket {
  table_name: string;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length > 1 || (args.length === 1 && args[0] !== '--test')) {
    throw new Error('Uso: db:migrate o db:migrate:test.');
  }

  const target: DatabaseTarget = args[0] === '--test' ? 'test' : 'app';
  const config = getDatabaseConfig(target);

  const sql = await readFile(
    new URL(
      '../../db/migrations/001_create_registrations.sql',
      import.meta.url,
    ),
    'utf8',
  );

  const pool = createDatabasePool(target);

  try {
    await pool.query(sql);

    const [tables] = await pool.execute<TableInfo[]>(
      `SELECT TABLE_NAME AS table_name
       FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
      [config.database, 'registrations'],
    );

    if (tables.length !== 1) {
      throw new Error('No se encontró la tabla registrations.');
    }

    console.info(`[${target}] Migración OK — ${config.database}.registrations`);
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  console.error(
    'Falló la migración:',
    error instanceof Error ? error.message : 'Error desconocido.',
  );
  process.exitCode = 1;
});
