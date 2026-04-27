'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MediaPicker from '@/components/admin/MediaPicker';

export default function HeroSlideForm({ id }) {
  const router = useRouter();
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [slide, setSlide] = useState({
    title: '',
    subtitle: '',
    image: '',
    button_text: 'Explore Collection',
    button_link: '/',
    sort_order: 0,
    is_active: true
  });
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/hero-slides/${id}`)
        .then(res => res.json())
        .then(data => {
          setSlide(data);
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
      const url = id ? `/api/hero-slides/${id}` : '/api/hero-slides';
      const method = id ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slide),
      });
      if (res.ok) {
        router.push('/admin/hero-slides');
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-[#1d1d1f]">Slide Title (supports \\n for line breaks)</label>
            <textarea
              className="w-full px-4 py-3 bg-[#f5f5f7] border-none rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none transition-all h-32"
              value={slide.title}
              onChange={e => setSlide({ ...slide, title: e.target.value })}
              required
              placeholder="Masterpieces of Mewar\\nHandcrafted Luxury"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-[#1d1d1f]">Subtitle</label>
            <textarea
              className="w-full px-4 py-3 bg-[#f5f5f7] border-none rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none transition-all h-32"
              value={slide.subtitle}
              onChange={e => setSlide({ ...slide, subtitle: e.target.value })}
              placeholder="Bespoke luxury furniture from Udaipur"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-[#1d1d1f]">Hero Image</label>
          <div className="flex gap-4 items-center">
            {slide.image && (
              <div className="w-40 h-24 rounded-xl overflow-hidden border border-black/5">
                <img src={slide.image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowMediaPicker(true)}
              className="px-6 py-3 bg-[#1d1d1f] text-white rounded-xl font-semibold hover:bg-black transition-all"
            >
              {slide.image ? 'Change Hero Image' : 'Select Hero Image'}
            </button>
            {slide.image && (
              <span className="text-xs text-[#86868b] truncate max-w-[200px]">{slide.image}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-[#1d1d1f]">Button Text</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-[#f5f5f7] border-none rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none transition-all"
              value={slide.button_text}
              onChange={e => setSlide({ ...slide, button_text: e.target.value })}
            />
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-[#1d1d1f]">Button Link</label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-[#f5f5f7] border-none rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none transition-all"
              value={slide.button_link}
              onChange={e => setSlide({ ...slide, button_link: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-[#1d1d1f]">Sort Order</label>
            <input
              type="number"
              className="w-full px-4 py-3 bg-[#f5f5f7] border-none rounded-xl focus:ring-2 focus:ring-[#0071e3] outline-none transition-all"
              value={slide.sort_order ?? 0}
              onChange={e => setSlide({ ...slide, sort_order: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="flex items-center gap-4 pt-8">
            <input
              type="checkbox"
              id="is_active"
              className="w-5 h-5 rounded border-gray-300 text-[#0071e3] focus:ring-[#0071e3]"
              checked={slide.is_active}
              onChange={e => setSlide({ ...slide, is_active: e.target.checked })}
            />
            <label htmlFor="is_active" className="text-sm font-semibold text-[#1d1d1f]">Active and Visible</label>
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
            {saving ? 'Saving...' : id ? 'Update Slide' : 'Create Slide'}
          </button>
        </div>
      </form>

      {showMediaPicker && (
        <MediaPicker 
          onSelect={(path) => setSlide({ ...slide, image: path })}
          onClose={() => setShowMediaPicker(false)}
        />
      )}
    </>
  );
}
