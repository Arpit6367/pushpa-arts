'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function AdminProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [toast, setToast] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
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
      .then(data => { if (Array.isArray(data)) setCategories(data); })
      .catch(() => {});

    if (id) {
      fetch(`/api/products/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.id) {
            setForm({
              name: data.name || '',
              short_description: data.short_description || '',
              description: data.description || '',
              sku: data.sku || '',
              category_id: data.category_id || '',
              is_featured: data.is_featured || false,
              is_active: data.is_active !== false,
              sort_order: data.sort_order || 0,
              meta_title: data.meta_title || '',
              meta_description: data.meta_description || '',
            });
            if (data.images) {
              setImages(data.images.map(img => ({ file_path: img.file_path, alt_text: img.alt_text || '' })));
            }
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.files) {
        const newImages = data.files.map(f => ({ file_path: f.file_path, alt_text: '' }));
        setImages([...images, ...newImages]);
        showToast(`${data.files.length} image(s) uploaded`);
      }
    } catch {
      showToast('Upload failed', 'error');
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...form,
        category_id: form.category_id || null,
        sort_order: parseInt(form.sort_order) || 0,
        images,
      };

      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast('Product updated!');
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to update product', 'error');
      }
    } catch {
      showToast('Something went wrong', 'error');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <>
        <div className="admin-header"><h1>Edit Product</h1></div>
        <div className="admin-content"><div className="loading"><div className="spinner"></div></div></div>
      </>
    );
  }

  return (
    <>
      <div className="admin-header">
        <h1>Edit Product</h1>
        <button className="btn btn-outline btn-sm" onClick={() => router.back()}>← Back</button>
      </div>

      <div className="admin-content">
        {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

        <form onSubmit={handleSubmit} className="admin-form">
          <h3>Product Details</h3>

          <div className="form-group">
            <label>Product Name *</label>
            <input type="text" className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select className="form-input" value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})}>
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.parent_name ? `${c.parent_name} → ` : ''}{c.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>SKU</label>
              <input type="text" className="form-input" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} />
            </div>
          </div>

          <div className="form-group">
            <label>Short Description</label>
            <input type="text" className="form-input" value={form.short_description} onChange={e => setForm({...form, short_description: e.target.value})} />
          </div>

          <div className="form-group">
            <label>Full Description</label>
            <textarea className="form-input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={6} />
          </div>

          <h3 style={{ marginTop: '2rem' }}>Product Images</h3>

          <div className="image-upload-area" onClick={() => fileInputRef.current?.click()}>
            <div className="icon">📸</div>
            <p>{uploading ? 'Uploading...' : 'Click to upload more images'}</p>
            <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
          </div>

          {images.length > 0 && (
            <div className="uploaded-images">
              {images.map((img, index) => (
                <div key={index} className={`uploaded-image ${index === 0 ? 'primary' : ''}`}>
                  <img src={img.file_path} alt={img.alt_text || 'Product'} />
                  <button type="button" className="remove-btn" onClick={() => removeImage(index)}>✕</button>
                  {index === 0 && <div style={{ position: 'absolute', bottom: 4, left: 4, fontSize: '0.6rem', background: '#bf9140', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>Primary</div>}
                </div>
              ))}
            </div>
          )}

          <h3 style={{ marginTop: '2rem' }}>Settings & SEO</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Sort Order</label>
              <input type="number" className="form-input" value={form.sort_order} onChange={e => setForm({...form, sort_order: e.target.value})} />
            </div>
            <div></div>
          </div>

          <div className="checkbox-group">
            <input type="checkbox" id="is-active" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} />
            <label htmlFor="is-active">Active (visible on website)</label>
          </div>

          <div className="checkbox-group">
            <input type="checkbox" id="is-featured" checked={form.is_featured} onChange={e => setForm({...form, is_featured: e.target.checked})} />
            <label htmlFor="is-featured">Featured (show on homepage)</label>
          </div>

          <div className="form-group">
            <label>Meta Title (SEO)</label>
            <input type="text" className="form-input" value={form.meta_title} onChange={e => setForm({...form, meta_title: e.target.value})} />
          </div>

          <div className="form-group">
            <label>Meta Description (SEO)</label>
            <textarea className="form-input" value={form.meta_description} onChange={e => setForm({...form, meta_description: e.target.value})} rows={2} />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline btn-sm" onClick={() => router.back()}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
              {saving ? 'Saving...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
