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
      <div className="flex justify-between items-center px-12 py-10 sticky top-0 z-50 bg-[#fbfbfd]/90 backdrop-blur-md">
        <div>
          <p className="text-[0.75rem] uppercase tracking-wider text-[#86868b] font-semibold mb-1">Inventory / New Item</p>
          <h1 className="text-3xl font-heading text-[#1d1d1f]">Publish Product</h1>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-black/10 text-[#1d1d1f] px-6 py-2.5 rounded-[12px] text-[0.85rem] font-semibold hover:bg-black/5 transition-all cursor-pointer" onClick={() => router.back()}>Cancel</button>
          <button className="bg-[#0071e3] text-white px-6 py-2.5 rounded-[12px] text-[0.85rem] font-semibold hover:bg-[#0071e3]/90 transition-all shadow-lg shadow-[#0071e3]/20 cursor-pointer disabled:opacity-50" onClick={handleSubmit} disabled={saving}>{saving ? 'Publishing...' : 'Publish Product'}</button>
        </div>
      </div>

      <div className="px-12 pb-20">
        {toast && <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-xl text-[0.9rem] font-medium z-[3000] shadow-xl transition-all ${toast.type === 'error' ? 'bg-[#ff3b30] text-white' : 'bg-[#34c759] text-white'}`}>{toast.message}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* Main Content Area */}
          <div className="space-y-8">
            <div className="bg-white border border-black/10 rounded-3xl p-8 md:p-12 shadow-sm">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.85rem] font-semibold text-[#1d1d1f] ml-1">Product Name</label>
                  <input
                    type="text"
                    className="bg-[#f5f5f7] border border-transparent px-6 py-5 rounded-2xl text-2xl font-semibold w-full transition-all focus:bg-white focus:border-[#0071e3] outline-none placeholder:text-[#d2d2d7]"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Vintage Marble Vase"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[0.85rem] font-semibold text-[#1d1d1f] ml-1">Artisan Narrative (Description)</label>
                  <textarea
                    className="bg-[#f5f5f7] border border-transparent px-6 py-5 rounded-2xl text-base w-full transition-all focus:bg-white focus:border-[#0071e3] outline-none min-h-[300px] resize-none leading-relaxed"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe the craftsmanship, materials, and origin..."
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-black/10 rounded-3xl p-8 md:p-12 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-[#1d1d1f]">Product Media</h3>
                <button type="button" className="bg-[#f5f5f7] text-[#1d1d1f] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#e8e8ed] transition-colors" onClick={() => fileInputRef.current?.click()}>Add Media</button>
              </div>

              <div
                className="bg-[#fafafa] border-2 border-dashed border-[#d2d2d7] rounded-3xl p-12 text-center cursor-pointer hover:bg-[#f5f5f7] transition-all group"
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? (
                  <div className="w-8 h-8 rounded-full border-4 border-[#0071e3]/20 border-t-[#0071e3] animate-spin mx-auto"></div>
                ) : (
                  <>
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📷</div>
                    <p className="text-[#86868b] font-medium">Click or drop high-resolution imagery here</p>
                    <p className="text-[0.7rem] text-[#b4b4b4] mt-2">Supports JPG, PNG, WEBP</p>
                  </>
                )}
                <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6 mt-10">
                  {images.map((img, index) => (
                    <div key={index} className={`group relative aspect-square rounded-2xl overflow-hidden border border-black/10 shadow-sm transition-all hover:shadow-md ${index === 0 ? 'ring-2 ring-[#0071e3] ring-offset-4' : ''}`}>
                      <img src={img.file_path} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#ff3b30] hover:text-white border-none cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); setImages(images.filter((_, i) => i !== index)); }}
                      >
                        ✕
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 right-2 bg-[#0071e3] text-white text-[0.6rem] font-bold uppercase tracking-wider py-1.5 text-center rounded-lg shadow-lg">
                          Display Cover
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Controls */}
          <aside className="space-y-6">
            <div className="bg-white border border-black/10 rounded-3xl p-8 shadow-sm">
              <h5 className="text-[0.7rem] uppercase tracking-widest text-[#86868b] font-bold mb-6">Visibility Status</h5>
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 rounded-2xl hover:bg-[#f5f5f7] transition-colors cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="peer h-6 w-11 appearance-none rounded-full bg-[#d2d2d7] checked:bg-[#34c759] transition-all cursor-pointer"
                      checked={form.is_active}
                      onChange={e => setForm({ ...form, is_active: e.target.checked })}
                    />
                    <div className="absolute left-1 h-4 w-4 rounded-full bg-white transition-all peer-checked:left-6"></div>
                  </div>
                  <span className="text-sm font-semibold text-[#1d1d1f]">Live on Catalog</span>
                </label>

                <label className="flex items-center gap-3 p-4 rounded-2xl hover:bg-[#f5f5f7] transition-colors cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="peer h-6 w-11 appearance-none rounded-full bg-[#d2d2d7] checked:bg-[#ffcc00] transition-all cursor-pointer"
                      checked={form.is_featured}
                      onChange={e => setForm({ ...form, is_featured: e.target.checked })}
                    />
                    <div className="absolute left-1 h-4 w-4 rounded-full bg-white transition-all peer-checked:left-6"></div>
                  </div>
                  <span className="text-sm font-semibold text-[#1d1d1f]">Featured Collection</span>
                </label>
              </div>
            </div>

            <div className="bg-white border border-black/10 rounded-3xl p-8 shadow-sm">
              <h5 className="text-[0.7rem] uppercase tracking-widest text-[#86868b] font-bold mb-6">Classification</h5>
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.8rem] font-semibold text-[#1d1d1f] ml-1">Reference SKU</label>
                  <input
                    type="text"
                    className="bg-[#f5f5f7] border border-transparent px-4 py-3 rounded-xl text-sm w-full transition-all focus:bg-white focus:border-[#0071e3] outline-none"
                    value={form.sku}
                    onChange={e => setForm({ ...form, sku: e.target.value })}
                    placeholder="e.g. MRB-001"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[0.8rem] font-semibold text-[#1d1d1f] ml-1">Category Tags</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className={`px-4 py-2 rounded-full text-[0.7rem] font-bold transition-all border-none cursor-pointer ${categoryIds.includes(cat.id) ? 'bg-[#0071e3] text-white shadow-md' : 'bg-[#f5f5f7] text-[#86868b] hover:bg-[#e8e8ed]'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-black/10 rounded-3xl p-8 shadow-sm">
              <h5 className="text-[0.7rem] uppercase tracking-widest text-[#86868b] font-bold mb-6">SEO Context</h5>
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.8rem] font-semibold text-[#1d1d1f] ml-1">Browser Page Title</label>
                  <input
                    type="text"
                    className="bg-[#f5f5f7] border border-transparent px-4 py-3 rounded-xl text-sm w-full transition-all focus:bg-white focus:border-[#0071e3] outline-none"
                    value={form.meta_title}
                    onChange={e => setForm({ ...form, meta_title: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[0.8rem] font-semibold text-[#1d1d1f] ml-1">Serp Description</label>
                  <textarea
                    className="bg-[#f5f5f7] border border-transparent px-4 py-3 rounded-xl text-sm w-full transition-all focus:bg-white focus:border-[#0071e3] outline-none min-h-[100px] resize-none"
                    value={form.meta_description}
                    onChange={e => setForm({ ...form, meta_description: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-black/10 rounded-3xl p-8 shadow-sm">
              <h5 className="text-[0.7rem] uppercase tracking-widest text-[#86868b] font-bold mb-6">Organization</h5>
              <div className="flex flex-col gap-2">
                <label className="text-[0.8rem] font-semibold text-[#1d1d1f] ml-1">Display Sort Order</label>
                <input
                  type="number"
                  className="bg-[#f5f5f7] border border-transparent px-4 py-3 rounded-xl text-sm w-full transition-all focus:bg-white focus:border-[#0071e3] outline-none"
                  value={form.sort_order}
                  onChange={e => setForm({ ...form, sort_order: e.target.value })}
                />
              </div>
            </div>
          </aside>
        </form>
      </div>
    </>
  );
}
