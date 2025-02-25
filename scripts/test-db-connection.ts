// scripts/test-db-connection.ts
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

async function testConnection() {
  let connection;
  try {
    connection = await mysql.createConnection(DATABASE_URL as string);

    // Check if users table exists
    const [rows] = await connection.execute<mysql.RowDataPacket[]>(`
      SELECT COUNT(*)
      FROM information_schema.tables 
      WHERE table_schema = 'mutabaah' 
      AND table_name = 'users'
    `);

    if (rows[0]['COUNT(*)'] > 0) {
      console.log('Database connection successful!');
      console.log('Users table exists');
    } else {
      console.log('Database connection successful but users table not found');
    }
  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testConnection();
