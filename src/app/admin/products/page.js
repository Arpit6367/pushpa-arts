'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ category_id: '', featured: '', active: '' });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [showImportModal, setShowImportModal] = useState(false);

  const fetchCategories = () => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      }).catch(() => {});
  };

  const fetchProducts = () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (search) params.set('search', search);
    if (filters.category_id) params.set('category_id', filters.category_id);
    if (filters.featured) params.set('featured', filters.featured);
    if (filters.active) params.set('active', filters.active);

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

  useEffect(() => { 
    fetchCategories();
  }, []);

  useEffect(() => { fetchProducts(); }, [page, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
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
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setShowImportModal(true)} className="btn btn-outline btn-sm">Bulk Import</button>
          <Link href="/admin/products/new" className="btn btn-primary btn-sm">+ Add Product</Link>
        </div>
      </div>

      <div className="admin-content">
        {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

        <div className="admin-table-wrapper">
          <div className="admin-table-header" style={{ padding: '1.5rem 2.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>Catalog {pagination && `(${pagination.total})`}</h3>
                <form onSubmit={handleSearch} className="admin-table-actions">
                  <input
                    type="text"
                    className="admin-search"
                    placeholder="Quick search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <button type="submit" className="btn btn-outline btn-sm">Search</button>
                </form>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', paddingTop: '1rem', borderTop: '1px solid var(--admin-border)' }}>
                <div className="filter-group">
                  <select 
                    className="admin-search" 
                    style={{ width: '200px' }}
                    value={filters.category_id}
                    onChange={e => handleFilterChange('category_id', e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.parent_id ? '　↳ ' : ''}{cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <select 
                    className="admin-search" 
                    style={{ width: '150px' }}
                    value={filters.featured}
                    onChange={e => handleFilterChange('featured', e.target.value)}
                  >
                    <option value="">Status: All</option>
                    <option value="true">⭐ Featured</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Preview</th>
                <th>Product Info</th>
                <th>Primary Category</th>
                <th>Visibility</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '4rem' }}><div className="spinner" style={{ margin: '0 auto' }}></div></td></tr>
              ) : products.length > 0 ? products.map(p => (
                <tr key={p.id}>
                  <td>
                    {(p.primary_image || p.first_image) ? (
                      <img src={p.primary_image || p.first_image} className="thumb" alt={p.name} />
                    ) : (
                      <div className="thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#666', background: '#f5f5f7' }}>📷</div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: '#111' }}>{p.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>SKU: {p.sku || 'N/A'}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: '#555' }}>{p.category_name || '-'}</span>
                    {p.categories?.length > 1 && (
                      <div style={{ fontSize: '0.7rem', color: '#aaa' }}>+{p.categories.length - 1} more</div>
                    )}
                  </td>
                  <td>
                    <button 
                      className={`status-badge ${p.is_active ? 'active' : 'inactive'}`} 
                      onClick={() => toggleStatus(p)} 
                      style={{ cursor: 'pointer', border: 'none' }}
                      title="Click to toggle visibility"
                    >
                      {p.is_active ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                  <td>
                    <button 
                      onClick={() => toggleFeatured(p)} 
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', opacity: p.is_featured ? 1 : 0.2 }}
                      title="Toggle featured status"
                    >
                      ⭐
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
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '4rem', color: '#aaa' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
                  No products match your criteria
                </td></tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination && pagination.pages > 1 && (
          <div className="pagination" style={{ marginTop: '2rem' }}>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
              <button key={p} className={p === page ? 'active' : ''} onClick={() => setPage(p)}>{p}
              </button>
            ))}
          </div>
        )}
      </div>


      {showImportModal && (
        <BulkImportModal 
          onClose={() => {
            setShowImportModal(false);
            fetchProducts();
          }} 
        />
      )}
    </>
  );
}

function BulkImportModal({ onClose }) {
  const [file, setFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a valid CSV file');
      setFile(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    setImporting(true);
    setError('');
    setResults(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/products/import', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setResults(data);
      } else {
        setError(data.error || 'Failed to import products');
      }
    } catch (err) {
      setError('An error occurred during import');
    }
    setImporting(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem' }}>
          <h3 style={{ margin: 0, border: 'none', padding: 0 }}>Bulk Import Products</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#999' }}>&times;</button>
        </div>

        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
          Upload a CSV file to import products in bulk. You can download our sample file to see the required format.
        </p>

        <a href="/api/products/import/sample-csv" className="sample-link" download>
          <span>📥</span> Download Sample CSV
        </a>

        <div 
          className={`import-area ${importing ? 'loading' : ''}`}
          onClick={() => !importing && document.getElementById('csv-upload').click()}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</div>
          <p style={{ margin: 0, fontWeight: '500', color: file ? '#111' : '#888' }}>
            {file ? file.name : 'Click to select CSV file'}
          </p>
          <input 
            id="csv-upload" 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
          />
        </div>

        {error && <div style={{ color: '#e53e3e', fontSize: '0.85rem', marginBottom: '1rem', padding: '0.75rem', background: '#fff5f5', borderRadius: '8px', border: '1px solid #fce4e4' }}>{error}</div>}

        {results && (
          <div className="import-results">
            <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {results.failed === 0 ? '✅ Import Successful' : '⚠️ Import Completed with Issues'}
            </h4>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.5rem' }}>
              <div><strong style={{ color: '#059669' }}>{results.success}</strong> Succeeded</div>
              <div><strong style={{ color: results.failed > 0 ? '#dc2626' : '#666' }}>{results.failed}</strong> Failed</div>
            </div>
            {results.errors && results.errors.length > 0 && (
              <ul className="import-error-list">
                {results.errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={onClose} disabled={importing}>
            {results ? 'Close' : 'Cancel'}
          </button>
          {!results && (
            <button 
              className="btn btn-primary btn-sm" 
              style={{ flex: 1 }} 
              onClick={handleImport} 
              disabled={!file || importing}
            >
              {importing ? 'Processing...' : 'Start Import'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
