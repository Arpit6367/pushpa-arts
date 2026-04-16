'use client';
import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminProductEditPage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [form, setForm] = useState({
    name: '',
    short_description: '',
    description: '',
    sku: '',
    category_id: '',
    is_featured: false,
    is_active: true,
    sort_order: 0,
    meta_title: '',
    meta_description: '',
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await fetch('/api/categories');
        const catData = await catRes.json();
        if (Array.isArray(catData)) setCategories(catData);

        const prodRes = await fetch(`/api/products/${id}`);
        const prodData = await prodRes.json();
        if (prodData && !prodData.error) {
          const p = prodData;
          setForm({
            name: p.name || '',
            short_description: p.short_description || '',
            description: p.description || '',
            sku: p.sku || '',
            category_id: p.category_id || '',
            is_featured: p.is_featured,
            is_active: p.is_active,
            sort_order: p.sort_order || 0,
            meta_title: p.meta_title || '',
            meta_description: p.meta_description || '',
          });
          setImages(prodData.images || []);
          setCategoryIds(prodData.categories?.map(c => c.category_id) || (p.category_id ? [p.category_id] : []));
        }
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const toggleCategory = (catId) => {
    if (categoryIds.includes(catId)) {
      setCategoryIds(categoryIds.filter(id => id !== catId));
    } else {
      setCategoryIds([...categoryIds, catId]);
    }
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const formData = new FormData();
    for (const file of files) formData.append('files', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.files) {
        setImages([...images, ...data.files.map(f => ({ file_path: f.file_path, alt_text: '' }))]);
        showToast('Images added');
      }
    } catch { showToast('Upload failed', 'error'); }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, category_ids: categoryIds, images };
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) showToast('Changes synced!');
    } catch { showToast('Failed to save', 'error'); }
    setSaving(false);
  };

  if (loading) return <div className="spinner" style={{ margin: '5rem auto' }}></div>;

  return (
    <>
      <div className="admin-header">
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)', marginBottom: '0.5rem' }}>Catalog / Edit Mode</p>
          <h1>{form.name || 'Edit Product'}</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline" onClick={() => router.back()}>Exit</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>{saving ? 'Syncing...' : 'Sync Changes'}</button>
        </div>
      </div>

      <div className="admin-content">
        {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

        <form onSubmit={handleSubmit} className="admin-editor-layout">
          <div className="admin-editor-main">
            <div className="admin-card-modern">
              <div className="form-group">
                <label style={{ fontSize: '1.1rem', fontWeight: '700' }}>Identity</label>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ fontSize: '1.5rem', fontWeight: '600', padding: '1.5rem', marginTop: '1rem' }}
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group" style={{ marginTop: '2.5rem' }}>
                <label>Storytelling</label>
                <textarea 
                  className="form-input" 
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})} 
                  rows={12} 
                />
              </div>
            </div>

            <div className="admin-card-modern">
                <div className="bento-header">
                  <h3>Artisan Media</h3>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => fileInputRef.current?.click()}>Upload New</button>
                </div>
                <div className="image-upload-area" style={{ borderStyle: 'dashed', padding: '2rem' }} onClick={() => fileInputRef.current?.click()}>
                  {uploading ? <div className="spinner" style={{ margin: '0 auto' }}></div> : <p>Click to add more assets</p>}
                  <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
                </div>
                {images.length > 0 && (
                  <div className="uploaded-images" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', marginTop: '1.5rem' }}>
                    {images.map((img, index) => (
                      <div key={index} className="uploaded-image" style={{ borderRadius: '16px' }}>
                        <img src={img.file_path} alt="" />
                        <button type="button" className="remove-btn" onClick={() => setImages(images.filter((_, i) => i !== index))}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>

          <aside className="admin-editor-sidebar">
            <div className="sidebar-group">
              <h5>Publicity</h5>
              <div className="checkbox-group">
                <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} />
                <label htmlFor="is_active">Public on Gallery</label>
              </div>
              <div className="checkbox-group">
                <input type="checkbox" id="is_featured" checked={form.is_featured} onChange={e => setForm({...form, is_featured: e.target.checked})} />
                <label htmlFor="is_featured">Promoted Item</label>
              </div>
            </div>

            <div className="sidebar-group">
              <h5>Inventory Details</h5>
              <div className="form-group">
                <label>Unique SKU</label>
                <input type="text" className="form-input" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} />
              </div>
              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label>Collections</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem' }}>
                  {categories.map(cat => (
                    <button 
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      style={{ 
                        padding: '5px 10px', borderRadius: '20px', fontSize: '0.7rem', 
                        background: categoryIds.includes(cat.id) ? 'var(--admin-accent)' : '#f5f5f7',
                        color: categoryIds.includes(cat.id) ? '#fff' : '#666', border: 'none', cursor: 'pointer'
                      }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="sidebar-group">
              <h5>Metadata (SEO)</h5>
              <div className="form-group">
                <label>Browser Title</label>
                <input type="text" className="form-input" value={form.meta_title} onChange={e => setForm({...form, meta_title: e.target.value})} />
              </div>
              <div className="form-group" style={{ marginTop: '1.25rem' }}>
                <label>Keywords Summary</label>
                <textarea className="form-input" value={form.meta_description} onChange={e => setForm({...form, meta_description: e.target.value})} rows={3} style={{ minHeight: '80px' }} />
              </div>
            </div>

            <div className="sidebar-group">
              <h5>Sorting</h5>
              <div className="form-group">
                <label>Position Index</label>
                <input type="number" className="form-input" value={form.sort_order} onChange={e => setForm({...form, sort_order: e.target.value})} />
              </div>
            </div>
          </aside>
        </form>
      </div>
    </>
  );
}
