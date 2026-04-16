'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminProductNewPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [toast, setToast] = useState(null);
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
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setCategories(data); });
  }, []);

  const toggleCategory = (catId) => {
    if (categoryIds.includes(catId)) {
      setCategoryIds(categoryIds.filter(id => id !== catId));
      if (form.category_id === catId) setForm({ ...form, category_id: '' });
    } else {
      setCategoryIds([...categoryIds, catId]);
      if (!form.category_id) setForm({ ...form, category_id: catId });
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
        const newImages = data.files.map(f => ({ file_path: f.file_path, alt_text: '' }));
        setImages([...images, ...newImages]);
        showToast(`${data.files.length} images added`);
      }
    } catch { showToast('Failed', 'error'); }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        category_id: form.category_id || (categoryIds.length > 0 ? categoryIds[0] : null),
        category_ids: categoryIds,
        images,
      };
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showToast('Created successfully!');
        setTimeout(() => router.push('/admin/products'), 1000);
      }
    } catch { showToast('Error', 'error'); }
    setSaving(false);
  };

  return (
    <>
      <div className="admin-header">
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)', marginBottom: '0.5rem' }}>Inventory / New Item</p>
          <h1>Publish Product</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline" onClick={() => router.back()}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>{saving ? 'Publishing...' : 'Publish Product'}</button>
        </div>
      </div>

      <div className="admin-content">
        {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

        <form onSubmit={handleSubmit} className="admin-editor-layout">
          {/* Main Content Area */}
          <div className="admin-editor-main">
            <div className="admin-card-modern">
              <div className="form-group">
                <label style={{ fontSize: '1.1rem', fontWeight: '700' }}>Product Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ fontSize: '1.5rem', fontWeight: '600', padding: '1.5rem', marginTop: '1rem' }}
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})} 
                  placeholder="e.g. Vintage Marble Vase" 
                  required 
                />
              </div>

              <div className="form-group" style={{ marginTop: '2.5rem' }}>
                <label>Artisan Narrative (Description)</label>
                <textarea 
                  className="form-input" 
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})} 
                  rows={12} 
                  placeholder="Describe the craftsmanship, materials, and origin..." 
                />
              </div>
            </div>

            <div className="admin-card-modern">
              <div className="bento-header">
                <h3>Product Media</h3>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => fileInputRef.current?.click()}>Add Media</button>
              </div>
              
              <div 
                className="image-upload-area" 
                style={{ padding: '3rem', cursor: 'pointer', borderStyle: 'dashed' }}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? <div className="spinner" style={{ margin: '0 auto' }}></div> : (
                  <>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📷</div>
                    <p style={{ margin: 0 }}>Click or drop high-resolution imagery here</p>
                  </>
                )}
                <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
              </div>

              {images.length > 0 && (
                <div className="uploaded-images" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
                  {images.map((img, index) => (
                    <div key={index} className={`uploaded-image ${index === 0 ? 'primary' : ''}`} style={{ borderRadius: '20px' }}>
                      <img src={img.file_path} alt="" />
                      <button type="button" className="remove-btn" onClick={() => setImages(images.filter((_, i) => i !== index))}>✕</button>
                      {index === 0 && <span style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'var(--admin-gold)', color: '#fff', fontSize: '0.6rem', padding: '4px 10px', borderRadius: '20px', fontWeight: '700' }}>DISPLAY COVER</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Controls */}
          <aside className="admin-editor-sidebar">
            <div className="sidebar-group">
              <h5>Visibility Status</h5>
              <div className="checkbox-group">
                <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} />
                <label htmlFor="is_active">Live on Catalog</label>
              </div>
              <div className="checkbox-group">
                <input type="checkbox" id="is_featured" checked={form.is_featured} onChange={e => setForm({...form, is_featured: e.target.checked})} />
                <label htmlFor="is_featured">Featured Collection</label>
              </div>
            </div>

            <div className="sidebar-group">
              <h5>Classification</h5>
              <div className="form-group">
                <label>Reference SKU</label>
                <input type="text" className="form-input" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} placeholder="e.g. MRB-001" />
              </div>
              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label>Category Tags</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                  {categories.map(cat => (
                    <button 
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      style={{ 
                        padding: '6px 12px', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem', 
                        background: categoryIds.includes(cat.id) ? 'var(--admin-accent)' : '#f5f5f7',
                        color: categoryIds.includes(cat.id) ? '#fff' : '#666',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="sidebar-group">
              <h5>SEO Context</h5>
              <div className="form-group">
                <label>Browser Page Title</label>
                <input type="text" className="form-input" value={form.meta_title} onChange={e => setForm({...form, meta_title: e.target.value})} />
              </div>
              <div className="form-group" style={{ marginTop: '1.5rem' }}>
                <label>Serp Description</label>
                <textarea className="form-input" value={form.meta_description} onChange={e => setForm({...form, meta_description: e.target.value})} rows={3} style={{ minHeight: '80px' }} />
              </div>
            </div>

            <div className="sidebar-group">
              <h5>Organization</h5>
              <div className="form-group">
                <label>Display Sort Order</label>
                <input type="number" className="form-input" value={form.sort_order} onChange={e => setForm({...form, sort_order: e.target.value})} />
              </div>
            </div>
          </aside>
        </form>
      </div>
    </>
  );
}
