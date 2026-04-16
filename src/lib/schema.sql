-- Pushpa Arts Database Schema & Seeding
-- Run this SQL in your MySQL database to set up tables and initial data.
-- This file manages the complete schema and dummy seed data in one place.

CREATE DATABASE IF NOT EXISTS pushpa_art;
USE pushpa_art;

-- ==========================================
-- 1. SCHEMA DEFINITION
-- ==========================================

-- Categories table (supports parent-child hierarchy)
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  image VARCHAR(500),
  parent_id INT NULL,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  short_description VARCHAR(500),
  description TEXT,
  sku VARCHAR(100),
  category_id INT, -- Legacy categorisation
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  meta_title VARCHAR(255),
  meta_description VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Product-Category relationship table (Many-to-Many)
CREATE TABLE IF NOT EXISTS product_categories (
  product_id INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (product_id, category_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Product images table (multiple images per product)
CREATE TABLE IF NOT EXISTS product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  sort_order INT DEFAULT 0,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. INITIAL SEED DATA
-- ==========================================

-- Insert default settings
INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES
('site_name', 'Pushpa Arts'),
('site_tagline', 'Exquisite Handcrafted Furniture'),
('contact_email', 'info@pushpaexport.com'),
('contact_phone', '+91-XXXXXXXXXX'),
('contact_address', 'Udaipur, Rajasthan, India'),
('whatsapp_number', '+91XXXXXXXXXX');

-- Insert sample categories
INSERT IGNORE INTO categories (name, slug, description, image, sort_order) VALUES
('Silver Furniture', 'silver-furniture', 'Pure Silver on Hand Carved Ethnic Style Wooden Furniture. Royal and luxurious products.', '/uploads/products/silver_chair.png', 1),
('White Metal Furniture', 'white-metal-furniture', 'Wood covered with white metal sheet. Looks like silver but at affordable prices.', NULL, 2),
('Marble & Stone Furniture', 'marble-stone-furniture', 'Made from different kinds of stones - White Marble, Pink Sandstone, Red Sandstone and more.', NULL, 3),
('Bone Inlay Furniture', 'bone-inlay-furniture', 'Hand Carved pieces of bone pasted on wood to create beautiful floral and geometric designs.', '/uploads/products/bone_inlay_table.png', 4),
('MOP Inlay Furniture', 'mop-inlay-furniture', 'Mother of Pearl inlay work on premium wooden furniture.', NULL, 5);

-- Insert sample products
INSERT IGNORE INTO products (name, slug, short_description, description, sku, category_id, is_featured, is_active, sort_order) VALUES
('Royal Silver Carved Chair', 'royal-silver-carved-chair', 'Handcrafted pure silver on hand carved ethnic style wooden chair.', 'This royal chair is meticulously handcrafted by our master artisans in Udaipur. It features intricate carving and is covered with pure silver sheet. Perfect for adding a touch of royalty to your living space.', 'SC-001', (SELECT id FROM categories WHERE slug = 'silver-furniture'), TRUE, TRUE, 1),
('Floral Bone Inlay Console', 'floral-bone-inlay-console', 'Intricate floral pattern bone inlay console table with charcoal background.', 'Our signature bone inlay console table features delicate floral patterns hand-carved from camel bone and set in a charcoal colored resin. Each piece takes weeks of craftsmanship.', 'BI-C01', (SELECT id FROM categories WHERE slug = 'bone-inlay-furniture'), TRUE, TRUE, 1);

-- Map product-categories for many-to-many bridging
INSERT IGNORE INTO product_categories (product_id, category_id)
SELECT id, category_id FROM products WHERE category_id IS NOT NULL;

-- Insert product images
INSERT IGNORE INTO product_images (product_id, file_path, alt_text, sort_order, is_primary) VALUES
((SELECT id FROM products WHERE slug = 'royal-silver-carved-chair'), '/uploads/products/silver_chair.png', 'Royal Silver Carved Chair', 1, TRUE),
((SELECT id FROM products WHERE slug = 'floral-bone-inlay-console'), '/uploads/products/bone_inlay_table.png', 'Floral Bone Inlay Console Table', 1, TRUE);
