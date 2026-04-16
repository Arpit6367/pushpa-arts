import { query } from './db';
import { getAllCategoriesWithPaths } from './categories';

export async function getProductBySlug(slug) {
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
      category_slug_path: winningCat ? winningCat.slug_path : (p.category_slug || 'uncategorized'),
      categories: categoriesWithPaths,
      images,
      related_products: related
    };
  } catch (error) {
    console.error('Error in getProductBySlug:', error);
    return null;
  }
}

export async function getProductsByCategory(categorySlug, page = 1, limit = 12) {
  try {
    const offset = (page - 1) * limit;

    const sql = `
      SELECT p.*,
      (SELECT file_path FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1) as primary_image,
      (SELECT file_path FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC, sort_order ASC LIMIT 1) as first_image
      FROM products p
      WHERE EXISTS (
        SELECT 1 FROM product_categories pc 
        JOIN categories cat ON pc.category_id = cat.id 
        WHERE pc.product_id = p.id AND cat.slug = ?
      )
      AND p.is_active = TRUE
      ORDER BY p.sort_order ASC, p.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const products = await query(sql, [categorySlug, limit, offset]);

    const countSql = `
      SELECT COUNT(*) as total FROM products p
      WHERE EXISTS (
        SELECT 1 FROM product_categories pc 
        JOIN categories cat ON pc.category_id = cat.id 
        WHERE pc.product_id = p.id AND cat.slug = ?
      )
      AND p.is_active = TRUE
    `;
    const countResult = await query(countSql, [categorySlug]);
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
}
