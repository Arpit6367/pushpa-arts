'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function CategoryDetailPage() {
  const params = useParams();
  const { slug } = params;

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
      <div className="page-banner">
        <h1>{category?.name || <span className="gold-accent">Loading...</span>}</h1>
        <div className="gold-line"></div>
        <div className="breadcrumb">
          <Link href="/">Home</Link> <span>/</span>
          <Link href="/categories">Categories</Link> <span>/</span>
          <span>{category?.name}</span>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {category?.description && (
            <p className="section-subtitle" style={{ marginBottom: 'var(--space-3xl)' }}>
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
                <div className="pagination">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      className={p === page ? 'active' : ''}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="empty-state">
              <h3>No products in this category</h3>
              <p>Products will appear here once added from the admin panel.</p>
              <Link href="/categories" className="btn btn-outline" style={{ marginTop: 'var(--space-lg)' }}>
                ← Browse Other Categories
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
