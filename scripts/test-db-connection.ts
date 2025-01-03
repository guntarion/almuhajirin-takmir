// scripts/test-db-connection.ts
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const sql = postgres(DATABASE_URL, {
  ssl: 'require',
});

async function testConnection() {
  try {
    // Check if users table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `;

    if (tableExists[0].exists) {
      console.log('Database connection successful!');
      console.log('Users table exists');
    } else {
      console.log('Database connection successful but users table not found');
    }
  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    await sql.end();
  }
}

testConnection();
