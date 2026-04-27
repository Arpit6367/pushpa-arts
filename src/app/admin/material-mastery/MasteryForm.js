'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MediaPicker from '@/components/admin/MediaPicker';

export default function MasteryForm({ id }) {
  const router = useRouter();
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [item, setItem] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
    sort_order: 0,
    is_active: true
  });
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/material-mastery/${id}`)
        .then(res => res.json())
        .then(data => {
          setItem(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = id ? `/api/material-mastery/${id}` : '/api/material-mastery';
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        router.push('/admin/material-mastery');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-[#1d1d1f]">Material Title</label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-[#f5f5f7] border-none rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none transition-all"
            value={item.title}
            onChange={e => setItem({ ...item, title: e.target.value })}
            required
            placeholder="e.g. Silver Furniture"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-[#1d1d1f]">Description</label>
          <textarea
            className="w-full px-4 py-3 bg-[#f5f5f7] border-none rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none transition-all h-32"
            value={item.description}
            onChange={e => setItem({ ...item, description: e.target.value })}
            required
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-[#1d1d1f]">Showcase Image</label>
          <div className="flex gap-4 items-center">
            {item.image && (
              <div className="w-24 h-24 rounded-xl overflow-hidden border border-black/5">
                <img src={item.image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowMediaPicker(true)}
              className="px-6 py-3 bg-[#1d1d1f] text-white rounded-xl font-semibold hover:bg-black transition-all"
            >
              {item.image ? 'Change Image' : 'Select Image'}
            </button>
            {item.image && (
              <span className="text-xs text-[#86868b] truncate max-w-[200px]">{item.image}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-[#1d1d1f]">Link (Internal or External)</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-[#f5f5f7] border-none rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none transition-all"
              value={item.link}
              onChange={e => setItem({ ...item, link: e.target.value })}
              placeholder="/product-category/silver-furniture"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-[#1d1d1f]">Sort Order</label>
              <input
                type="number"
                className="w-full px-4 py-3 bg-[#f5f5f7] border-none rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none transition-all"
                value={item.sort_order ?? 0}
                onChange={e => setItem({ ...item, sort_order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-center gap-4 pt-8">
              <input
                type="checkbox"
                id="is_active"
                className="w-5 h-5 rounded border-gray-300 text-[#0071e3] focus:ring-[#0071e3]"
                checked={item.is_active}
                onChange={e => setItem({ ...item, is_active: e.target.checked })}
              />
              <label htmlFor="is_active" className="text-sm font-semibold text-[#1d1d1f]">Active</label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-8 border-t border-black/5">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 rounded-full font-semibold text-[#1d1d1f] hover:bg-black/5 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-10 py-3 bg-[#0071e3] text-white rounded-full font-semibold hover:bg-[#0077ed] transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : id ? 'Update Item' : 'Create Item'}
          </button>
        </div>
      </form>

      {showMediaPicker && (
        <MediaPicker 
          onSelect={(path) => setItem({ ...item, image: path })}
          onClose={() => setShowMediaPicker(false)}
        />
      )}
    </>
  );
}
