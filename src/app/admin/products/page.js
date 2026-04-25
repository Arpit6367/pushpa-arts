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
      }).catch(() => { });
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-8 lg:px-12 py-6 lg:py-10 sticky top-0 z-50 bg-[#fbfbfd]/90 backdrop-blur-md">
        <h1 className="text-3xl font-heading text-[#1d1d1f]">Masterpieces</h1>
        <div className="flex gap-3">
          <button onClick={() => setShowImportModal(true)} className="bg-white border border-black/10 text-[#1d1d1f] px-4 py-2 rounded-[10px] text-[0.8rem] font-semibold hover:bg-black/5 transition-colors cursor-pointer whitespace-nowrap">Import Collection</button>
          <Link href="/admin/products/new" className="bg-[#0071e3] text-white px-4 py-2 rounded-[10px] text-[0.8rem] font-semibold hover:bg-[#0071e3]/90 transition-colors shadow-sm cursor-pointer whitespace-nowrap">+ New Masterpiece</Link>
        </div>
      </div>

      <div className="px-4 sm:px-8 lg:px-12 pb-12 lg:pb-20">
        {toast && <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-xl text-[0.9rem] font-medium z-[3000] shadow-xl transition-all ${toast.type === 'error' ? 'bg-[#ff3b30] text-white' : 'bg-[#34c759] text-white'}`}>{toast.message}</div>}

        <div className="bg-white border border-black/10 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 md:p-10 border-b border-black/10">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="m-0 text-lg font-bold text-[#1d1d1f]">Catalog {pagination && `(${pagination.total})`}</h3>
                <form onSubmit={handleSearch} className="flex gap-3 w-full sm:w-auto">
                  <input
                    type="text"
                    className="flex-1 sm:w-64 bg-[#f5f5f7] border border-transparent px-4 py-2.5 rounded-xl text-sm transition-all focus:bg-white focus:border-[#0071e3] outline-none"
                    placeholder="Quick search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <button type="submit" className="bg-white border border-black/10 text-[#1d1d1f] px-4 py-2 rounded-[10px] text-[0.8rem] font-semibold hover:bg-black/5 transition-colors cursor-pointer whitespace-nowrap">Search</button>
                </form>
              </div>

              <div className="flex gap-4 flex-wrap pt-4 border-t border-black/10">
                <div className="w-full sm:w-auto">
                  <select
                    className="w-full sm:w-64 bg-[#f5f5f7] border border-transparent px-4 py-2.5 rounded-xl text-sm transition-all focus:bg-white focus:border-[#0071e3] outline-none"
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

                <div className="w-full sm:w-auto">
                  <select
                    className="w-full sm:w-48 bg-[#f5f5f7] border border-transparent px-4 py-2.5 rounded-xl text-sm transition-all focus:bg-white focus:border-[#0071e3] outline-none"
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

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#fafafa]">
                  <th className="text-left py-4 px-10 text-[0.75rem] uppercase tracking-wider text-[#86868b] border-b border-black/10 font-semibold">Preview</th>
                  <th className="text-left py-4 px-10 text-[0.75rem] uppercase tracking-wider text-[#86868b] border-b border-black/10 font-semibold">Product Info</th>
                  <th className="text-left py-4 px-10 text-[0.75rem] uppercase tracking-wider text-[#86868b] border-b border-black/10 font-semibold">Primary Category</th>
                  <th className="text-left py-4 px-10 text-[0.75rem] uppercase tracking-wider text-[#86868b] border-b border-black/10 font-semibold">Visibility</th>
                  <th className="text-left py-4 px-10 text-[0.75rem] uppercase tracking-wider text-[#86868b] border-b border-black/10 font-semibold">Featured</th>
                  <th className="text-left py-4 px-10 text-[0.75rem] uppercase tracking-wider text-[#86868b] border-b border-black/10 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-20">
                      <div className="w-8 h-8 rounded-full border-4 border-[#0071e3]/20 border-t-[#0071e3] animate-spin mx-auto"></div>
                    </td>
                  </tr>
                ) : products.length > 0 ? products.map(p => (
                  <tr key={p.id} className="hover:bg-[#fbfbfd] transition-colors border-b border-black/10 last:border-b-0">
                    <td className="py-5 px-10">
                      {(p.primary_image || p.first_image) ? (
                        <img src={p.primary_image || p.first_image} className="w-12 h-12 rounded-[10px] object-cover border border-black/10" alt={p.name} />
                      ) : (
                        <div className="w-12 h-12 rounded-[10px] bg-[#f5f5f7] border border-black/10 flex items-center justify-center text-[0.7rem] color-[#86868b]">📷</div>
                      )}
                    </td>
                    <td className="py-5 px-10">
                      <div className="font-semibold text-[#1d1d1f]">{p.name}</div>
                      <div className="text-[0.75rem] text-[#86868b] mt-0.5">SKU: {p.sku || 'N/A'}</div>
                    </td>
                    <td className="py-5 px-10">
                      <span className="text-[0.85rem] text-[#424245]">{p.category_name || '-'}</span>
                      {p.categories?.length > 1 && (
                        <div className="text-[0.7rem] text-[#86868b] mt-0.5">+{p.categories.length - 1} more</div>
                      )}
                    </td>
                    <td className="py-5 px-10">
                      <button
                        className={`px-3 py-1 rounded-[6px] text-[0.65rem] font-bold uppercase tracking-wider cursor-pointer border-none transition-all ${p.is_active ? 'bg-[#34c759]/10 text-[#34c759]' : 'bg-[#ff3b30]/10 text-[#ff3b30]'}`}
                        onClick={() => toggleStatus(p)}
                        title="Click to toggle visibility"
                      >
                        {p.is_active ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td className="py-5 px-10 text-center">
                      <button
                        onClick={() => toggleFeatured(p)}
                        className={`bg-none border-none cursor-pointer text-xl transition-all ${p.is_featured ? 'opacity-100 scale-110' : 'opacity-20 hover:opacity-100 scale-100'}`}
                        title="Toggle featured status"
                      >
                        ⭐
                      </button>
                    </td>
                    <td className="py-5 px-10">
                      <div className="flex gap-2 justify-end">
                        <Link href={`/admin/products/${p.id}/edit`} className="px-4 py-2 rounded-lg text-[0.85rem] font-medium border border-black/10 bg-white text-[#0071e3] hover:bg-[#0071e3]/5 hover:border-[#0071e3] transition-all no-underline">Edit</Link>
                        <button className="px-4 py-2 rounded-lg text-[0.85rem] font-medium border border-black/10 bg-white text-[#ff3b30] hover:bg-[#ff3b30]/5 hover:border-[#ff3b30] transition-all cursor-pointer" onClick={() => handleDelete(p.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="6" className="text-center py-20 text-[#86868b]">
                      <div className="text-4xl mb-4 text-[#d2d2d7]">🔍</div>
                      <p className="text-lg">No products match your criteria</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {pagination && pagination.pages > 1 && (
          <div className="flex gap-2 justify-center mt-10 flex-wrap">
            {(() => {
              const totalPages = pagination.pages;
              const current = page;
              const delta = 1;
              const range = [];
              const rangeWithDots = [];
              let l;

              for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= current - delta && i <= current + delta)) {
                  range.push(i);
                }
              }

              for (let i of range) {
                if (l) {
                  if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                  } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                  }
                }
                rangeWithDots.push(i);
                l = i;
              }

              return rangeWithDots.map((p, idx) => (
                p === '...' ? (
                  <span key={`dots-${idx}`} className="w-10 h-10 flex items-center justify-center text-black/30">...</span>
                ) : (
                  <button
                    key={p}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-medium transition-all cursor-pointer border ${p === page ? 'bg-[#0071e3] text-white border-[#0071e3]' : 'bg-white text-[#1d1d1f] border-black/10 hover:border-[#0071e3]'}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                )
              ));
            })()}
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


  {
    showImportModal && (
      <BulkImportModal
        onClose={() => {
          setShowImportModal(false);
          fetchProducts();
        }}
      />
    )
  }
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
