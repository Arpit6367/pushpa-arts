import { cache } from 'react';
import { query } from './db';
import { getAllCategoriesWithPaths } from './categories';

export const getProductBySlug = cache(async function getProductBySlug(slug) {
  try {
    const allCategories = await getAllCategoriesWithPaths();
    const categoryMap = new Map();
    allCategories.forEach(c => categoryMap.set(c.id, c));

    const productsResult = await query(
      'SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = ?',
      [slug]
    );

    if (productsResult.length === 0) return null;

    const p = productsResult[0];

    // Get all associated categories
    const productCategories = await query(
      'SELECT c.id, c.name, c.slug FROM categories c JOIN product_categories pc ON c.id = pc.category_id WHERE pc.product_id = ?',
      [p.id]
    );

    // Add paths to product categories
    const categoriesWithPaths = productCategories.map(c => ({
      ...c,
      slug_path: categoryMap.get(c.id)?.slug_path || c.slug
    }));

    // Find the category with the longest path (deepest nesting)
    const winningCat = categoriesWithPaths.reduce((prev, curr) => {
      const prevDepth = prev.slug_path.split('/').length;
      const currDepth = curr.slug_path.split('/').length;
      return currDepth > prevDepth ? curr : prev;
    }, categoriesWithPaths[0] || null);

    // Get images
    const images = await query(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC',
      [p.id]
    );

    // Get related products
    const related = await query(
      `SELECT p.*, 
        (SELECT file_path FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, sort_order ASC LIMIT 1) as first_image
       FROM products p WHERE p.category_id = ? AND p.id != ? AND p.is_active = TRUE ORDER BY RAND() LIMIT 4`,
      [p.category_id, p.id]
    );

    return {
      ...p,
      category_name: winningCat ? winningCat.name : p.category_name,
      category_slug: winningCat ? winningCat.slug : p.category_slug,
      category_slug_path: winningCat ? winningCat.slug_path : (p.category_slug || 'collection'),
      categories: categoriesWithPaths,
      images,
      related_products: related.map(rp => ({
        ...rp,
        category_slug_path: categoryMap.get(rp.category_id)?.slug_path || p.category_slug_path || 'collection'
      }))
    };
  } catch (error) {
    console.error('Error in getProductBySlug:', error);
    return null;
  }
});

