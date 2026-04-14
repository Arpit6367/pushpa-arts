'use client';
import { useState, useEffect, useRef } from 'react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [toast, setToast] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({ name: '', description: '', parent_id: '', sort_order: 0, is_active: true, image: '' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCategories = () => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
        setLoading(false);
      }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const openCreate = () => {
    setEditingCategory(null);
    setForm({ name: '', description: '', parent_id: '', sort_order: 0, is_active: true, image: '' });
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      description: cat.description || '',
      parent_id: cat.parent_id || '',
      sort_order: cat.sort_order || 0,
      is_active: cat.is_active,
      image: cat.image || ''
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('files', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.files && data.files.length > 0) {
        setForm({ ...form, image: data.files[0].file_path });
        showToast('Image uploaded successfully');
      } else {
        showToast(data.error || 'Upload failed', 'error');
      }
    } catch {
      showToast('Image upload failed', 'error');
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, parent_id: form.parent_id || null, sort_order: parseInt(form.sort_order) || 0 };

    try {
      if (editingCategory) {
        const res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast('Category updated!');
        } else {
          showToast('Failed to update', 'error');
        }
      } else {
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          showToast('Category created!');
        } else {
          const data = await res.json();
          showToast(data.error || 'Failed to create', 'error');
        }
      }
      setShowModal(false);
      fetchCategories();
    } catch {
      showToast('Something went wrong', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category? Products in this category will be unlinked.')) return;
    try {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      showToast('Category deleted');
      fetchCategories();
    } catch {
      showToast('Failed to delete', 'error');
    }
  };

  const parentCategories = categories.filter(c => !c.parent_id);

  return (
    <>
      <div className="admin-header">
        <h1>Categories</h1>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>+ Add Category</button>
      </div>

      <div className="admin-content">
        {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Parent</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}><div className="spinner" style={{ margin: '0 auto' }}></div></td></tr>
              ) : categories.length > 0 ? categories.map(cat => (
                <tr key={cat.id}>
                  <td>
                    {cat.image ? (
                      <img src={cat.image} className="thumb" alt={cat.name} />
                    ) : (
                      <div className="thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#666' }}>📁</div>
                    )}
                  </td>
                  <td style={{ color: '#111', fontWeight: cat.parent_id ? 400 : 600 }}>
                    {cat.parent_id ? '↳ ' : ''}{cat.name}
                  </td>
                  <td>{cat.parent_name || '-'}</td>
                  <td>{cat.sort_order}</td>
                  <td><span className={`status-badge ${cat.is_active ? 'active' : 'inactive'}`}>{cat.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn edit" onClick={() => openEdit(cat)}>Edit</button>
                      <button className="action-btn delete" onClick={() => handleDelete(cat.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No categories yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category Name *</label>
                <input type="text" className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-input" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Parent Category</label>
                  <select className="form-input" value={form.parent_id} onChange={e => setForm({...form, parent_id: e.target.value})}>
                    <option value="">None (Top Level)</option>
                    {parentCategories.filter(c => c.id !== editingCategory?.id).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Sort Order</label>
                  <input type="number" className="form-input" value={form.sort_order} onChange={e => setForm({...form, sort_order: e.target.value})} />
                </div>
              </div>
              
              <div className="form-group">
                <label>Category Image</label>
                <div 
                  className="image-upload-area" 
                  style={{ padding: '1rem', borderStyle: 'dashed', borderWidth: '2px', textAlign: 'center', cursor: 'pointer', marginBottom: '0.5rem' }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? (
                    <div className="spinner" style={{ margin: '0 auto', width: '20px', height: '20px' }}></div>
                  ) : form.image ? (
                    <img src={form.image} alt="Preview" style={{ maxHeight: '100px', margin: '0 auto' }} />
                  ) : (
                    <p style={{ fontSize: '0.8rem', color: '#888' }}>Click to upload category image</p>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                  />
                </div>
                <input 
                  type="text" 
                  className="form-input" 
                  value={form.image} 
                  onChange={e => setForm({...form, image: e.target.value})} 
                  placeholder="Or enter image URL manualy" 
                  style={{ fontSize: '0.8rem' }}
                />
              </div>

              <div className="checkbox-group">
                <input type="checkbox" id="cat-active" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} />
                <label htmlFor="cat-active">Active</label>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm">{editingCategory ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

