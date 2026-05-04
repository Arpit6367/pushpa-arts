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
  try {
    const pool = getPool();
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', {
      message: error.message,
      code: error.code,
      sql: sql.substring(0, 100) + (sql.length > 100 ? '...' : '')
    });
    
    // During build phase, we want to avoid crashing the entire build if the DB is unreachable
    // This allows the site to build with empty/default data which will be updated on the client or during ISR
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'PROTOCOL_CONNECTION_LOST') {
      console.warn('Database connection failed. Returning empty result set for safety during build/runtime.');
      return [];
    }
    
    throw error;
  }
}

export default { getPool, query };