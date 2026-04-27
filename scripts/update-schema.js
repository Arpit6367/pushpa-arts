const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function updateSchema() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "pushpa_art",
    port: parseInt(process.env.DB_PORT || "3306"),
  });

  console.log('Connected to database.');

  const tables = [
    `CREATE TABLE IF NOT EXISTS blogs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      content LONGTEXT,
      image VARCHAR(500),
      excerpt TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      meta_title VARCHAR(255),
      meta_description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      description LONGTEXT,
      image VARCHAR(500),
      client_name VARCHAR(255),
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS clients (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      logo VARCHAR(500),
      website_url VARCHAR(500),
      is_active BOOLEAN DEFAULT TRUE,
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS faqs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS pages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      content LONGTEXT,
      meta_title VARCHAR(255),
      meta_description TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`
  ];

  for (const table of tables) {
    try {
      await connection.query(table);
      console.log('Table created or already exists.');
    } catch (err) {
      console.error('Error creating table:', err);
    }
  }

  // Insert initial pages if they don't exist
  const initialPages = [
    ['About Udaipur', 'about-udaipur', '<h1>About Udaipur</h1><p>Content for About Udaipur goes here...</p>'],
    ['Shipping Policy', 'shipping', '<h1>Shipping Policy</h1><p>Content for Shipping Policy goes here...</p>'],
    ['Terms & Conditions', 'terms-conditions', '<h1>Terms & Conditions</h1><p>Content for Terms & Conditions goes here...</p>'],
    ['Privacy Policy', 'privacy-policy', '<h1>Privacy Policy</h1><p>Content for Privacy Policy goes here...</p>']
  ];

  for (const [title, slug, content] of initialPages) {
    try {
      await connection.query(
        'INSERT IGNORE INTO pages (title, slug, content) VALUES (?, ?, ?)',
        [title, slug, content]
      );
      console.log(`Initial page "${title}" created or already exists.`);
    } catch (err) {
      console.error(`Error creating page "${title}":`, err);
    }
  }

  await connection.end();
  console.log('Database connection closed.');
}

updateSchema().catch(console.error);
