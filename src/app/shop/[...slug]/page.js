import { getProductBySlug } from '@/lib/products';
import ProductDetailClient from './ProductDetailClient';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const productSlug = slug[slug.length - 1];
  const product = await getProductBySlug(productSlug);

  if (!product) {
    return {
      title: 'Masterpiece Not Found | Pushpa Arts',
    };
  }

  return {
    title: `${product.name} | Handcrafted Luxury ${product.category_name} | Pushpa Arts`,
    description: product.meta_description || product.short_description || `Exquisite handcrafted ${product.name} from Udaipur. Discover the royal heritage of ${product.category_name} by Pushpa Arts.`,
    openGraph: {
      title: `${product.name} | Pushpa Arts`,
      description: product.meta_description || product.short_description,
      images: product.images?.[0] ? [{ url: product.images[0].file_path }] : [],
    },
    alternates: {
      canonical: `https://pushpaarts.com/shop/${product.category_slug_path}/${product.slug}`,
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
                  "name": "Pushpa Arts"
                },
                "offers": {
                  "@type": "Offer",
                  "url": `https://pushpaarts.com/shop/${product.category_slug_path}/${product.slug}`,
                  "priceCurrency": "INR",
                  "availability": "https://schema.org/InStock",
                  "seller": {
                    "@type": "Organization",
                    "name": "Pushpa Arts"
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
                    "item": "https://pushpaarts.com"
                  },
                  ...(product.category_slug_path ? product.category_slug_path.split('/').map((part, index) => ({
                    "@type": "ListItem",
                    "position": index + 2,
                    "name": part.replace(/-/g, ' '),
                    "item": `https://pushpaarts.com/product-category/${product.category_slug_path.split('/').slice(0, index + 1).join('/')}`
                  })) : []),
                  {
                    "@type": "ListItem",
                    "position": (product.category_slug_path?.split('/').length || 0) + 2,
                    "name": product.name,
                    "item": `https://pushpaarts.com/shop/${product.category_slug_path}/${product.slug}`
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
