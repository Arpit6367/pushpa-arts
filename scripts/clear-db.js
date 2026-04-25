const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function clearDB() {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "pushpa_art",
    port: parseInt(process.env.DB_PORT || "3306"),
  });

  console.log('Clearing database tables...');

  try {
    // Disable foreign key checks to allow truncation
    await pool.execute('SET FOREIGN_KEY_CHECKS = 0');

    console.log('  Truncating product_images...');
    await pool.execute('TRUNCATE TABLE product_images');

    console.log('  Truncating product_categories...');
    await pool.execute('TRUNCATE TABLE product_categories');

    console.log('  Truncating products...');
    await pool.execute('TRUNCATE TABLE products');

    console.log('  Truncating categories...');
    await pool.execute('TRUNCATE TABLE categories');

    // Re-enable foreign key checks
    await pool.execute('SET FOREIGN_KEY_CHECKS = 1');

    console.log('\nDatabase cleared successfully (categories, products, images).');
  } catch (error) {
    console.error('Error clearing database:', error);
  } finally {
    await pool.end();
  }
}

clearDB();
