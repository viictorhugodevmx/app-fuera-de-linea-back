import { createPool } from 'mysql2/promise';
import { getDatabaseConfig, type DatabaseTarget } from '../config/database.js';

export function createDatabasePool(target: DatabaseTarget) {
  return createPool({
    ...getDatabaseConfig(target),
    waitForConnections: true,
    connectionLimit: 5,
    multipleStatements: false,
    charset: 'utf8mb4',
  });
}
