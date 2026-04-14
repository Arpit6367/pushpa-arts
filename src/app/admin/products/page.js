'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (search) params.set('search', search);

    fetch(`/api/products?${params}`)
      .then(res => res.json())
      .then(data => {
        if (data.products) {
          setProducts(data.products);
          setPagination(data.pagination);
        }
        setLoading(false);
      }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product and all its images?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      showToast('Product deleted');
      fetchProducts();
    } catch {
      showToast('Failed to delete', 'error');
    }
  };

  const toggleStatus = async (product) => {
    try {
      await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !product.is_active }),
      });
      fetchProducts();
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const toggleFeatured = async (product) => {
    try {
      await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_featured: !product.is_featured }),
      });
      fetchProducts();
    } catch {
      showToast('Failed to update', 'error');
    }
  };

  return (
    <>
      <div className="admin-header">
        <h1>Products</h1>
        <Link href="/admin/products/new" className="btn btn-primary btn-sm">+ Add Product</Link>
      </div>

      <div className="admin-content">
        {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

        <div className="admin-table-wrapper">
          <div className="admin-table-header">
            <h3>All Products {pagination && `(${pagination.total})`}</h3>
            <form onSubmit={handleSearch} className="admin-table-actions">
              <input
                type="text"
                className="admin-search"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button type="submit" className="btn btn-outline btn-sm">Search</button>
            </form>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}><div className="spinner" style={{ margin: '0 auto' }}></div></td></tr>
              ) : products.length > 0 ? products.map(p => (
                <tr key={p.id}>
                  <td>
                    {(p.primary_image || p.first_image) ? (
                      <img src={p.primary_image || p.first_image} className="thumb" alt={p.name} />
                    ) : (
                      <div className="thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#666' }}>📷</div>
                    )}
                  </td>
                  <td style={{ color: '#111', fontWeight: '500' }}>{p.name}</td>
                  <td>{p.category_name || '-'}</td>
                  <td>
                    <button className={`status-badge ${p.is_active ? 'active' : 'inactive'}`} onClick={() => toggleStatus(p)} style={{ cursor: 'pointer', border: 'none' }}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => toggleFeatured(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                      {p.is_featured ? '⭐' : '☆'}
                    </button>
                  </td>
                  <td>
                    <div className="action-btns">
                      <Link href={`/admin/products/${p.id}/edit`} className="action-btn edit">Edit</Link>
                      <button className="action-btn delete" onClick={() => handleDelete(p.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#aaa' }}>No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination && pagination.pages > 1 && (
          <div className="pagination" style={{ marginTop: '1.5rem' }}>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
              <button key={p} className={p === page ? 'active' : ''} onClick={() => setPage(p)}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
