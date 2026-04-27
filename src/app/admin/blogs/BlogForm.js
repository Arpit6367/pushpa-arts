'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MediaPicker from '@/components/admin/MediaPicker';

export default function BlogForm({ id }) {
  const router = useRouter();
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [data, setData] = useState({
    title: '',
    content: '',
    image: '',
    excerpt: '',
    is_active: true,
    meta_title: '',
    meta_description: ''
  });
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/blogs/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch blog');
          return res.json();
        })
        .then(resData => {
          setData(resData);
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
    const url = id ? `/api/blogs/${id}` : '/api/blogs';
    const method = id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        router.push('/admin/blogs');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save blog');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 rounded-full border-4 border-[#0071e3]/20 border-t-[#0071e3] animate-spin"></div>
    </div>
  );

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#86868b] uppercase tracking-wider">Title</label>
              <input 
                type="text" 
                value={data.title} 
                onChange={e => setData({...data, title: e.target.value})}
                className="w-full p-4 bg-[#f5f5f7] border-none rounded-xl focus:ring-2 focus:ring-[#0071e3] transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#86868b] uppercase tracking-wider">Featured Image</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    value={data.image} 
                    onChange={e => setData({...data, image: e.target.value})}
                    className="w-full p-4 bg-[#f5f5f7] border-none rounded-xl focus:ring-2 focus:ring-[#0071e3] transition-all"
                    placeholder="/uploads/blogs/image.jpg"
                  />
                  {data.image && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg overflow-hidden border border-black/5">
                      <img src={data.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <button 
                  type="button" 
                  onClick={() => setShowMediaPicker(true)}
                  className="px-6 py-4 bg-[#1d1d1f] text-white rounded-xl font-semibold hover:bg-black transition-all"
                >
                  Gallery
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#86868b] uppercase tracking-wider">Excerpt (Brief Summary)</label>
            <textarea 
              value={data.excerpt} 
              onChange={e => setData({...data, excerpt: e.target.value})}
              className="w-full p-4 bg-[#f5f5f7] border-none rounded-xl focus:ring-2 focus:ring-[#0071e3] transition-all min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#86868b] uppercase tracking-wider">Content (HTML)</label>
            <textarea 
              value={data.content} 
              onChange={e => setData({...data, content: e.target.value})}
              className="w-full p-4 bg-[#f5f5f7] border-none rounded-xl focus:ring-2 focus:ring-[#0071e3] transition-all min-h-[400px] font-mono text-sm"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="is_active"
              checked={data.is_active} 
              onChange={e => setData({...data, is_active: e.target.checked})}
              className="w-5 h-5 rounded border-gray-300 text-[#0071e3] focus:ring-[#0071e3]"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-[#1d1d1f]">Published / Active</label>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 space-y-6">
          <h2 className="text-xl font-bold text-[#1d1d1f]">SEO Metadata</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#86868b] uppercase tracking-wider">Meta Title</label>
            <input 
              type="text" 
              value={data.meta_title || ''} 
              onChange={e => setData({...data, meta_title: e.target.value})}
              className="w-full p-4 bg-[#f5f5f7] border-none rounded-xl focus:ring-2 focus:ring-[#0071e3] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#86868b] uppercase tracking-wider">Meta Description</label>
            <textarea 
              value={data.meta_description || ''} 
              onChange={e => setData({...data, meta_description: e.target.value})}
              className="w-full p-4 bg-[#f5f5f7] border-none rounded-xl focus:ring-2 focus:ring-[#0071e3] transition-all min-h-[100px]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button 
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 bg-[#f5f5f7] text-[#1d1d1f] rounded-full font-semibold hover:bg-black/5 transition-all"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={saving}
            className="px-10 py-3 bg-[#0071e3] text-white rounded-full font-semibold hover:bg-[#0077ed] transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : (id ? 'Save Changes' : 'Create Post')}
          </button>
        </div>
      </form>

      {showMediaPicker && (
        <MediaPicker 
          onSelect={(path) => setData({...data, image: path})}
          onClose={() => setShowMediaPicker(false)}
        />
      )}
    </>
  );
}
