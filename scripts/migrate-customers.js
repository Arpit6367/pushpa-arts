// Run: node scripts/migrate-customers.js
require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pushpa_art',
    port: parseInt(process.env.DB_PORT || '3306'),
    ...(process.env.DATABASE_URL ? { uri: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } } : {})
  });

  console.log('Connected to database. Running customer migrations...');

  // 1. Create customers table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS customers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) DEFAULT '',
      email VARCHAR(255) NOT NULL UNIQUE,
      phone VARCHAR(50) DEFAULT '',
      password_hash VARCHAR(255) DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ customers table ready');

  // 2. Create customer_addresses table
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS customer_addresses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_id INT NOT NULL,
      address_type ENUM('billing', 'shipping') DEFAULT 'shipping',
      address_line VARCHAR(500) NOT NULL,
      city VARCHAR(100) NOT NULL,
      state VARCHAR(100) NOT NULL,
      zip VARCHAR(20) NOT NULL,
      is_default BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    )
  `);
  console.log('✅ customer_addresses table ready');

  // 3. Add customer_id column to orders table if not exists
  try {
    await connection.execute(`
      ALTER TABLE orders ADD COLUMN customer_id INT DEFAULT NULL,
      ADD FOREIGN KEY (fk_customer) REFERENCES customers(id) ON DELETE SET NULL
    `);
    console.log('✅ Added customer_id to orders table');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME' || err.message.includes('Duplicate column')) {
      console.log('ℹ️  customer_id column already exists in orders');
    } else {
      // Try simpler approach
      try {
        await connection.execute(`ALTER TABLE orders ADD COLUMN customer_id INT DEFAULT NULL`);
        console.log('✅ Added customer_id to orders table');
      } catch (err2) {
        if (err2.code === 'ER_DUP_FIELDNAME' || err2.message.includes('Duplicate column')) {
          console.log('ℹ️  customer_id column already exists in orders');
        } else {
          console.error('⚠️  Could not add customer_id to orders:', err2.message);
        }
      }
    }
  }

  console.log('\n🎉 Customer migration complete!');
  await connection.end();
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
