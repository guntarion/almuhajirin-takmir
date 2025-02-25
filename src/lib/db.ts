import mysql, { PoolOptions, QueryError } from 'mysql2/promise';

const poolConfig: PoolOptions = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: Number(process.env.DATABASE_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create a singleton pool instance
let pool: mysql.Pool;

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(poolConfig);
  }
  return pool;
}

type QueryValues = string | number | boolean | null | Buffer | Date;

export async function query<T>(sql: string, values?: QueryValues[]): Promise<T> {
  const connection = await getPool().getConnection();
  try {
    const [rows] = await connection.execute(sql, values);
    return rows as T;
  } finally {
    connection.release();
  }
}

export async function transaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await getPool().getConnection();
  await connection.beginTransaction();

  try {
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Error handler type
export function isQueryError(error: unknown): error is QueryError {
  return error instanceof Error && 'code' in error && 'sqlState' in error;
}

// Clean up the pool when the application shuts down
process.on('SIGTERM', () => {
  if (pool) {
    pool.end().catch(console.error);
  }
});
