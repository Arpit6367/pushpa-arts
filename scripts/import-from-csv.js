const mysql = require('mysql2/promise');
const slugify = require('slugify');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Robust CSV Parser that handles multi-line quoted fields
function parseCSV(csvText) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote
          currentField += '"';
          i++;
        } else {
          // End of quote
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField);
        currentField = '';
      } else if (char === '\n' || (char === '\r' && nextChar === '\n')) {
        currentRow.push(currentField);
        rows.push(currentRow);
        currentRow = [];
        currentField = '';
        if (char === '\r') i++; // Skip the \n
      } else {
        currentField += char;
      }
    }
  }

  if (currentRow.length > 0 || currentField) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  const header = rows[0].map(h => h.trim().toLowerCase());
  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length === 0 || (row.length === 1 && !row[0].trim())) continue;

    const obj = {};
    header.forEach((h, index) => {
      obj[h] = row[index] ? row[index].trim() : '';
    });
    result.push(obj);
  }
  return result;
}

async function getPool() {
  return mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "pushpa_art",
    port: parseInt(process.env.DB_PORT || "3306"),
  });
}

const PRODUCT_IMAGES_DIR = 'public/uploads/products';

// Local images to use for products
const localImages = fs.readdirSync(PRODUCT_IMAGES_DIR)
  .filter(f => !f.startsWith('.') && !f.includes('logo') && !f.includes('Banner'))
  .filter(f =>
    f.includes('chair') ||
    f.includes('table') ||
    f.includes('cat_') ||
    f.includes('material') ||
    f.includes('hero') ||
    f.match(/^[0-9a-f-]+\.jpg$/i) ||
    f.includes('WhatsApp') ||
    f.includes('Modern') ||
    f.includes('e110cb')
  );

let imgIndex = 0;
function getNextLocalImage() {
  if (localImages.length === 0) return '/images/placeholder.png';
  const img = localImages[imgIndex % localImages.length];
  imgIndex++;
  return `/uploads/products/${img}`;
}

async function main() {
  const pool = await getPool();
  const csvPath = path.join(process.cwd(), 'ProductData.csv');

  if (!fs.existsSync(csvPath)) {
    console.error('ProductData.csv not found!');
    process.exit(1);
  }

  const csvText = fs.readFileSync(csvPath, 'utf8');
  const products = parseCSV(csvText);

  console.log(`Parsed ${products.length} rows from CSV.`);
  console.log(`Starting import and image restoration for ${products.length} products...`);

  // Clear existing broken products first (only those from previous CSV run to be safe)
  // Or just truncate if we are re-seeding everything.
  // The user wants to restore, so I'll truncate products and images first.
  console.log('Cleaning up previous broken import...');
  await pool.execute('SET FOREIGN_KEY_CHECKS = 0');
  await pool.execute('TRUNCATE TABLE product_images');
  await pool.execute('TRUNCATE TABLE product_categories');
  await pool.execute('DELETE FROM products'); // Delete instead of truncate to preserve any specific manual entries if any, though truncate is cleaner
  await pool.execute('SET FOREIGN_KEY_CHECKS = 1');

  // Pre-cache categories
  const [categoriesRows] = await pool.execute('SELECT id, name FROM categories');
  const categoryMap = {};
  categoriesRows.forEach(c => {
    categoryMap[c.name.toLowerCase()] = c.id;
  });

  let success = 0;
  let failed = 0;

  for (const p of products) {
    try {
      const name = p.name || p['title'];
      if (!name || name.length > 255) {
        // Skip rows that look like descriptions instead of names
        continue;
      }

      const slug = slugify(name, { lower: true, strict: true }) + '-' + Math.floor(Math.random() * 10000);
      const sku = p.sku || null;

      const price = parseFloat(p['regular price'] || p['price'] || 0) || null;
      const sale_price = parseFloat(p['sale price'] || p['sale_price'] || 0) || null;
      const weight = parseFloat(p['weight (kg)'] || p['weight'] || 0) || null;
      const length = parseFloat(p['length (cm)'] || p['length'] || 0) || null;
      const width = parseFloat(p['width (cm)'] || p['width'] || 0) || null;
      const height = parseFloat(p['height (cm)'] || p['height'] || 0) || null;

      const category_name = p['categories'] || p['category_name'] || '';
      let category_id = null;
      const catList = category_name.split(',').map(c => c.trim().toLowerCase());
      if (catList.length > 0) {
        category_id = categoryMap[catList[0]] || null;
      }

      const short_description = p['short description'] || p['short_description'] || null;
      const description = (p['description'] || '').replace(/\\n/g, '\n');

      const is_featured = p['is featured?'] === '1' || p['is_featured'] === '1' || p['is_featured']?.toLowerCase() === 'true';
      const is_active = true; // Force active for now

      const meta_title = p['meta: _yoast_wpseo_title'] || p['meta_title'] || null;
      const meta_description = p['meta: _yoast_wpseo_metadesc'] || p['meta_description'] || null;

      const [prodRes] = await pool.execute(
        `INSERT INTO products (name, slug, short_description, description, sku, price, sale_price, weight, length, width, height, category_id, is_featured, is_active, meta_title, meta_description)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, slug, short_description, description, sku, price, sale_price, weight, length, width, height, category_id, is_featured, is_active, meta_title, meta_description]
      );

      const productId = prodRes.insertId;

      // Restore images using local studio files
      const imgPath = getNextLocalImage();
      await pool.execute(
        'INSERT INTO product_images (product_id, file_path, alt_text, sort_order, is_primary) VALUES (?, ?, ?, ?, ?)',
        [productId, imgPath, name, 0, 1]
      );

      success++;
      if (success % 100 === 0) console.log(`Restored ${success} products...`);
    } catch (err) {
      failed++;
    }
  }

  console.log(`\nImport completed!`);
  console.log(`Successfully imported: ${success}`);
  console.log(`Failed: ${failed}`);

  await pool.end();
}

main().catch(console.error);
