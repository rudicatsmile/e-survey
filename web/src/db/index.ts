import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema';

// Global pool connection cache for Next.js hot reload in development
const globalForDb = globalThis as unknown as {
  conn: mysql.Pool | undefined;
};

const pool =
  globalForDb.conn ??
  mysql.createPool({
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 3306,
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'esurvey',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.conn = pool;
}

export const db = drizzle(pool, { schema, mode: 'default' });
export { pool, schema };
