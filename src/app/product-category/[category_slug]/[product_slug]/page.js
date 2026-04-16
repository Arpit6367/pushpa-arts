'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const { product_slug: slug } = params; // Map the new param name to 'slug'

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/products/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.id) {
          setProduct(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="loading" style={{ minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="empty-state" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h3>Product not found</h3>
        <p>The product you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/product-category" className="btn btn-outline" style={{ marginTop: 'var(--space-lg)' }}>
          Browse Products
        </Link>
      </div>
    );
  }

  const images = product.images || [];
  const currentImage = images[activeImage]?.file_path;

  return (
    <>
      <section className="product-detail">
        <div className="container">
          <div className="product-detail-grid">
            {/* Gallery */}
            <div className="product-gallery">
              <div className="product-gallery-main">
                {currentImage ? (
                  <img src={currentImage} alt={product.name} />
                ) : (
                  <div className="no-image" style={{ height: '100%', fontSize: '1.2rem' }}>No Image Available</div>
                )}
              </div>

              {images.length > 1 && (
                <div className="product-gallery-thumbs">
                  {images.map((img, index) => (
                    <div
                      key={img.id}
                      className={`product-gallery-thumb ${index === activeImage ? 'active' : ''}`}
                      onClick={() => setActiveImage(index)}
                    >
                      <img src={img.file_path} alt={img.alt_text || product.name} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="product-info">
              <div className="breadcrumb">
                <Link href="/">Home</Link> <span>/</span>
                {product.category_name && (
                  <>
                    <Link href={`/product-category/${product.category_slug}`}>{product.category_name}</Link>
                    <span>/</span>
                  </>
                )}
                <span>{product.name}</span>
              </div>

              <h1 className="reveal">{product.name}</h1>

              {product.sku && (
                <div className="sku reveal delay-100">SKU: {product.sku}</div>
              )}

              {product.description && (
                <div className="description reveal delay-200" dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br/>') }} />
              )}

              <div className="reveal delay-300">
                <a
                  href={`https://wa.me/?text=Hi, I am interested in ${product.name} (${typeof window !== 'undefined' ? window.location.href : ''})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inquiry-btn"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  💬 Inquire on WhatsApp
                </a>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                  <Link href="/contact" className="btn-premium-outline" style={{ flex: 1, textAlign: 'center' }}>
                    ✉ Email Inquiry
                  </Link>
                </div>
              </div>

              <div className="reveal delay-400" style={{ marginTop: '4rem', padding: '2rem', border: '1px solid var(--color-border-light)', background: 'var(--color-bg-secondary)' }}>
                <span className="gold-accent uppercase ls-2" style={{ fontSize: '0.65rem' }}>Heritage Certification</span>
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: 'var(--color-text-secondary)' }}>Each piece is certified as an authentic Udaipur handcrafted creation, following royal artisan protocols passed down through generations.</p>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {product.related_products && product.related_products.length > 0 && (
            <div style={{ marginTop: 'var(--space-4xl)' }}>
              <h2 className="section-title" style={{ fontSize: '1.8rem' }}>
                Related <span className="gold-accent">Products</span>
              </h2>
              <div className="gold-line"></div>
              <div className="products-grid" style={{ marginTop: 'var(--space-2xl)' }}>
                {product.related_products.map(rp => (
                  <ProductCard key={rp.id} product={rp} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
