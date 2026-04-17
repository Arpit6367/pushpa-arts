import mysql from "mysql2/promise";

let pool;

export function getPool() {
  if (pool) return pool;

  // Use a global variable to store the pool in development
  // This prevents creating new pools on every hot reload
  if (process.env.NODE_ENV !== 'production') {
    if (!global.mysqlPool) {
      global.mysqlPool = createNewPool();
    }
    pool = global.mysqlPool;
  } else {
    pool = createNewPool();
  }
  
  return pool;
}

function createNewPool() {
  if (process.env.DATABASE_URL) {
    return mysql.createPool({
      uri: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      waitForConnections: true,
      connectionLimit: 30, // Increased for concurrent Next.js requests
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000
    });
  } else {
    return mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "pushpa_art",
      port: parseInt(process.env.DB_PORT || "3306"),
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
      waitForConnections: true,
      connectionLimit: 30,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000
    });
  }
}

export async function query(sql, params = []) {
  const pool = getPool();
  const [rows] = await pool.execute(sql, params);
  return rows;
}

export default { getPool, query };