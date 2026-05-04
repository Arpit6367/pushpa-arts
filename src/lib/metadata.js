import { getPageBySlug } from './cms';

/**
 * Common metadata generator for Studio Pages
 * @param {string} slug - The page slug in DB
 * @param {string} fallbackDesc - Default description if meta_description is empty
 */
export async function getStudioPageMetadata(slug, fallbackDesc = '') {
  const page = await getPageBySlug(slug);

  if (!page) {
    return {
      title: 'Pushpa Exports | Luxury Handcrafted Furniture',
      description: fallbackDesc
    };
  }

  return {
    title: `${page.title} | Pushpa Exports`,
    description: page.meta_description || fallbackDesc || `Exquisite handcrafted luxury furniture from Udaipur. Discover ${page.title} by Pushpa Exports.`,
    openGraph: {
      title: `${page.title} | Pushpa Exports`,
      description: page.meta_description || fallbackDesc,
    }
  };
}
