import mysql from "mysql2/promise";

let pool;

export function getPool() {
  if (!pool) {
    if (process.env.DATABASE_URL) {
      pool = mysql.createPool({
        uri: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    } else {
      pool = mysql.createPool({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "pushpa_art",
        port: parseInt(process.env.DB_PORT || "3306"),
        ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    }
  }
  return pool;
}

export async function query(sql, params = []) {
  const pool = getPool();
  const [rows] = await pool.execute(sql, params);
  return rows;
}

export default { getPool, query };