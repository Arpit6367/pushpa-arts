'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MediaPicker from '@/components/admin/MediaPicker';

export default function ClientForm({ id }) {
  const router = useRouter();
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [data, setData] = useState({
    name: '',
    logo: '',
    website_url: '',
    is_active: true,
    sort_order: 0
  });
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/clients/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch client');
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
    const url = id ? `/api/clients/${id}` : '/api/clients';
    const method = id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        router.push('/admin/clients');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save client');
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
              <label className="text-sm font-semibold text-[#86868b] uppercase tracking-wider">Patron Name</label>
              <input 
                type="text" 
                value={data.name} 
                onChange={e => setData({...data, name: e.target.value})}
                className="w-full p-4 bg-[#f5f5f7] border-none rounded-xl focus:ring-2 focus:ring-[#0071e3] transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#86868b] uppercase tracking-wider">Logo</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    value={data.logo || ''} 
                    onChange={e => setData({...data, logo: e.target.value})}
                    className="w-full p-4 bg-[#f5f5f7] border-none rounded-xl focus:ring-2 focus:ring-[#0071e3] transition-all"
                    placeholder="/uploads/clients/logo.png"
                  />
                  {data.logo && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg overflow-hidden border border-black/5">
                      <img src={data.logo} alt="Preview" className="w-full h-full object-cover" />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#86868b] uppercase tracking-wider">Website URL</label>
              <input 
                type="text" 
                value={data.website_url || ''} 
                onChange={e => setData({...data, website_url: e.target.value})}
                className="w-full p-4 bg-[#f5f5f7] border-none rounded-xl focus:ring-2 focus:ring-[#0071e3] transition-all"
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#86868b] uppercase tracking-wider">Sort Order</label>
              <input 
                type="number" 
                value={data.sort_order ?? 0} 
                onChange={e => setData({...data, sort_order: parseInt(e.target.value) || 0})}
                className="w-full p-4 bg-[#f5f5f7] border-none rounded-xl focus:ring-2 focus:ring-[#0071e3] transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="is_active"
              checked={data.is_active} 
              onChange={e => setData({...data, is_active: e.target.checked})}
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
            {saving ? 'Saving...' : (id ? 'Save Changes' : 'Create Patron')}
          </button>
        </div>
      </form>

      {showMediaPicker && (
        <MediaPicker 
          onSelect={(path) => setData({...data, logo: path})}
          onClose={() => setShowMediaPicker(false)}
        />
      )}
    </>
  );
}
