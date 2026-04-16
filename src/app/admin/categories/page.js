'use client';
import { useState, useEffect, useRef } from 'react';
import React from 'react';

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

  const currentCategories = categories.filter(c =>
    currentParentId === null ? !c.parent_id : c.parent_id === currentParentId
  );

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
      <div className="flex justify-between items-center px-12 py-10 sticky top-0 z-50 bg-[#fbfbfd]/90 backdrop-blur-md">
        <div>
          <p className="text-[0.85rem] text-[#86868b] mb-2 font-medium">Inventory Hierarchy</p>
          <h1 className="text-3xl font-bold tracking-tight text-[#1d1d1f]">Categories</h1>
        </div>
        <button className="bg-[#0071e3] text-white px-5 py-2.5 rounded-[10px] text-[0.85rem] font-semibold hover:bg-[#0071e3]/90 transition-colors shadow-sm" onClick={openCreate}>+ Add Category Here</button>
      </div>

      <div className="px-12 pb-20">
        {toast && <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-xl text-[0.9rem] font-medium z-[3000] shadow-xl transition-all ${toast.type === 'error' ? 'bg-[#ff3b30] text-white' : 'bg-[#34c759] text-white'}`}>{toast.message}</div>}

        {/* Drill-down Breadcrumbs */}
        <div className="flex gap-3 items-center mb-10 bg-white px-6 py-4 rounded-xl border border-black/10 shadow-sm text-[0.95rem]">
          <span
            className={`cursor-pointer transition-colors ${currentParentId === null ? 'font-bold text-[#1d1d1f]' : 'text-[#0071e3] hover:underline'}`}
            onClick={() => setCurrentParentId(null)}
          >
            Root
          </span>
          {breadcrumbs.map((bc, idx) => (
            <React.Fragment key={bc.id}>
              <span className="text-[#ccc]">/</span>
              <span
                className={`transition-colors ${idx === breadcrumbs.length - 1 ? 'cursor-default font-bold text-[#1d1d1f]' : 'cursor-pointer text-[#0071e3] hover:underline'}`}
                onClick={() => idx < breadcrumbs.length - 1 && setCurrentParentId(bc.id)}
              >
                {bc.name}
              </span>
            </React.Fragment>
          ))}
        </div>

        {loading ? (
          <div className="mx-auto my-16 w-8 h-8 rounded-full border-4 border-[#0071e3]/20 border-t-[#0071e3] animate-spin"></div>
        ) : currentCategories.length > 0 ? (
          <div className="bg-white border border-black/10 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left py-4 px-10 text-[0.75rem] uppercase tracking-wider text-[#86868b] border-b border-black/10 font-semibold bg-[#fafafa]">Category</th>
                  <th className="text-left py-4 px-10 text-[0.75rem] uppercase tracking-wider text-[#86868b] border-b border-black/10 font-semibold bg-[#fafafa]">Description</th>
                  <th className="text-left py-4 px-10 text-[0.75rem] uppercase tracking-wider text-[#86868b] border-b border-black/10 font-semibold bg-[#fafafa]">Order</th>
                  <th className="text-left py-4 px-10 text-[0.75rem] uppercase tracking-wider text-[#86868b] border-b border-black/10 font-semibold bg-[#fafafa]">Status</th>
                  <th className="text-left py-4 px-10 text-[0.75rem] uppercase tracking-wider text-[#86868b] border-b border-black/10 font-semibold bg-[#fafafa]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentCategories.map(cat => (
                  <tr key={cat.id} onClick={() => setCurrentParentId(cat.id)} className="cursor-pointer group hover:bg-[#fbfbfd]">
                    <td className="py-5 px-10 text-[0.95rem] text-[#1d1d1f] border-b border-black/5">
                      <div className="flex items-center gap-4">
                        {cat.image ? (
                          <img src={cat.image} className="w-12 h-12 rounded-[10px] object-cover border border-black/10" alt={cat.name} />
                        ) : (
                          <div className="w-12 h-12 bg-[#f5f5f7] rounded-[10px] flex items-center justify-center text-[1.5rem] border border-black/5">📁</div>
                        )}
                        <div>
                          <div className="font-semibold text-[#1d1d1f]">{cat.name}</div>
                          <div className="text-[0.8rem] text-[#86868b] mt-1">
                            {cat.product_count || 0} Products
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-10 text-[0.85rem] text-[#86868b] border-b border-black/5 max-w-[250px] truncate">
                      {cat.description || '-'}
                    </td>
                    <td className="py-5 px-10 text-[0.95rem] text-[#1d1d1f] border-b border-black/5">{cat.sort_order || 0}</td>
                    <td className="py-5 px-10 text-[0.95rem] text-[#1d1d1f] border-b border-black/5">
                      <span className={`px-2 py-1 rounded-[6px] text-[0.65rem] font-bold uppercase tracking-wider ${cat.is_active ? 'bg-[#34c759]/10 text-[#34c759]' : 'bg-[#ff3b30]/10 text-[#ff3b30]'}`}>
                        {cat.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-5 px-10 text-[0.95rem] text-[#1d1d1f] border-b border-black/5" onClick={e => e.stopPropagation()}>
                      <div className="flex gap-3">
                        <button className="px-4 py-2 rounded-lg text-[0.85rem] font-medium cursor-pointer transition-all border border-black/10 bg-white text-[#0071e3] hover:bg-[#0071e3]/5 hover:border-[#0071e3]" onClick={(e) => openEdit(e, cat)}>Edit</button>
                        <button className="px-4 py-2 rounded-lg text-[0.85rem] font-medium cursor-pointer transition-all border border-black/10 bg-white text-[#ff3b30] hover:bg-[#ff3b30]/5 hover:border-[#ff3b30]" onClick={(e) => handleDelete(e, cat.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-20 bg-white rounded-3xl border border-black/10 shadow-sm">
            <p className="text-[#888] mb-6">No sub-categories in this section.</p>
            <button className="bg-white border border-black/10 text-[#1d1d1f] px-5 py-2.5 rounded-[10px] text-[0.85rem] font-semibold hover:bg-black/5 transition-colors" onClick={openCreate}>Create First Sub-category</button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xl flex items-center justify-center z-[2000] p-8" onClick={() => setShowModal(false)}>
          <div className="bg-white border border-black/10 rounded-[24px] p-12 w-full max-w-[800px] max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-[#1d1d1f] mb-8">{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2 mb-6">
                <label className="text-[0.85rem] font-semibold text-[#1d1d1f]">Category Name *</label>
                <input type="text" className="bg-[#f5f5f7] border border-transparent px-5 py-3.5 rounded-xl text-base w-full transition-all focus:bg-white focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 outline-none" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="flex flex-col gap-2 mb-6">
                <label className="text-[0.85rem] font-semibold text-[#1d1d1f]">Description</label>
                <textarea className="bg-[#f5f5f7] border border-transparent px-5 py-3.5 rounded-xl text-base w-full transition-all focus:bg-white focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 outline-none resize-y min-h-[120px]" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.85rem] font-semibold text-[#1d1d1f]">Parent Category</label>
                  <select className="bg-[#f5f5f7] border border-transparent px-5 py-3.5 rounded-xl text-base w-full transition-all focus:bg-white focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 outline-none appearance-none cursor-pointer" style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23999\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '16px' }} value={form.parent_id} onChange={e => setForm({ ...form, parent_id: e.target.value })}>
                    <option value="">Root (No Parent)</option>
                    {categories.filter(c => c.id !== editingCategory?.id).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[0.85rem] font-semibold text-[#1d1d1f]">Order</label>
                  <input type="number" className="bg-[#f5f5f7] border border-transparent px-5 py-3.5 rounded-xl text-base w-full transition-all focus:bg-white focus:border-[#0071e3] focus:ring-4 focus:ring-[#0071e3]/10 outline-none" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: e.target.value })} />
                </div>
              </div>
              <div className="flex flex-col gap-2 mb-6">
                <label className="text-[0.85rem] font-semibold text-[#1d1d1f]">Image</label>
                <div className="border-2 border-dashed border-black/10 rounded-xl p-8 text-center cursor-pointer transition-colors hover:border-[#0071e3] bg-black/5 hover:bg-[#0071e3]/5 relative">
                  <input type="file" onChange={handleImageUpload} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                  <p className="text-[#86868b] font-medium">{uploading ? 'Uploading...' : 'Click to select image'}</p>
                </div>
                {form.image && <img src={form.image} className="h-24 w-auto rounded-lg mt-4 border border-black/10" />}
              </div>
              <div className="flex items-center gap-3 mt-4 mb-10">
                <input type="checkbox" id="is_active" className="w-5 h-5 cursor-pointer" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
                <label htmlFor="is_active" className="text-[#1d1d1f] font-medium cursor-pointer">Active</label>
              </div>
              <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-black/10">
                <button type="button" className="bg-white border border-black/10 text-[#1d1d1f] px-5 py-2.5 rounded-[10px] text-[0.85rem] font-semibold hover:bg-black/5 transition-colors" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="bg-[#0071e3] text-white px-8 py-2.5 rounded-[10px] text-[0.85rem] font-semibold hover:bg-[#0071e3]/90 transition-colors shadow-sm">{editingCategory ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
