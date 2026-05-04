import { cache } from 'react';
import { query } from './db';

export const getAllCategoriesWithPaths = cache(async function getAllCategoriesWithPaths() {
  try {
    const sql = `
      SELECT c.*, p.name as parent_name,
      (SELECT COUNT(*) FROM product_categories pc WHERE pc.category_id = c.id) as product_count
      FROM categories c 
      LEFT JOIN categories p ON c.parent_id = p.id 
      WHERE c.is_active = 1
      ORDER BY c.sort_order ASC, c.name ASC
    `;
    const allCategories = await query(sql);

    // Build category map for path resolution
    const categoryMap = new Map();
    allCategories.forEach(cat => categoryMap.set(cat.id, cat));

    const getSlugPath = (cat) => {
      let path = cat.slug;
      let current = cat;
      while (current.parent_id && categoryMap.has(current.parent_id)) {
        current = categoryMap.get(current.parent_id);
        path = `${current.slug}/${path}`;
      }
      return path;
    };

    return allCategories.map(cat => ({
      ...cat,
      slug_path: getSlugPath(cat)
    }));
  } catch (error) {
    console.error('Error in getAllCategoriesWithPaths:', error);
    return [];
  }
});
