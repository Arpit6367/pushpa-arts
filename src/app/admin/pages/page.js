'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPages() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pages')
      .then(res => res.json())
      .then(data => {
        setPages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const deletePage = async (slug) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    try {
      const res = await fetch(`/api/pages/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setPages(pages.filter(p => p.slug !== slug));
      } else {
        alert('Failed to delete page');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#1d1d1f]">Studio Pages</h1>
        <Link 
          href="/admin/pages/new"
          className="px-6 py-3 bg-[#0071e3] text-white rounded-full font-semibold hover:bg-[#0077ed] transition-all"
        >
          Add New Page
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/5 border-b border-black/5">
              <th className="px-6 py-4 font-semibold text-[0.9rem]">Title</th>
              <th className="px-6 py-4 font-semibold text-[0.9rem]">Slug</th>
              <th className="px-6 py-4 font-semibold text-[0.9rem] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pages.map(page => (
              <tr key={page.id} className="border-b border-black/5 hover:bg-black/[0.02] transition-colors">
                <td className="px-6 py-4 font-medium">{page.title}</td>
                <td className="px-6 py-4 text-[#86868b]">{page.slug}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link 
                    href={`/admin/pages/edit/${page.slug}`}
                    className="text-[#0071e3] hover:underline font-medium text-sm"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => deletePage(page.slug)}
                    className="text-[#ff3b30] hover:underline font-medium text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
