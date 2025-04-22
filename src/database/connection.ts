import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5
});

// handling query process 
export async function query(sql: string, params: any[] = []) {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.query(sql, params);
    return result;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  } finally {
    if (conn) {
      conn.release();
    }
  }
}

// checker pooling connection to database
export async function getConnection() {
  try {
    const connection = await pool.getConnection();
    return connection;
  } catch (error) {
    console.error("Error getting database connection:", error);
    throw error;
  }
}