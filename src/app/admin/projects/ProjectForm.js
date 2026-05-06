'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MediaPicker from '@/components/admin/MediaPicker';

export default function ProjectForm({ id }) {
  const router = useRouter();
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [data, setData] = useState({
    title: '',
    description: '',
    image: '',
    client_name: '',
    is_active: true
  });
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/projects/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch project');
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
    const url = id ? `/api/projects/${id}` : '/api/projects';
    const method = id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        router.push('/admin/projects');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save project');
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
              <label className="text-sm font-semibold text-[#86868b] uppercase tracking-wider">Project Title</label>
              <input
                type="text"
                value={data.title}
                onChange={e => setData({ ...data, title: e.target.value })}
                className="w-full p-4 bg-[#f5f5f7] border-none rounded-xl focus:ring-2 focus:ring-[#0071e3] transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#86868b] uppercase tracking-wider">Client / Location</label>
              <input
                type="text"
                value={data.client_name || ''}
                onChange={e => setData({ ...data, client_name: e.target.value })}
                className="w-full p-4 bg-[#f5f5f7] border-none rounded-xl focus:ring-2 focus:ring-[#0071e3] transition-all"
                placeholder="e.g. Royal Palace, London"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#86868b] uppercase tracking-wider">Exhibition Image</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={data.image || ''}
                  onChange={e => setData({ ...data, image: e.target.value })}
                  className="w-full p-4 bg-[#f5f5f7] border-none rounded-xl focus:ring-2 focus:ring-[#0071e3] transition-all"
                  placeholder="/uploads/projects/exhibition.jpg"
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

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#86868b] uppercase tracking-wider">Description (HTML)</label>
            <textarea
              value={data.description || ''}
              onChange={e => setData({ ...data, description: e.target.value })}
              className="w-full p-4 bg-[#f5f5f7] border-none rounded-xl focus:ring-2 focus:ring-[#0071e3] transition-all min-h-[300px] font-mono text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={data.is_active}
              onChange={e => setData({ ...data, is_active: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 text-[#0071e3] focus:ring-[#0071e3]"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-[#1d1d1f]">Active / Visible</label>
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
            {saving ? 'Saving...' : (id ? 'Save Changes' : 'Create Exhibition')}
          </button>
        </div>
      </form>

      {showMediaPicker && (
        <MediaPicker
          onSelect={(path) => setData({ ...data, image: path })}
          onClose={() => setShowMediaPicker(false)}
        />
      )}
    </>
  );
}
