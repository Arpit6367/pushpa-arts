'use client';
import { useState, useEffect, useRef } from 'react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentParentId, setCurrentParentId] = useState(null);
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

  // Filtered categories for current level
  const currentCategories = categories.filter(c =>
    currentParentId === null ? !c.parent_id : c.parent_id === currentParentId
  );

  // Breadcrumb logic
  const getBreadcrumbs = () => {
    const trail = [];
    let currentId = currentParentId;
    while (currentId) {
      const parent = categories.find(c => c.id === currentId);
      if (parent) {
        trail.unshift(parent);
        currentId = parent.parent_id;
      } else break;
    }
    return trail;
  };

  const breadcrumbs = getBreadcrumbs();

  const openCreate = () => {
    setEditingCategory(null);
    setForm({ name: '', description: '', parent_id: currentParentId || '', sort_order: 0, is_active: true, image: '' });
    setShowModal(true);
  };

  const openEdit = (e, cat) => {
    e.stopPropagation();
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
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.files && data.files.length > 0) {
        setForm({ ...form, image: data.files[0].file_path });
        showToast('Image uploaded');
      }
    } catch {
      showToast('Upload failed', 'error');
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        showToast(editingCategory ? 'Category updated' : 'Category created');
        setShowModal(false);
        fetchCategories();
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to save', 'error');
      }
    } catch { showToast('Error', 'error'); }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Delete this category?')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Deleted');
        fetchCategories();
      }
    } catch { showToast('Failed', 'error'); }
  };

  return (
    <>
      <div className="admin-header">
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--admin-text-secondary)', marginBottom: '0.5rem' }}>Inventory Hierarchy</p>
          <h1>Categories</h1>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>+ Add Category Here</button>
      </div>

      <div className="admin-content">
        {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

        {/* Drill-down Breadcrumbs */}
        <div className="category-breadcrumb-bar">
          <span
            style={{ cursor: 'pointer', color: currentParentId === null ? 'var(--admin-text-primary)' : 'var(--admin-accent)', fontWeight: currentParentId === null ? '600' : '400' }}
            onClick={() => setCurrentParentId(null)}
          >
            Root
          </span>
          {breadcrumbs.map((bc, idx) => (
            <React.Fragment key={bc.id}>
              <span style={{ color: '#ccc' }}>/</span>
              <span
                style={{
                  cursor: idx === breadcrumbs.length - 1 ? 'default' : 'pointer',
                  color: idx === breadcrumbs.length - 1 ? 'var(--admin-text-primary)' : 'var(--admin-accent)',
                  fontWeight: idx === breadcrumbs.length - 1 ? '600' : '400'
                }}
                onClick={() => idx < breadcrumbs.length - 1 && setCurrentParentId(bc.id)}
              >
                {bc.name}
              </span>
            </React.Fragment>
          ))}
        </div>

        {loading ? (
          <div className="spinner" style={{ margin: '4rem auto' }}></div>
        ) : currentCategories.length > 0 ? (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCategories.map(cat => (
                  <tr key={cat.id} onClick={() => setCurrentParentId(cat.id)} style={{ cursor: 'pointer' }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {cat.image ? (
                          <img src={cat.image} style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }} alt={cat.name} />
                        ) : (
                          <div style={{ width: '48px', height: '48px', background: '#f5f5f7', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>📁</div>
                        )}
                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--admin-text-primary)' }}>{cat.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-secondary)', marginTop: '0.2rem' }}>
                            {cat.product_count || 0} Products
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--admin-text-secondary)', fontSize: '0.85rem', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {cat.description || '-'}
                    </td>
                    <td>{cat.sort_order || 0}</td>
                    <td>
                      <span className={`status-badge ${cat.is_active ? 'active' : 'inactive'}`}>
                        {cat.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="action-btns">
                        <button className="action-btn edit" onClick={(e) => openEdit(e, cat)}>Edit</button>
                        <button className="action-btn delete" onClick={(e) => handleDelete(e, cat.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem', background: '#fff', borderRadius: '24px', border: '1px solid var(--admin-border)' }}>
            <p style={{ color: '#888' }}>No sub-categories in this section.</p>
            <button className="btn btn-outline btn-sm" style={{ marginTop: '1rem' }} onClick={openCreate}>Create First Sub-category</button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category Name *</label>
                <input type="text" className="form-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Parent Category</label>
                  <select className="form-input" value={form.parent_id} onChange={e => setForm({ ...form, parent_id: e.target.value })}>
                    <option value="">Root (No Parent)</option>
                    {categories.filter(c => c.id !== editingCategory?.id).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Order</label>
                  <input type="number" className="form-input" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Image</label>
                <input type="file" onChange={handleImageUpload} accept="image/*" />
                {form.image && <img src={form.image} style={{ height: '60px', marginTop: '0.5rem', borderRadius: '8px' }} />}
              </div>
              <div className="checkbox-group">
                <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
                <label htmlFor="is_active">Active</label>
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
import React from 'react';

