const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function applySchema() {
  console.log('--- Applying Schema Changes ---');
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "pushpa_art",
    port: parseInt(process.env.DB_PORT || "3306"),
    multipleStatements: true // Allow multiple statements for easier execution
  });

  try {
    console.log(`Connected to database: ${process.env.DB_NAME || "pushpa_art"}`);

    const schemaPath = path.join(__dirname, '../src/lib/schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Reading schema.sql...');
    await connection.query(sql);
    
    console.log('Checking for missing columns in orders table...');
    const [columns] = await connection.query('DESCRIBE orders');
    const columnNames = columns.map(c => c.Field);
    
    if (!columnNames.includes('payment_method')) {
      console.log('Adding payment_method column to orders...');
      await connection.query("ALTER TABLE orders ADD COLUMN payment_method ENUM('paypal', 'credit_debit_card', 'google_pay', 'card') DEFAULT NULL AFTER discount_amount");
    }
    
    if (!columnNames.includes('payment_status')) {
      console.log('Adding payment_status column to orders...');
      await connection.query("ALTER TABLE orders ADD COLUMN payment_status ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending' AFTER payment_method");
    }

    if (!columnNames.includes('shipping_country')) {
      console.log('Adding shipping_country column to orders...');
      await connection.query("ALTER TABLE orders ADD COLUMN shipping_country VARCHAR(100) DEFAULT 'India' AFTER shipping_zip");
    }

    console.log('✅ Schema applied successfully!');
    console.log('Payments table created/verified and Orders table updated.');

  } catch (error) {
    console.error('❌ Error applying schema:', error.message);
    
    // If it's a specific error about multiple statements or syntax, we might need to split
    if (error.code === 'ER_PARSE_ERROR') {
      console.log('Attempting to split and execute statements individually...');
      // Simple split by semicolon (not perfect but usually works for schema files)
      const statements = sql
        .split(/;\s*$/m)
        .map(s => s.trim())
        .filter(s => s.length > 0);
        
      for (const statement of statements) {
        try {
          await connection.query(statement);
        } catch (innerError) {
          // Ignore "column already exists" errors if re-running
          if (!innerError.message.includes('Duplicate column name') && !innerError.message.includes('already exists')) {
            console.error(`Error in statement: ${statement.substring(0, 50)}...`);
            console.error(innerError.message);
          }
        }
      }
      console.log('✅ Individual statement execution finished.');
    }
  } finally {
    await connection.end();
    console.log('Database connection closed.');
  }
}

applySchema().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
