'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditPage({ params }) {
  const router = useRouter();
  const { slug } = React.use(params);
  const [page, setPage] = useState({ title: '', content: '', meta_title: '', meta_description: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/pages/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch page');
        return res.json();
      })
      .then(data => {
        setPage(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/pages/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(page)
      });
      if (res.ok) {
        router.push('/admin/pages');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save page');
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
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="text-2xl text-[#86868b] hover:text-[#1d1d1f]">←</button>
        <h1 className="text-3xl font-bold text-[#1d1d1f]">Edit Page: {page.title}</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#86868b] uppercase tracking-wider">Page Title</label>
            <input 
              type="text" 
              value={page.title} 
              onChange={e => setPage({...page, title: e.target.value})}
              className="w-full p-4 bg-[#f5f5f7] border-none rounded-xl focus:ring-2 focus:ring-[#0071e3] transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#86868b] uppercase tracking-wider">Content (HTML)</label>
            <textarea 
              value={page.content} 
              onChange={e => setPage({...page, content: e.target.value})}
              className="w-full p-4 bg-[#f5f5f7] border-none rounded-xl focus:ring-2 focus:ring-[#0071e3] transition-all min-h-[400px] font-mono text-sm"
              required
            />
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 space-y-6">
          <h2 className="text-xl font-bold text-[#1d1d1f]">SEO Metadata</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#86868b] uppercase tracking-wider">Meta Title</label>
            <input 
              type="text" 
              value={page.meta_title || ''} 
              onChange={e => setPage({...page, meta_title: e.target.value})}
              className="w-full p-4 bg-[#f5f5f7] border-none rounded-xl focus:ring-2 focus:ring-[#0071e3] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#86868b] uppercase tracking-wider">Meta Description</label>
            <textarea 
              value={page.meta_description || ''} 
              onChange={e => setPage({...page, meta_description: e.target.value})}
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
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
