const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function updateSchema() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || "3306"),
  });

  console.log('Connected to database.');

  const tables = [
    // Hero Slides
    `CREATE TABLE IF NOT EXISTS hero_slides (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      subtitle VARCHAR(255),
      image VARCHAR(500) NOT NULL,
      button_text VARCHAR(100) DEFAULT 'Explore Collection',
      button_link VARCHAR(255) DEFAULT '/',
      sort_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    // Testimonials
    `CREATE TABLE IF NOT EXISTS testimonials (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      designation VARCHAR(255),
      content TEXT NOT NULL,
      image VARCHAR(500),
      rating INT DEFAULT 5,
      sort_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    // Material Mastery (Sections like Silver, Bone Inlay, etc. on Home)
    `CREATE TABLE IF NOT EXISTS material_mastery (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      image VARCHAR(500),
      link VARCHAR(255),
      sort_order INT DEFAULT 0,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

  // Ensure Home, About, Contact pages exist in 'pages' table
  const staticPages = [
    ['Home', 'home', '<h1>Home Page</h1><p>Welcome to Pushpa Arts.</p>'],
    ['About Us', 'about', '<h1>Our Story</h1><p>Born in the historic city of Udaipur...</p>'],
    ['Contact Us', 'contact', '<h1>Get in Touch</h1><p>We would love to hear from you.</p>']
  ];

  for (const [title, slug, content] of staticPages) {
    try {
      await connection.query(
        'INSERT IGNORE INTO pages (title, slug, content) VALUES (?, ?, ?)',
        [title, slug, content]
      );
      console.log(`Page "${title}" ensured.`);
    } catch (err) {
      console.error(`Error creating page "${title}":`, err);
    }
  }

  await connection.end();
  console.log('Database connection closed.');
}

updateSchema().catch(console.error);
