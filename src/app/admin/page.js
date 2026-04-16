'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ categories: 0, products: 0, files: 0, activeProds: 0, featured: 0 });
  const [recentProducts, setRecentProducts] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const catRes = await fetch('/api/categories');
        const catData = await catRes.json();
        if (Array.isArray(catData)) {
          setStats(s => ({ ...s, categories: catData.length }));
          setTopCategories([...catData].sort((a, b) => (b.product_count || 0) - (a.product_count || 0)).slice(0, 4));
        }

        const prodRes = await fetch('/api/products?limit=8');
        const prodData = await prodRes.json();
        if (prodData.products) {
          setRecentProducts(prodData.products);
          const total = prodData.pagination?.total || prodData.products.length;
          const active = prodData.products.filter(p => p.is_active).length;
          setStats(s => ({ 
            ...s, 
            products: total,
            activeProds: active,
            featured: prodData.products.filter(p => p.is_featured).length 
          }));
        }

        const fileRes = await fetch('/api/files');
        const fileData = await fileRes.json();
        if (fileData.files) setStats(s => ({ ...s, files: fileData.files.length }));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="px-12 py-10 flex justify-between items-center sticky top-0 z-50 bg-[#fbfbfd]/90 backdrop-blur-md">
        <div>
          <p className="text-[0.85rem] text-[#86868b] mb-2 font-medium">Studio Control Center</p>
          <h1 className="text-[#0071e3] text-3xl font-bold tracking-tight">Overview</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products/new" className="bg-[#0071e3] text-white px-5 py-2.5 rounded-[10px] text-[0.85rem] font-semibold hover:bg-[#0071e3]/90 transition-colors shadow-sm">+ Launch New Masterpiece</Link>
        </div>
      </div>

      <div className="px-12 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Main Stat: Stock Health */}
          <div className="col-span-1 lg:col-span-2 bg-white border border-black/10 rounded-2xl p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#1d1d1f]">Collection Status</h3>
              <span className="text-2xl">🪴</span>
            </div>
            <div className="mt-10">
              <div className="mb-8">
                <div className="flex justify-between text-[0.8rem] text-[#86868b] mb-3">
                  <span>Studio Visibility</span>
                  <span className="text-[#1d1d1f] font-semibold">{Math.round((stats.activeProds / (stats.products || 1)) * 100)}% Live</span>
                </div>
                <div className="h-2.5 bg-[#f0f0f0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0071e3] transition-all duration-1000 rounded-full" style={{ width: `${(stats.activeProds / (stats.products || 1)) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[0.8rem] text-[#86868b] mb-3">
                  <span>Collections Curated</span>
                  <span className="text-[#1d1d1f] font-semibold">{stats.categories} Collections</span>
                </div>
                <div className="h-2.5 bg-[#f0f0f0] rounded-full overflow-hidden">
                  <div className="h-full bg-[#bf9140] transition-all duration-1000 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1 bg-white border border-black/10 rounded-2xl p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col gap-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#1d1d1f]">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4 mt-2">
              <Link href="/admin/products/new" className="flex flex-col items-center gap-3 p-5 bg-[#fbfbfd] border border-black/10 rounded-[16px] cursor-pointer transition-all hover:bg-white hover:border-[#0071e3] hover:-translate-y-1 hover:shadow-md text-center text-[#1d1d1f]">
                <span className="text-[1.5rem] p-3 mx-auto bg-white rounded-xl shadow-sm block">📦</span>
                <span className="text-[0.75rem] font-semibold leading-tight mt-1">New Masterpiece</span>
              </Link>
              <Link href="/admin/categories" className="flex flex-col items-center gap-3 p-5 bg-[#fbfbfd] border border-black/10 rounded-[16px] cursor-pointer transition-all hover:bg-white hover:border-[#0071e3] hover:-translate-y-1 hover:shadow-md text-center text-[#1d1d1f]">
                <span className="text-[1.5rem] p-3 mx-auto bg-white rounded-xl shadow-sm block">📁</span>
                <span className="text-[0.75rem] font-semibold leading-tight mt-1">Collections</span>
              </Link>
              <Link href="/admin/file-manager" className="flex flex-col items-center gap-3 p-5 bg-[#fbfbfd] border border-black/10 rounded-[16px] cursor-pointer transition-all hover:bg-white hover:border-[#0071e3] hover:-translate-y-1 hover:shadow-md text-center text-[#1d1d1f]">
                <span className="text-[1.5rem] p-3 mx-auto bg-white rounded-xl shadow-sm block">🖼️</span>
                <span className="text-[0.75rem] font-semibold leading-tight mt-1">Gallery Studio</span>
              </Link>
            </div>
          </div>

          {/* Featured Highlights */}
          <div className="bg-white border border-black/10 rounded-2xl p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#1d1d1f]">Featured</h3>
            </div>
            <h3 className="text-[2.5rem] my-2 font-bold tracking-tight text-[#1d1d1f]">{stats.featured}</h3>
            <p className="text-[0.85rem] text-[#86868b] font-medium">Showcased on main gallery</p>
          </div>

          {/* Media Count */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2 bg-white border border-black/10 rounded-2xl p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-[#1d1d1f]">Total Media</h3>
            </div>
            <h3 className="text-[2.5rem] my-2 font-bold tracking-tight text-[#1d1d1f]">{stats.files}</h3>
            <p className="text-[0.85rem] text-[#86868b] font-medium">Artisanal Media</p>
          </div>
        </div>

        {/* Recent Products Grid */}
        <div className="bg-white rounded-[20px] p-10 shadow-sm border border-black/10">
          <div className="flex justify-between items-center mb-10">
            <h3 className="m-0 text-xl font-bold text-[#1d1d1f]">Latest Additions</h3>
            <Link href="/admin/products" className="text-[0.85rem] text-[#0071e3] font-semibold hover:underline">View Full Collection →</Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProducts.length > 0 ? recentProducts.map(p => (
              <div key={p.id} className="flex flex-col gap-3 group">
                <div className="aspect-square rounded-xl overflow-hidden bg-[#f5f5f7] border border-black/5 relative">
                  {(p.primary_image || p.first_image) ? (
                    <img src={p.primary_image || p.first_image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#ccc] text-2xl">📷</div>
                  )}
                </div>
                <div>
                  <h4 className="text-[0.95rem] font-semibold text-[#1d1d1f] truncate leading-snug">{p.name}</h4>
                  <div className="flex justify-between items-center mt-1.5">
                    <span className="text-[0.75rem] text-[#86868b] font-medium truncate">{p.category_name || 'Uncategorized'}</span>
                    <span className={`px-2 py-1 rounded-[6px] text-[0.65rem] font-bold uppercase tracking-wider ${p.is_active ? 'bg-[#34c759]/10 text-[#34c759]' : 'bg-[#ff3b30]/10 text-[#ff3b30]'}`}>{p.is_active ? 'Live' : 'Hidden'}</span>
                  </div>
                </div>
              </div>
            )) : (
              <p className="col-span-full text-center text-[#aaa] py-8">No recent updates</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

