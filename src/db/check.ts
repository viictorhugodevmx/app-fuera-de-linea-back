import type { RowDataPacket } from 'mysql2/promise';
import { getDatabaseConfig } from '../config/database.js';
import { createDatabasePool } from './pool.js';

interface ConnectionInfo extends RowDataPacket {
  database_name: string;
  database_user: string;
  server_version: string;
}

async function main() {
  for (const target of ['app', 'test'] as const) {
    const config = getDatabaseConfig(target);
    const pool = createDatabasePool(target);

    try {
      const [rows] = await pool.query<ConnectionInfo[]>(`
        SELECT
          DATABASE() AS database_name,
          CURRENT_USER() AS database_user,
          VERSION() AS server_version
      `);

      const info = rows[0];

      if (!info || info.database_name !== config.database) {
        throw new Error(`La conexión ${target} apunta a una base inesperada.`);
      }

      console.info(
        `[${target}] OK — base: ${info.database_name}; usuario: ${info.database_user}; MySQL: ${info.server_version}`,
      );
    } finally {
      await pool.end();
    }
  }
}

main().catch((error: unknown) => {
  console.error(
    'Falló la comprobación MySQL:',
    error instanceof Error ? error.message : 'Error desconocido.',
  );
  process.exitCode = 1;
});
