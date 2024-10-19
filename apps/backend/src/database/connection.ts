import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';

export function getDatabaseConnection<T>({
  host,
  user,
  password,
  port,
  database,
  ssl,
  max = 32,
  connectionTimeoutMillis = 5000,
}: IConfiguration) {
  const pool = new Pool({
    host,
    user,
    password,
    port,
    database,
    ssl,
    max,
    connectionTimeoutMillis,
  });

  const dialect = new PostgresDialect({
    pool,
  });

  return new Kysely<T>({
    dialect,
  });
}

interface IConfiguration {
  user: string;
  password: string;
  port: number;
  host: string;
  database: string;
  ssl: boolean;
  max: number; // Maximum number of connections in the pool. Default is 32.
  connectionTimeoutMillis: number;
}
