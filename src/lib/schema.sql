-- Pushpa Arts Database Schema & Seeding
-- Run this SQL in your MySQL database to set up tables and initial data.
-- This file manages the complete schema and dummy seed data in one place.

CREATE DATABASE IF NOT EXISTS pushpa_art;
USE pushpa_art;

-- ==========================================
-- 1. SCHEMA DEFINITION
-- ==========================================

CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `short_description` varchar(500) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `product_categories` (
  `product_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`product_id`,`category_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `product_categories_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `product_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `product_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_primary` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- CMS & Studio Page Tables
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` longtext DEFAULT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `blogs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` longtext DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `excerpt` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` longtext DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `client_name` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at?` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Home Page Content Tables
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `hero_slides` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `image` varchar(500) NOT NULL,
  `button_text` varchar(100) DEFAULT 'Explore Collection',
  `button_link` varchar(255) DEFAULT '/',
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `material_mastery` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description?` text DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `content` text NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `rating` int(11) DEFAULT 5,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `logo` varchar(500) DEFAULT NULL,
  `website_url` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Utility Tables
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `faqs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question` text NOT NULL,
  `answer` text NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `sort_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `contact_inquiries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` enum('new','read','replied','archived') DEFAULT 'new',
  `admin_notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;











-- Pushpa Arts Dummy Data Seed Script
-- Run this after schema.sql to populate the CMS and UI sections

-- 1. Hero Slides
INSERT INTO `hero_slides` (`title`, `subtitle`, `image`, `button_text`, `button_link`, `sort_order`) VALUES
('The Art of Inlay', 'Handcrafted Bone Inlay & Mother of Pearl Masterpieces from Udaipur.', '/images/hero/hero-1.png', 'Explore Collection', '/product-category/bone-inlay-furniture', 1),
('Royal Silver Heritage', 'Exquisite Silver Embossed Furniture for the Discerning Interior.', '/images/hero/hero-2.png', 'View Silver Collection', '/product-category/silver-furniture', 2),
('Marble Elegance', 'Bespoke Stone Inlay pieces inspired by the palaces of Rajasthan.', '/images/hero/hero-3.png', 'Discover Marble', '/product-category/marble-stone-furniture', 3);

-- 2. Material Mastery
INSERT INTO `material_mastery` (`title`, `description`, `image`, `link`, `sort_order`) VALUES
('Ethical Bone Inlay', 'Meticulously hand-carved camel bone set in organic resin.', '/images/materials/bone-inlay.jpg', '/material-mastery/bone-inlay', 1),
('Sterling Silver Work', 'Traditional Thikaikari technique using 99% pure silver foil.', '/images/materials/silver.jpg', '/material-mastery/silver', 2),
('Mother of Pearl', 'Iridescent ocean treasures meeting land-based craftsmanship.', '/images/materials/mop.jpg', '/material-mastery/mop', 3);

-- 3. Testimonials
INSERT INTO `testimonials` (`name`, `designation`, `content`, `rating`, `sort_order`) VALUES
('Julianne Moore', 'Interior Designer, London', 'The level of detail in the bone inlay chest we received is simply breathtaking. It is the centerpiece of our latest project.', 5, 1),
('Rajesh Mehta', 'Architect, Dubai', 'Pushpa Exports delivers the authentic soul of Udaipur with professional logistics that match international standards.', 5, 2),
('Sophie Laurent', 'Collector, Paris', 'Commissioning a silver-embossed bed was a seamless experience. Truly royal craftsmanship.', 5, 3);

-- 4. FAQs
INSERT INTO `faqs` (`question`, `answer`, `sort_order`) VALUES
('Do you ship internationally?', 'Yes, we provide worldwide white-glove shipping from our studio in Udaipur to your doorstep, handling all export documentation and insurance.', 1),
('Can I customize the dimensions?', 'Absolutely. As a bespoke studio, every piece can be tailored to your specific architectural requirements and aesthetic preferences.', 2),
('How do I maintain my inlay furniture?', 'Clean with a soft, slightly damp cloth. Avoid harsh chemicals and direct sunlight to preserve the organic resin and delicate inlay work.', 3);

-- 5. Clients (Logos)
INSERT INTO `clients` (`name`, `logo`, `sort_order`) VALUES
('The Taj Group', '/images/clients/taj.png', 1),
('Oberoi Hotels', '/images/clients/oberoi.png', 2),
('Aman Resorts', '/images/clients/aman.png', 3);

-- 6. Sample Blog Post
INSERT INTO `blogs` (`title`, `slug`, `excerpt`, `content`, `image`) VALUES
('The History of Bone Inlay in Udaipur', 'history-of-bone-inlay-udaipur', 'Discover how an ancient Egyptian craft became the heartbeat of Rajasthani furniture.', '<p>The art of bone inlay is a centuries-old tradition that found its true home in the princely state of Mewar...</p>', '/images/blog/blog-1.jpg');

-- 7. Site Settings
INSERT INTO `site_settings` (`setting_key`, `setting_value`) VALUES
('contact_email', 'info@pushpaexports.com'),
('contact_phone', '+91 94141 62629'),
('contact_address', 'Plot No. 1, Udaipur, Rajasthan, India'),
('whatsapp_number', '919414162629'),
('instagram_url', 'https://instagram.com/pushpaexports'),
('facebook_url', 'https://facebook.com/pushpaexports');
