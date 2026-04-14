-- Pushpa Arts Database Schema
-- Run this SQL in your MySQL database to set up tables

CREATE DATABASE IF NOT EXISTS pushpa_art;
USE pushpa_art;

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
  category_id INT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  meta_title VARCHAR(255),
  meta_description VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
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

-- Insert default settings
INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES
('site_name', 'Pushpa Arts'),
('site_tagline', 'Exquisite Handcrafted Furniture'),
('contact_email', 'info@pushpaexport.com'),
('contact_phone', '+91-XXXXXXXXXX'),
('contact_address', 'Udaipur, Rajasthan, India'),
('whatsapp_number', '+91XXXXXXXXXX');

-- Insert sample categories
INSERT IGNORE INTO categories (name, slug, description, sort_order) VALUES
('Silver Furniture', 'silver-furniture', 'Pure Silver on Hand Carved Ethnic Style Wooden Furniture. Royal and luxurious products.', 1),
('White Metal Furniture', 'white-metal-furniture', 'Wood covered with white metal sheet. Looks like silver but at affordable prices.', 2),
('Marble & Stone Furniture', 'marble-stone-furniture', 'Made from different kinds of stones - White Marble, Pink Sandstone, Red Sandstone and more.', 3),
('Bone Inlay Furniture', 'bone-inlay-furniture', 'Hand Carved pieces of bone pasted on wood to create beautiful floral and geometric designs.', 4),
('MOP Inlay Furniture', 'mop-inlay-furniture', 'Mother of Pearl inlay work on premium wooden furniture.', 5);
