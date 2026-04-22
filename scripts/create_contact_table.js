const mysql = require('mysql2/promise');

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pushpa_art',
    port: parseInt(process.env.DB_PORT || '3306')
  });

  await conn.execute(`
    CREATE TABLE IF NOT EXISTS contact_inquiries (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50) DEFAULT NULL,
      subject VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
      admin_notes TEXT DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  console.log('contact_inquiries table created successfully');

  const [rows] = await conn.execute('DESCRIBE contact_inquiries');
  console.table(rows.map(r => ({ Field: r.Field, Type: r.Type, Null: r.Null, Default: r.Default })));

  await conn.end();
}

main().catch(console.error);