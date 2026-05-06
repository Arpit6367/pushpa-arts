const axios = require('axios');
const cheerio = require('cheerio');
const mysql = require('mysql2/promise');
const slugify = require('slugify');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const BASE_URL = 'https://pushpaexport.com/';
const PRODUCT_IMAGES_DIR = 'public/uploads/products';

// Local images to use for products/categories
const localImages = fs.readdirSync(PRODUCT_IMAGES_DIR)
  .filter(f => !f.startsWith('.') && !f.includes('logo') && !f.includes('Banner'))
  .filter(f =>
    f.includes('chair') ||
    f.includes('table') ||
    f.includes('cat_') ||
    f.includes('material') ||
    f.includes('hero') ||
    f.match(/^[0-9a-f-]+\.jpg$/i) ||
    f.includes('WhatsApp')
  );

let imgIndex = 0;
function getNextLocalImage() {
  if (localImages.length === 0) return '/images/placeholder.png';
  const img = localImages[imgIndex % localImages.length];
  imgIndex++;
  return `/uploads/products/${img}`;
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

const processedUrls = new Set();

async function scrapeAndSeed(url, pool, parentId = null) {
  if (processedUrls.has(url)) return;
  processedUrls.add(url);

  console.log(`\nNavigating to: ${url}`);
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // 1. Check for subcategories
    const subCategories = $('li.product-category');
    if (subCategories.length > 0) {
      console.log(`Found ${subCategories.length} subcategories.`);
      for (const el of subCategories) {
        const link = $(el).find('a');
        const name = link.find('h2').text().trim() || link.text().trim();
        const subUrl = link.attr('href');

        if (!name || !subUrl) continue;

        const slug = slugify(name, { lower: true, strict: true });
        console.log(`  Adding Category: ${name} (Parent: ${parentId})`);

        try {
          const [res] = await pool.execute(
            'INSERT INTO categories (name, slug, parent_id, image, is_active) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE image = VALUES(image), parent_id = VALUES(parent_id), is_active = 1',
            [name, slug, parentId, getNextLocalImage(), 1]
          );

          let catId;
          if (res.insertId) {
            catId = res.insertId;
          } else {
            const [rows] = await pool.execute('SELECT id FROM categories WHERE slug = ?', [slug]);
            catId = rows[0]?.id;
          }

          if (catId) {
            await scrapeAndSeed(subUrl, pool, catId);
          }
        } catch (e) {
          console.error(`  Error adding category ${name}:`, e.message);
        }
      }
    }

    // 2. Check for products
    const products = $('li.product:not(.product-category)');
    if (products.length > 0) {
      console.log(`Found ${products.length} products on this page.`);
      for (const el of products) {
        const name = $(el).find('.woocommerce-loop-product__title').text().trim() || $(el).find('h2').text().trim();

        if (!name) continue;

        const slug = slugify(name, { lower: true, strict: true });
        const sku = slug.substring(0, 50);

        console.log(`    Adding Product: ${name} (Cat: ${parentId})`);

        try {
          // Insert Product
          const [prodRes] = await pool.execute(
            'INSERT INTO products (name, slug, sku, category_id, is_active) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE category_id = VALUES(category_id), is_active = 1',
            [name, slug, sku, parentId, 1]
          );

          let productId;
          if (prodRes.insertId) {
            productId = prodRes.insertId;
          } else {
            const [rows] = await pool.execute('SELECT id FROM products WHERE slug = ?', [slug]);
            productId = rows[0]?.id;
          }

          if (productId) {
            // Link product to category
            if (parentId) {
              await pool.execute(
                'INSERT IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)',
                [productId, parentId]
              );
            }

            // Insert/Update Image
            const imgPath = getNextLocalImage();
            await pool.execute(
              'INSERT INTO product_images (product_id, file_path, alt_text, is_primary) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE file_path = VALUES(file_path)',
              [productId, imgPath, name, 1]
            );
          }
        } catch (e) {
          console.error(`Error adding product ${name}:`, e.message);
        }
      }
    }

    // Handle Pagination
    const nextLink = $('a.next.page-numbers').attr('href');
    if (nextLink) {
      console.log(`Following pagination: ${nextLink}`);
      await scrapeAndSeed(nextLink, pool, parentId);
    }

  } catch (error) {
    console.error(`Error processing ${url}:`, error.message);
  }
}

async function main() {
  const pool = await getPool();
  console.log('Starting Scraper with exact Navbar categories (Roots first)...');

  try {
    const navbarCategories = [
      { name: 'Silver Furniture', url: 'https://pushpaexport.com/product-category/silver-furniture/' },
      { name: 'White Metal Furniture', url: 'https://pushpaexport.com/product-category/white-metal-furniture/' },
      { name: 'Marble & Stone Furniture', url: 'https://pushpaexport.com/product-category/marble-stone-furniture/' },
      { name: 'Bone Inlay Furniture', url: 'https://pushpaexport.com/product-category/bone-inlay-furniture/' },
      { name: 'MOP Inlay Furniture', url: 'https://pushpaexport.com/product-category/mop-inlay-furniture/' },
      { name: 'Glass Inlay Work', url: 'https://pushpaexport.com/product-category/glass-inlay-work/' },
      { name: 'Carved Furniture', url: 'https://pushpaexport.com/product-category/carved-furniture/' },
      { name: 'Semi Precious Stone Furniture', url: 'https://pushpaexport.com/product-category/semi-precious-stone-furniture/' }
    ];

    // 1. Insert ALL root categories first to fix the navbar immediately
    console.log('Registering root categories...');
    const rootIds = [];
    for (const cat of navbarCategories) {
      const slug = slugify(cat.name, { lower: true, strict: true });
      const [res] = await pool.execute(
        'INSERT INTO categories (name, slug, image, is_active) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE is_active = 1',
        [cat.name, slug, getNextLocalImage(), 1]
      );

      let catId;
      if (res.insertId) {
        catId = res.insertId;
      } else {
        const [rows] = await pool.execute('SELECT id FROM categories WHERE slug = ?', [slug]);
        catId = rows[0]?.id;
      }
      rootIds.push({ ...cat, id: catId });
    }

    // 2. Now run the deep scrape for each root
    for (const cat of rootIds) {
      console.log(`\n--- Deep Scrape: ${cat.name} ---`);
      await scrapeAndSeed(cat.url, pool, cat.id);
    }

    console.log('\nNavbar-based seeding completed successfully!');
  } catch (error) {
    console.error('Seeding process failed:', error);
  } finally {
    await pool.end();
  }
}

main();
