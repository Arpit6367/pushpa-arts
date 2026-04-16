'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ categories: 0, products: 0, files: 0, activeProds: 0, featured: 0 });
  const [recentProducts, setRecentProducts] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const catRes = await fetch('/api/categories');
        const catData = await catRes.json();
        if (Array.isArray(catData)) {
          setStats(s => ({ ...s, categories: catData.length }));
          setTopCategories([...catData].sort((a, b) => (b.product_count || 0) - (a.product_count || 0)).slice(0, 4));
        }

        const prodRes = await fetch('/api/products?limit=8');
        const prodData = await prodRes.json();
        if (prodData.products) {
          setRecentProducts(prodData.products);
          const total = prodData.pagination?.total || prodData.products.length;
          const active = prodData.products.filter(p => p.is_active).length; // Estimation logic or add to API
          setStats(s => ({ 
            ...s, 
            products: total,
            activeProds: active,
            featured: prodData.products.filter(p => p.is_featured).length 
          }));
        }

        const fileRes = await fetch('/api/files');
        const fileData = await fileRes.json();
        if (fileData.files) setStats(s => ({ ...s, files: fileData.files.length }));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="admin-header">
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)', marginBottom: '0.5rem', fontWeight: '500' }}>Admin Control Center</p>
          <h1 className="text-admin-accent font-bold">Overview</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/admin/products/new" className="btn btn-primary btn-sm">+ Launch New Product</Link>
        </div>
      </div>

      <div className="admin-content">
        <div className="bento-grid">
          {/* Main Stat: Stock Health */}
          <div className="bento-item large">
            <div className="bento-header">
              <h3>Inventory Health</h3>
              <span style={{ fontSize: '1.5rem' }}>🪴</span>
            </div>
            <div style={{ marginTop: '2.5rem' }}>
              <div className="health-stat">
                <div className="health-label">
                  <span>Collection Visibility</span>
                  <span style={{ color: 'var(--admin-text-primary)', fontWeight: '600' }}>{Math.round((stats.activeProds / (stats.products || 1)) * 100)}% Live</span>
                </div>
                <div className="health-bar">
                  <div className="health-fill primary" style={{ width: `${(stats.activeProds / (stats.products || 1)) * 100}%` }}></div>
                </div>
              </div>

              <div className="health-stat" style={{ marginTop: '2rem' }}>
                <div className="health-label">
                  <span>Categories Utilized</span>
                  <span style={{ color: 'var(--admin-text-primary)', fontWeight: '600' }}>{stats.categories} Sections</span>
                </div>
                <div className="health-bar">
                  <div className="health-fill gold" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bento-item wide">
            <div className="bento-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="quick-action-grid" style={{ marginTop: '1rem' }}>
              <Link href="/admin/products/new" className="quick-action-btn">
                <span className="icon">📦</span>
                <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>New Product</span>
              </Link>
              <Link href="/admin/categories" className="quick-action-btn">
                <span className="icon">📁</span>
                <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Manage Cat</span>
              </Link>
              <Link href="/admin/file-manager" className="quick-action-btn">
                <span className="icon">🖼️</span>
                <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Media Center</span>
              </Link>
            </div>
          </div>

          {/* Featured Highlights */}
          <div className="bento-item">
            <div className="bento-header">
              <h3>Featured</h3>
            </div>
            <h3 style={{ fontSize: '2.5rem', margin: '0.5rem 0', fontWeight: '700' }}>{stats.featured}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)' }}>Showcased on main gallery</p>
          </div>

          {/* Media Count */}
          <div className="bento-item">
            <div className="bento-header">
              <h3>Total Assets</h3>
            </div>
            <h3 style={{ fontSize: '2.5rem', margin: '0.5rem 0', fontWeight: '700' }}>{stats.files}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)' }}>Artisanal media files</p>
          </div>
        </div>

        {/* Recent Products Grid */}
        <div className="admin-card-modern" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Latest Additions</h3>
            <Link href="/admin/products" style={{ fontSize: '0.85rem', color: 'var(--admin-accent)', fontWeight: '600', textDecoration: 'none' }}>View Full Catalog →</Link>
          </div>

          <div className="dashboard-prod-grid">
            {recentProducts.length > 0 ? recentProducts.map(p => (
              <div key={p.id} className="mini-prod-card">
                <div className="mini-prod-image">
                  {(p.primary_image || p.first_image) ? (
                    <img src={p.primary_image || p.first_image} alt={p.name} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc' }}>📷</div>
                  )}
                </div>
                <div className="mini-prod-info">
                  <h4>{p.name}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--admin-text-secondary)' }}>{p.category_name || 'Uncategorized'}</span>
                    <span className={`status-badge ${p.is_active ? 'active' : 'inactive'}`} style={{ fontSize: '0.6rem' }}>{p.is_active ? 'Live' : 'Hidden'}</span>
                  </div>
                </div>
              </div>
            )) : (
              <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#aaa', padding: '2rem' }}>No recent updates</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

