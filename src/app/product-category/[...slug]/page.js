import { getAllCategoriesWithPaths } from '@/lib/categories';
import { getProductsByCategory } from '@/lib/products';
import CollectionPageClient from './CollectionPageClient';

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const currentSlug = slug[slug.length - 1];
  const allCategories = await getAllCategoriesWithPaths();
  const category = allCategories.find(c => c.slug === currentSlug);

  if (!category) {
    return {
      title: 'Collection Not Found | Pushpa Exports',
    };
  }

  return {
    title: `Premium ${category.name} | Handcrafted Luxury Furniture | Pushpa Exports`,
    description: category.description || `Exquisite handcrafted ${category.name} collection from Udaipur. Manufacturers and exporters of bespoke luxury furniture pieces.`,
    alternates: {
      canonical: `https://pushpaexports.com/product-category/${category.slug_path}`,
    }
  };
}

export default async function NestedCategoryPage({ params }) {
  const { slug } = await params;
  const currentSlug = slug[slug.length - 1];

  const allCategories = await getAllCategoriesWithPaths();
  const category = allCategories.find(c => c.slug === currentSlug);
  const { products, pagination } = await getProductsByCategory(currentSlug, 1, 12);

  return (
    <>
      {/* Structured Data (JSON-LD) */}
      {category && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": category.name,
                "description": category.description || "A curated collection of handcrafted luxury furniture masterpieces.",
                "url": `https://pushpaexports.com/product-category/${category.slug_path}`,
                "mainEntity": {
                  "@type": "ItemList",
                  "itemListElement": products.map((product, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "url": `https://pushpaexports.com/shop/${category.slug_path}/${product.slug}`
                  }))
                }
              })
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://pushpaexports.com"
                  },
                  ...slug.map((s, index) => ({
                    "@type": "ListItem",
                    "position": index + 2,
                    "name": s.replace(/-/g, ' '),
                    "item": `https://pushpaexports.com/product-category/${slug.slice(0, index + 1).join('/')}`
                  }))
                ]
              })
            }}
          />
        </>
      )}
      <CollectionPageClient
        category={category}
        initialProducts={products}
        initialPagination={pagination}
        categories={allCategories}
        slugArray={slug}
        currentSlug={currentSlug}
      />
    </>
  );
}
