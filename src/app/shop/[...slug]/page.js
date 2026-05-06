import { getProductBySlug } from '@/lib/products';
import ProductDetailClient from './ProductDetailClient';

export const revalidate = 3600; // revalidate every hour

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const productSlug = slug[slug.length - 1];
  const product = await getProductBySlug(productSlug);

  if (!product) {
    return {
      title: 'Masterpiece Not Found | Pushpa Exports',
    };
  }

  return {
    title: `${product.name} | Handcrafted Luxury ${product.category_name} | Pushpa Exports`,
    description: product.meta_description || product.short_description || `Exquisite handcrafted ${product.name} from Udaipur. Discover the royal heritage of ${product.category_name} by Pushpa Exports.`,
    openGraph: {
      title: `${product.name} | Pushpa Exports`,
      description: product.meta_description || product.short_description,
      images: product.images?.[0] ? [{ url: product.images[0].file_path }] : [],
    },
    alternates: {
      canonical: `https://pushpaexports.com/shop/${product.category_slug_path}/${product.slug}`,
    }
  };
}

export default async function ShopProductDetailPage({ params }) {
  const { slug } = await params;
  const productSlug = slug[slug.length - 1];
  const product = await getProductBySlug(productSlug);

  return (
    <>
      {/* Structured Data (JSON-LD) */}
      {product && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                "name": product.name,
                "description": product.description?.replace(/<[^>]*>?/gm, '').substring(0, 160),
                "image": product.images?.map(img => img.file_path),
                "sku": product.sku || '',
                "brand": {
                  "@type": "Brand",
                  "name": "Pushpa Exports"
                },
                "offers": {
                  "@type": "Offer",
                  "url": `https://pushpaexports.com/shop/${product.category_slug_path}/${product.slug}`,
                  "priceCurrency": "INR",
                  "availability": "https://schema.org/InStock",
                  "seller": {
                    "@type": "Organization",
                    "name": "Pushpa Exports"
                  }
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
                  ...(product.category_slug_path ? product.category_slug_path.split('/').map((part, index) => ({
                    "@type": "ListItem",
                    "position": index + 2,
                    "name": part.replace(/-/g, ' '),
                    "item": `https://pushpaexports.com/product-category/${product.category_slug_path.split('/').slice(0, index + 1).join('/')}`
                  })) : []),
                  {
                    "@type": "ListItem",
                    "position": (product.category_slug_path?.split('/').length || 0) + 2,
                    "name": product.name,
                    "item": `https://pushpaexports.com/shop/${product.category_slug_path}/${product.slug}`
                  }
                ]
              })
            }}
          />
        </>
      )}
      <ProductDetailClient product={product} />
    </>
  );
}
