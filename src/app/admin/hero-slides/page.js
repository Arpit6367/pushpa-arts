'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminHeroSlides() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/hero-slides')
      .then(res => res.json())
      .then(data => {
        setSlides(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const deleteSlide = async (id) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    try {
      const res = await fetch(`/api/hero-slides/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSlides(slides.filter(s => s.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#1d1d1f]">Hero Sections (Home Slider)</h1>
        <Link 
          href="/admin/hero-slides/new"
          className="px-6 py-3 bg-[#0071e3] text-white rounded-full font-semibold hover:bg-[#0077ed] transition-all"
        >
          New Slide
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/5 border-b border-black/5">
              <th className="px-6 py-4 font-semibold text-[0.9rem]">Preview</th>
              <th className="px-6 py-4 font-semibold text-[0.9rem]">Title</th>
              <th className="px-6 py-4 font-semibold text-[0.9rem]">Order</th>
              <th className="px-6 py-4 font-semibold text-[0.9rem]">Status</th>
              <th className="px-6 py-4 font-semibold text-[0.9rem] text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slides.map(slide => (
              <tr key={slide.id} className="border-b border-black/5 hover:bg-black/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <img src={slide.image} alt="" className="w-20 h-12 object-cover rounded shadow-sm" />
                </td>
                <td className="px-6 py-4 font-medium">{slide.title}</td>
                <td className="px-6 py-4 text-[#86868b]">{slide.sort_order}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${slide.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {slide.is_active ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link 
                    href={`/admin/hero-slides/edit/${slide.id}`}
                    className="text-[#0071e3] hover:underline font-medium text-sm"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => deleteSlide(slide.id)}
                    className="text-[#ff3b30] hover:underline font-medium text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {slides.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-[#86868b]">No hero slides found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
