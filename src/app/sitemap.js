import { query } from '@/lib/db';
import { getAllCategoriesWithPaths } from '@/lib/categories';

export default async function sitemap() {
  const baseUrl = 'https://pushpaarts.com';

  // 1. Fetch Categories
  let categories = [];
  try {
    categories = await getAllCategoriesWithPaths();
  } catch (error) {
    console.error('Sitemap: Error fetching categories', error);
  }

  const categoryUrls = categories
    .filter(c => c.is_active)
    .map(c => ({
      url: `${baseUrl}/product-category/${c.slug_path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }));

  // 2. Fetch Products
  let products = [];
  try {
    products = await query(
      `SELECT p.slug, p.updated_at, p.category_id 
       FROM products p 
       WHERE p.is_active = TRUE`
    );
  } catch (error) {
    console.error('Sitemap: Error fetching products', error);
  }

  const categoryMap = new Map();
  categories.forEach(c => categoryMap.set(c.id, c));

  const productUrls = products.map(p => {
    const cat = categoryMap.get(p.category_id);
    const catPath = cat ? cat.slug_path : 'uncategorized';
    return {
      url: `${baseUrl}/shop/${catPath}/${p.slug}`,
      lastModified: p.updated_at || new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    };
  });

  // 3. Static Pages
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/product-category',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : 0.5,
  }));

  return [...staticPages, ...categoryUrls, ...productUrls];
}