export const getProductsByCategory = cache(async function getProductsByCategory(categorySlug, page = 1, limit = 12) {
  try {
    const offset = (page - 1) * limit;

    // Get all categories to find children
    const allCategories = await getAllCategoriesWithPaths();
    const category = allCategories.find(c => c.slug === categorySlug);
    
    if (!category) return { products: [], pagination: { page: 1, limit, total: 0, pages: 0 } };

    // Recursively find all child category IDs
    const getChildIds = (parentId) => {
      const children = allCategories.filter(c => c.parent_id === parentId);
      let ids = [parentId];
      children.forEach(child => {
        ids = [...ids, ...getChildIds(child.id)];
      });
      return ids;
    };

    const categoryIds = getChildIds(category.id);

    const sql = `
      SELECT p.*,
      (SELECT file_path FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image,
      (SELECT file_path FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, sort_order ASC LIMIT 1) as first_image
      FROM products p
      WHERE EXISTS (
        SELECT 1 FROM product_categories pc 
        WHERE pc.product_id = p.id AND pc.category_id IN (${categoryIds.join(',')})
      )
      AND p.is_active = TRUE
      ORDER BY p.sort_order ASC, p.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const products = (await query(sql, [limit, offset])).map(p => ({
      ...p,
      category_slug_path: category.slug_path
    }));

    const countSql = `
      SELECT COUNT(*) as total FROM products p
      WHERE EXISTS (
        SELECT 1 FROM product_categories pc 
        WHERE pc.product_id = p.id AND pc.category_id IN (${categoryIds.join(',')})
      )
      AND p.is_active = TRUE
    `;
    const countResult = await query(countSql);
    const total = countResult[0]?.total || 0;

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error in getProductsByCategory:', error);
    return { products: [], pagination: { page: 1, limit, total: 0, pages: 0 } };
  }
});

export const getFeaturedMasterpieces = cache(async function getFeaturedMasterpieces(limit = 6) {
  try {
    const sql = `
      SELECT p.*,
      (SELECT file_path FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image,
      (SELECT file_path FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, sort_order ASC LIMIT 1) as first_image,
      c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_featured = TRUE AND p.is_active = TRUE
      ORDER BY p.sort_order ASC, p.created_at DESC
      LIMIT ?
    `;
    const products = await query(sql, [limit]);

    // For each product, we need its full category path for routing
    const allCategories = await getAllCategoriesWithPaths();
    const categoryMap = new Map();
    allCategories.forEach(cat => categoryMap.set(cat.id, cat));

    return products.map(p => ({
      ...p,
      category_slug_path: (categoryMap.get(p.category_id) || categoryMap.get(String(p.category_id)))?.slug_path || p.category_slug || 'collection'
    }));
  } catch (error) {
    console.error('Error in getFeaturedMasterpieces:', error);
    return [];
  }
});

/** New Arrivals — most recently added active products */
export const getNewArrivals = cache(async function getNewArrivals(limit = 8) {
  try {
    const sql = `
      SELECT p.*,
      (SELECT file_path FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image,
      (SELECT file_path FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, sort_order ASC LIMIT 1) as first_image,
      c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = TRUE
      ORDER BY p.created_at DESC
      LIMIT ?
    `;
    const products = await query(sql, [limit]);
    const allCategories = await getAllCategoriesWithPaths();
    const categoryMap = new Map();
    allCategories.forEach(cat => categoryMap.set(cat.id, cat));
    return products.map(p => ({
      ...p,
      category_slug_path: (categoryMap.get(p.category_id) || categoryMap.get(String(p.category_id)))?.slug_path || p.category_slug || 'collection'
    }));
  } catch (error) {
    console.error('Error in getNewArrivals:', error);
    return [];
  }
});

/** Best Sellers — featured products + products from premium categories (Silver, Marble, White Metal) */
export const getBestSellers = cache(async function getBestSellers(limit = 8) {
  try {
    const premiumSlugs = ['silver-furniture', 'marble-stone-furniture', 'white-metal-furniture'];
    const placeholders = premiumSlugs.map(() => '?').join(',');
    const sql = `
      SELECT DISTINCT p.*,
      (SELECT file_path FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image,
      (SELECT file_path FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, sort_order ASC LIMIT 1) as first_image,
      COALESCE(
        (SELECT cat.name FROM categories cat JOIN product_categories pc2 ON cat.id = pc2.category_id WHERE pc2.product_id = p.id LIMIT 1),
        c.name
      ) as category_name,
      COALESCE(
        (SELECT cat.slug FROM categories cat JOIN product_categories pc2 ON cat.id = pc2.category_id WHERE pc2.product_id = p.id LIMIT 1),
        c.slug
      ) as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_categories pc ON pc.product_id = p.id
      LEFT JOIN categories c2 ON pc.category_id = c2.id
      WHERE p.is_active = TRUE
        AND (p.is_featured = TRUE OR c.slug IN (${placeholders}) OR c2.slug IN (${placeholders}))
      ORDER BY p.is_featured DESC, p.sort_order ASC, p.created_at DESC
      LIMIT ?
    `;
    const products = await query(sql, [...premiumSlugs, ...premiumSlugs, limit]);
    const allCategories = await getAllCategoriesWithPaths();
    const categoryMap = new Map();
    allCategories.forEach(cat => categoryMap.set(cat.id, cat));
    return products.map(p => ({
      ...p,
      category_slug_path: (categoryMap.get(p.category_id) || categoryMap.get(String(p.category_id)))?.slug_path || p.category_slug || 'collection'
    }));
  } catch (error) {
    console.error('Error in getBestSellers:', error);
    return [];
  }
});

/** Handcrafted — products from craft-intensive categories (Bone Inlay, MOP, Glass Inlay, Carved) */
export const getHandcraftedProducts = cache(async function getHandcraftedProducts(limit = 8) {
  try {
    const craftSlugs = ['bone-inlay-furniture', 'mop-inlay-furniture', 'glass-inlay-work', 'carved-furniture'];
    const placeholders = craftSlugs.map(() => '?').join(',');
    const sql = `
      SELECT DISTINCT p.*,
      (SELECT file_path FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image,
      (SELECT file_path FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, sort_order ASC LIMIT 1) as first_image,
      COALESCE(
        (SELECT cat.name FROM categories cat JOIN product_categories pc2 ON cat.id = pc2.category_id WHERE pc2.product_id = p.id LIMIT 1),
        c.name
      ) as category_name,
      COALESCE(
        (SELECT cat.slug FROM categories cat JOIN product_categories pc2 ON cat.id = pc2.category_id WHERE pc2.product_id = p.id LIMIT 1),
        c.slug
      ) as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_categories pc ON pc.product_id = p.id
      LEFT JOIN categories c2 ON pc.category_id = c2.id
      WHERE p.is_active = TRUE AND (c.slug IN (${placeholders}) OR c2.slug IN (${placeholders}))
      ORDER BY p.is_featured DESC, p.sort_order ASC, p.created_at DESC
      LIMIT ?
    `;
    const products = await query(sql, [...craftSlugs, ...craftSlugs, limit]);
    const allCategories = await getAllCategoriesWithPaths();
    const categoryMap = new Map();
    allCategories.forEach(cat => categoryMap.set(cat.id, cat));
    return products.map(p => ({
      ...p,
      category_slug_path: (categoryMap.get(p.category_id) || categoryMap.get(String(p.category_id)))?.slug_path || p.category_slug || 'collection'
    }));
  } catch (error) {
    console.error('Error in getHandcraftedProducts:', error);
    return [];
  }
});
