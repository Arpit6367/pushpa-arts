'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function CategoryDetailPage() {
  const params = useParams();
  const { category_slug: slug } = params; // Map the new param name to 'slug'

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    if (!slug) return;

    // Get category info
    fetch(`/api/categories?active_only=true`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const cat = data.find(c => c.slug === slug);
          setCategory(cat);
        }
      });

    // Get products for this category
    setLoading(true);
    fetch(`/api/products?category_slug=${slug}&page=${page}&limit=12`)
      .then(res => res.json())
      .then(data => {
        if (data.products) {
          setProducts(data.products);
          setPagination(data.pagination);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug, page]);

  return (
    <>
      <div className="page-banner reveal">
        <div className="container" style={{ padding: '8rem 0 4rem' }}>
          <span className="gold-accent uppercase ls-2">Collection</span>
          <h1 style={{ marginTop: '1rem', fontSize: '4rem' }}>{category?.name || <span className="gold-accent">Loading...</span>}</h1>
          <div className="gold-line" style={{ margin: '2rem 0' }}></div>
          <div className="breadcrumb" style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}>
            <Link href="/" style={{ opacity: 0.6 }}>Home</Link> <span style={{ opacity: 0.3 }}>/</span>
            <span style={{ color: 'var(--color-gold)' }}>{category?.name}</span>
          </div>
        </div>
      </div>

      <section className="section" style={{ background: 'var(--color-bg-primary)' }}>
        <div className="container">
          {category?.description && (
            <p className="editorial-p" style={{ marginBottom: '6rem', maxWidth: '800px' }}>
              {category.description}
            </p>
          )}

          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : products.length > 0 ? (
            <>
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {pagination && pagination.pages > 1 && (
                <div className="pagination" style={{ marginTop: '6rem' }}>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      className={`pagination-btn ${p === page ? 'active' : ''}`}
                      onClick={() => setPage(p)}
                    >
                      {p < 10 ? `0${p}` : p}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="empty-state" style={{ padding: '10rem 0' }}>
              <h3 style={{ fontStyle: 'italic', opacity: 0.6 }}>No masterpieces in this collection yet.</h3>
              <p style={{ marginTop: '1rem' }}>Our artisans are currently curating new pieces for this collection.</p>
              <Link href="/" className="btn-premium" style={{ marginTop: '3rem', display: 'inline-block' }}>
                Return to Gallery
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
