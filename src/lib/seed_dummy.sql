-- Dummy data for Pushpa Arts
USE pushpa_art;

-- Categorize images for existing categories
UPDATE categories SET image = '/uploads/products/silver_chair.png' WHERE slug = 'silver-furniture';
UPDATE categories SET image = '/uploads/products/bone_inlay_table.png' WHERE slug = 'bone-inlay-furniture';

-- Insert sample products
INSERT IGNORE INTO products (name, slug, short_description, description, sku, category_id, is_featured, is_active, sort_order) VALUES
('Royal Silver Carved Chair', 'royal-silver-carved-chair', 'Handcrafted pure silver on hand carved ethnic style wooden chair.', 'This royal chair is meticulously handcrafted by our master artisans in Udaipur. It features intricate carving and is covered with pure silver sheet. Perfect for adding a touch of royalty to your living space.', 'SC-001', (SELECT id FROM categories WHERE slug = 'silver-furniture'), TRUE, TRUE, 1),
('Floral Bone Inlay Console', 'floral-bone-inlay-console', 'Intricate floral pattern bone inlay console table with charcoal background.', 'Our signature bone inlay console table features delicate floral patterns hand-carved from camel bone and set in a charcoal colored resin. Each piece takes weeks of craftsmanship.', 'BI-C01', (SELECT id FROM categories WHERE slug = 'bone-inlay-furniture'), TRUE, TRUE, 1);

-- Insert product images
INSERT IGNORE INTO product_images (product_id, file_path, alt_text, sort_order, is_primary) VALUES
((SELECT id FROM products WHERE slug = 'royal-silver-carved-chair'), '/uploads/products/silver_chair.png', 'Royal Silver Carved Chair', 1, TRUE),
((SELECT id FROM products WHERE slug = 'floral-bone-inlay-console'), '/uploads/products/bone_inlay_table.png', 'Floral Bone Inlay Console Table', 1, TRUE);
