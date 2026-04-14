'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const { slug } = params;

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
        <Link href="/categories" className="btn btn-outline" style={{ marginTop: 'var(--space-lg)' }}>
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
                    <Link href={`/categories/${product.category_slug}`}>{product.category_name}</Link>
                    <span>/</span>
                  </>
                )}
                <span>{product.name}</span>
              </div>

              <h1>{product.name}</h1>

              {product.sku && (
                <div className="sku">SKU: {product.sku}</div>
              )}

              {product.description && (
                <div className="description" dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br/>') }} />
              )}

              <a 
                href={`https://wa.me/?text=Hi, I am interested in ${product.name} (${typeof window !== 'undefined' ? window.location.href : ''})`}
                target="_blank"
                rel="noopener noreferrer"
                className="inquiry-btn"
              >
                💬 Inquire on WhatsApp
              </a>

              <div style={{ marginTop: 'var(--space-lg)' }}>
                <Link href="/contact" className="btn btn-outline">
                  ✉ Send Inquiry
                </Link>
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
