'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ categories: 0, products: 0, files: 0 });
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    // Get categories count
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setStats(s => ({ ...s, categories: data.length }));
        }
      }).catch(() => {});

    // Get products
    fetch('/api/products?limit=5')
      .then(res => res.json())
      .then(data => {
        if (data.products) {
          setRecentProducts(data.products);
          setStats(s => ({ ...s, products: data.pagination?.total || data.products.length }));
        }
      }).catch(() => {});

    // Get files count
    fetch('/api/files')
      .then(res => res.json())
      .then(data => {
        if (data.files) {
          setStats(s => ({ ...s, files: data.files.length }));
        }
      }).catch(() => {});
  }, []);

  return (
    <>
      <div className="admin-header">
        <h1>Dashboard</h1>
        <Link href="/admin/products/new" className="btn btn-primary btn-sm">+ Add Product</Link>
      </div>

      <div className="admin-content">
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="dashboard-card-icon">📁</div>
            <h3>{stats.categories}</h3>
            <p>Categories</p>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-card-icon">📦</div>
            <h3>{stats.products}</h3>
            <p>Products</p>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-card-icon">🖼️</div>
            <h3>{stats.files}</h3>
            <p>Uploaded Images</p>
          </div>
        </div>

        <div className="admin-table-wrapper">
          <div className="admin-table-header">
            <h3>Recent Products</h3>
            <Link href="/admin/products" className="btn btn-outline btn-sm">View All</Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Featured</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.length > 0 ? recentProducts.map(p => (
                <tr key={p.id}>
                  <td>
                    {(p.primary_image || p.first_image) ? (
                      <img src={p.primary_image || p.first_image} className="thumb" alt={p.name} />
                    ) : (
                      <div className="thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#666' }}>No img</div>
                    )}
                  </td>
                  <td><Link href={`/admin/products/${p.id}/edit`} style={{ color: '#bf9140', fontWeight: '500' }}>{p.name}</Link></td>
                  <td>{p.category_name || '-'}</td>
                  <td><span className={`status-badge ${p.is_active ? 'active' : 'inactive'}`}>{p.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td>{p.is_featured ? '⭐' : '-'}</td>
                </tr>
              )) : (
                <tr><td colSpan="5" style={{ textAlign: 'center', color: '#aaa', padding: '3rem' }}>No products yet. Add your first product!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
