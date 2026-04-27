'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPage() {
  const router = useRouter();
  const [page, setPage] = useState({ title: '', content: '', meta_title: '', meta_description: '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(page)
      });
      if (res.ok) {
        router.push('/admin/pages');
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to create page');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="text-2xl text-[#86868b] hover:text-[#1d1d1f]">←</button>
        <h1 className="text-3xl font-bold text-[#1d1d1f]">Create New Page</h1>
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
              placeholder="e.g. Our Story"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#86868b] uppercase tracking-wider">Content (HTML)</label>
            <textarea 
              value={page.content} 
              onChange={e => setPage({...page, content: e.target.value})}
              className="w-full p-4 bg-[#f5f5f7] border-none rounded-xl focus:ring-2 focus:ring-[#0071e3] transition-all min-h-[400px] font-mono text-sm"
              required
              placeholder="<h1>Your Content</h1>..."
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
            {saving ? 'Creating...' : 'Create Page'}
          </button>
        </div>
      </form>
    </div>
  );
}
