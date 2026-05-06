'use client';
import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import MediaPicker from '@/components/admin/MediaPicker';
import SearchableSelect from '@/components/admin/SearchableSelect';

export default function AdminProductEditPage({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [images, setImages] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [form, setForm] = useState({
    name: '',
    short_description: '',
    description: '',
    sku: '',
    price: '',
    sale_price: '',
    weight: '',
    length: '',
    width: '',
    height: '',
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
            price: p.price || '',
            sale_price: p.sale_price || '',
            weight: p.weight || '',
            length: p.length || '',
            width: p.width || '',
            height: p.height || '',
            category_id: p.category_id || '',
            is_featured: p.is_featured,
            is_active: p.is_active,
            sort_order: p.sort_order || 0,
            meta_title: p.meta_title || '',
            meta_description: p.meta_description || '',
          });
          setImages(prodData.images || []);
          setCategoryIds(prodData.categories?.map(c => c.id) || (p.category_id ? [p.category_id] : []));
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

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 rounded-full border-4 border-[#0071e3]/20 border-t-[#0071e3] animate-spin"></div>
    </div>
  );

  return (
    <>
      <div className="flex justify-between items-center px-12 py-10 sticky top-0 z-50 bg-[#fbfbfd]/90 backdrop-blur-md">
        <div>
          <p className="text-[0.75rem] uppercase tracking-wider text-[#86868b] font-semibold mb-1">Catalog / Edit Mode</p>
          <h1 className="text-3xl font-heading text-[#1d1d1f]">{form.name || 'Edit Product'}</h1>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-black/10 text-[#1d1d1f] px-6 py-2.5 rounded-[12px] text-[0.85rem] font-semibold hover:bg-black/5 transition-all cursor-pointer" onClick={() => router.back()}>Exit</button>
          <button className="bg-[#0071e3] text-white px-6 py-2.5 rounded-[12px] text-[0.85rem] font-semibold hover:bg-[#0071e3]/90 transition-all shadow-lg shadow-[#0071e3]/20 cursor-pointer disabled:opacity-50" onClick={handleSubmit} disabled={saving}>{saving ? 'Syncing...' : 'Sync Changes'}</button>
        </div>
      </div>

      <div className="px-12 pb-20">
        {toast && <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-xl text-[0.9rem] font-medium z-[3000] shadow-xl transition-all ${toast.type === 'error' ? 'bg-[#ff3b30] text-white' : 'bg-[#34c759] text-white'}`}>{toast.message}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-8">
            <div className="bg-white border border-black/10 rounded-3xl p-8 md:p-12 shadow-sm">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.85rem] font-semibold text-[#1d1d1f] ml-1">Identity</label>
                  <input
                    type="text"
                    className="bg-[#f5f5f7] border border-transparent px-6 py-5 rounded-2xl text-2xl font-semibold w-full transition-all focus:bg-white focus:border-[#0071e3] outline-none placeholder:text-[#d2d2d7]"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[0.85rem] font-semibold text-[#1d1d1f] ml-1">Storytelling</label>
                  <textarea
                    className="bg-[#f5f5f7] border border-transparent px-6 py-5 rounded-2xl text-base w-full transition-all focus:bg-white focus:border-[#0071e3] outline-none min-h-[300px] resize-none leading-relaxed"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={12}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-black/10 rounded-3xl p-8 md:p-12 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-[#1d1d1f]">Artisan Media</h3>
                <button type="button" className="bg-[#f5f5f7] text-[#1d1d1f] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#e8e8ed] transition-colors" onClick={() => fileInputRef.current?.click()}>Upload New</button>
              </div>
              <div
                className="bg-[#fafafa] border-2 border-dashed border-[#d2d2d7] rounded-3xl p-12 text-center cursor-pointer hover:bg-[#f5f5f7] transition-all group"
                onClick={() => setShowMediaPicker(true)}
              >
                {uploading ? (
                  <div className="w-8 h-8 rounded-full border-4 border-[#0071e3]/20 border-t-[#0071e3] animate-spin mx-auto"></div>
                ) : (
                  <>
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🖼️</div>
                    <p className="text-[#1d1d1f] font-bold">Manage Studio Imagery</p>
                    <p className="text-[#86868b] font-medium mt-1">Upload new or select from your gallery</p>
                    <p className="text-[0.7rem] text-[#b4b4b4] mt-4 uppercase tracking-widest font-bold">Click to open gallery</p>
                  </>
                )}
                <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
              </div>
              {images.length > 0 && (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-6 mt-10">
                  {images.map((img, index) => (
                    <div key={index} className="group relative aspect-square rounded-2xl overflow-hidden border border-black/10 shadow-sm transition-all hover:shadow-md">
                      <img src={img.file_path} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur shadow-sm flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#ff3b30] hover:text-white border-none cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); setImages(images.filter((_, i) => i !== index)); }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {showMediaPicker && (
            <MediaPicker
              multiple={true}
              onClose={() => setShowMediaPicker(false)}
              onSelect={(paths) => {
                const newImages = paths.map(path => ({ file_path: path, alt_text: '' }));
                // Filter out duplicates
                const existingPaths = images.map(img => img.file_path);
                const uniqueNewImages = newImages.filter(img => !existingPaths.includes(img.file_path));
                setImages([...images, ...uniqueNewImages]);
                showToast(`${uniqueNewImages.length} images added`);
              }}
            />
          )}

          <aside className="space-y-6">
            <div className="bg-white border border-black/10 rounded-3xl p-8 shadow-sm">
              <h5 className="text-[0.7rem] uppercase tracking-widest text-[#86868b] font-bold mb-6">Publicity</h5>
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 rounded-2xl hover:bg-[#f5f5f7] transition-colors cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="peer h-6 w-11 appearance-none rounded-full bg-[#d2d2d7] checked:bg-[#34c759] transition-all cursor-pointer"
                      id="is_active" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })}
                    />
                    <div className="absolute left-1 h-4 w-4 rounded-full bg-white transition-all peer-checked:left-6"></div>
                  </div>
                  <span className="text-sm font-semibold text-[#1d1d1f]">Public on Gallery</span>
                </label>

                <label className="flex items-center gap-3 p-4 rounded-2xl hover:bg-[#f5f5f7] transition-colors cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="peer h-6 w-11 appearance-none rounded-full bg-[#d2d2d7] checked:bg-[#ffcc00] transition-all cursor-pointer"
                      id="is_featured" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })}
                    />
                    <div className="absolute left-1 h-4 w-4 rounded-full bg-white transition-all peer-checked:left-6"></div>
                  </div>
                  <span className="text-sm font-semibold text-[#1d1d1f]">Promoted Item</span>
                </label>
              </div>
            </div>

            <div className="bg-white border border-black/10 rounded-3xl p-8 shadow-sm">
              <h5 className="text-[0.7rem] uppercase tracking-widest text-[#86868b] font-bold mb-6">Commercials</h5>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.8rem] font-semibold text-[#1d1d1f] ml-1">Regular Price (₹)</label>
                  <input
                    type="number"
                    className="bg-[#f5f5f7] border border-transparent px-4 py-3 rounded-xl text-sm w-full transition-all focus:bg-white focus:border-[#0071e3] outline-none"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[0.8rem] font-semibold text-[#1d1d1f] ml-1">Sale Price (₹)</label>
                  <input
                    type="number"
                    className="bg-[#f5f5f7] border border-transparent px-4 py-3 rounded-xl text-sm w-full transition-all focus:bg-white focus:border-[#0071e3] outline-none"
                    value={form.sale_price}
                    onChange={e => setForm({ ...form, sale_price: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-black/10 rounded-3xl p-8 shadow-sm">
              <h5 className="text-[0.7rem] uppercase tracking-widest text-[#86868b] font-bold mb-6">Technical Specs</h5>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.8rem] font-semibold text-[#1d1d1f] ml-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="bg-[#f5f5f7] border border-transparent px-4 py-3 rounded-xl text-sm w-full transition-all focus:bg-white focus:border-[#0071e3] outline-none"
                    value={form.weight}
                    onChange={e => setForm({ ...form, weight: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[0.8rem] font-semibold text-[#1d1d1f] ml-1">Length (cm)</label>
                  <input
                    type="number"
                    className="bg-[#f5f5f7] border border-transparent px-4 py-3 rounded-xl text-sm w-full transition-all focus:bg-white focus:border-[#0071e3] outline-none"
                    value={form.length}
                    onChange={e => setForm({ ...form, length: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[0.8rem] font-semibold text-[#1d1d1f] ml-1">Width (cm)</label>
                  <input
                    type="number"
                    className="bg-[#f5f5f7] border border-transparent px-4 py-3 rounded-xl text-sm w-full transition-all focus:bg-white focus:border-[#0071e3] outline-none"
                    value={form.width}
                    onChange={e => setForm({ ...form, width: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[0.8rem] font-semibold text-[#1d1d1f] ml-1">Height (cm)</label>
                  <input
                    type="number"
                    className="bg-[#f5f5f7] border border-transparent px-4 py-3 rounded-xl text-sm w-full transition-all focus:bg-white focus:border-[#0071e3] outline-none"
                    value={form.height}
                    onChange={e => setForm({ ...form, height: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-black/10 rounded-3xl p-8 shadow-sm">
              <h5 className="text-[0.7rem] uppercase tracking-widest text-[#86868b] font-bold mb-6">Inventory Details</h5>
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.8rem] font-semibold text-[#1d1d1f] ml-1">Unique SKU</label>
                  <input
                    type="text"
                    className="bg-[#f5f5f7] border border-transparent px-4 py-3 rounded-xl text-sm w-full transition-all focus:bg-white focus:border-[#0071e3] outline-none"
                    value={form.sku}
                    onChange={e => setForm({ ...form, sku: e.target.value })}
                  />
                </div>
                <SearchableSelect
                  options={categories}
                  selectedIds={categoryIds}
                  onToggle={toggleCategory}
                  placeholder="Select collections..."
                />
              </div>
            </div>

            <div className="bg-white border border-black/10 rounded-3xl p-8 shadow-sm">
              <h5 className="text-[0.7rem] uppercase tracking-widest text-[#86868b] font-bold mb-6">Metadata (SEO)</h5>
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[0.8rem] font-semibold text-[#1d1d1f] ml-1">Browser Title</label>
                  <input
                    type="text"
                    className="bg-[#f5f5f7] border border-transparent px-4 py-3 rounded-xl text-sm w-full transition-all focus:bg-white focus:border-[#0071e3] outline-none"
                    value={form.meta_title}
                    onChange={e => setForm({ ...form, meta_title: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[0.8rem] font-semibold text-[#1d1d1f] ml-1">Keywords Summary</label>
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
              <h5 className="text-[0.7rem] uppercase tracking-widest text-[#86868b] font-bold mb-6">Sorting</h5>
              <div className="flex flex-col gap-2">
                <label className="text-[0.8rem] font-semibold text-[#1d1d1f] ml-1">Position Index</label>
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
