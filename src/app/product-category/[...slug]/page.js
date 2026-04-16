'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function NestedCategoryPage() {
  const params = useParams();
  const slugArray = params.slug || [];
  const currentSlug = slugArray[slugArray.length - 1];

  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    if (!currentSlug) return;

    // Get all categories to find the current one and build breadcrumbs
    fetch(`/api/categories?active_only=true`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data);
          const cat = data.find(c => c.slug === currentSlug);
          setCategory(cat);
        }
      });

    // Get products for this category
    setLoading(true);
    fetch(`/api/products?category_slug=${currentSlug}&page=${page}&limit=12`)
      .then(res => res.json())
      .then(data => {
        if (data.products) {
          setProducts(data.products);
          setPagination(data.pagination);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [currentSlug, page]);

  // Function to build breadcrumbs based on the slug array
  const renderBreadcrumbs = () => {
    const breadcrumbs = [];
    let currentPath = '/product-category';

    slugArray.forEach((slug, index) => {
      const cat = categories.find(c => c.slug === slug);
      currentPath += `/${slug}`;
      const name = cat ? cat.name : slug;
      
      breadcrumbs.push(
        <span key={slug}>
          <span style={{ opacity: 0.3 }}> / </span>
          {index === slugArray.length - 1 ? (
            <span style={{ color: 'var(--color-gold)' }}>{name}</span>
          ) : (
            <Link href={currentPath} style={{ opacity: 0.6 }}>{name}</Link>
          )}
        </span>
      );
    });

    return (
      <div className="breadcrumb" style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}>
        <Link href="/" style={{ opacity: 0.6 }}>Home</Link>
        {breadcrumbs}
      </div>
    );
  };

  const subCategories = category ? categories.filter(c => c.parent_id === category.id) : [];

  return (
    <>
      <div className="page-banner reveal">
        <div className="container" style={{ padding: '8rem 0 4rem' }}>
          <span className="gold-accent uppercase ls-2">Collection</span>
          <h1 style={{ marginTop: '1rem', fontSize: '4rem' }}>
            {category?.name || <span className="gold-accent">Loading...</span>}
          </h1>
          <div className="gold-line" style={{ margin: '2rem 0' }}></div>
          {renderBreadcrumbs()}
        </div>
      </div>

      <section className="section" style={{ background: 'var(--color-bg-primary)' }}>
        <div className="container">
          {category?.description && (
            <p className="editorial-p" style={{ marginBottom: '6rem', maxWidth: '800px' }}>
              {category.description}
            </p>
          )}

          {/* Sub-categories section */}
          {subCategories.length > 0 && (
            <div style={{ marginBottom: '8rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2rem', margin: 0 }}>Explore <span className="gold-accent">Sub-Collections</span></h2>
                <div style={{ flex: 1, height: '1px', background: 'var(--color-border-light)' }}></div>
              </div>
              <div className="categories-grid" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                gap: '2.5rem' 
              }}>
                {subCategories.map(subCat => (
                  <div key={subCat.id} className="reveal">
                    <Link href={`/product-category/${subCat.slug_path}`} className="category-card" style={{ height: '350px' }}>
                      <div 
                        className="category-card-image" 
                        style={{ backgroundImage: subCat.image ? `url(${subCat.image})` : 'none', height: '100%' }}
                      >
                        {!subCat.image && <div className="no-image">Artistic Texture</div>}
                      </div>
                      <div className="category-card-overlay">
                        <p className="category-card-count">Discovery Sub-Collection</p>
                        <h3>{subCat.name}</h3>
                        <span className="category-card-link">Explore Collection</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', margin: 0 }}>Collection <span className="gold-accent">Masterpieces</span></h2>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-border-light)' }}></div>
          </div>

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
