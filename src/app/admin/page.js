'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Package,
  Layers,
  Image as ImageIcon,
  MessageSquare,
  Plus,
  ArrowUpRight,
  Activity,
  BarChart3
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ categories: 0, products: 0, files: 0, activeProds: 0, featured: 0, inquiries: 0, newInquiries: 0 });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const [catRes, prodRes, fileRes, inqRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products?limit=5'),
          fetch('/api/files'),
          fetch('/api/contact')
        ]);

        const catData = await catRes.json();
        const prodData = await prodRes.json();
        const fileData = await fileRes.json();
        const inqData = await inqRes.json();

        if (Array.isArray(catData)) setStats(s => ({ ...s, categories: catData.length }));

        if (prodData.products) {
          setRecentProducts(prodData.products);
          setStats(s => ({
            ...s,
            products: prodData.pagination?.total || prodData.products.length,
            activeProds: prodData.products.filter(p => p.is_active).length,
            featured: prodData.products.filter(p => p.is_featured).length
          }));
        }

        if (fileData.files) setStats(s => ({ ...s, files: fileData.files.length }));

        if (inqData.pagination) {
          setStats(s => ({ ...s, inquiries: inqData.pagination.total, newInquiries: inqData.statusCounts?.new || 0 }));
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-[#fbfbfd]">
        <div className="w-8 h-8 rounded-full border-4 border-[#0071e3]/20 border-t-[#0071e3] animate-spin"></div>
      </div>
    );
  }

  // Custom SVG Chart Data
  const chartPoints = "0,80 40,60 80,75 120,40 160,55 200,30 240,45 280,20 320,35 360,10";
  const areaPath = `M ${chartPoints} V 100 H 0 Z`;

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] p-4 sm:p-8 lg:p-12 font-admin antialiased">

      {/* Header */}
      <header className="mb-8 sm:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <p className="text-[0.7rem] sm:text-[0.8rem] text-[#86868b] font-bold uppercase tracking-widest">Studio Intelligence</p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1d1d1f]">Dashboard</h1>
        </div>
        <Link href="/admin/products/new" className="w-full sm:w-auto text-center bg-[#0071e3] text-white px-8 py-3.5 rounded-2xl text-[0.9rem] font-bold hover:bg-[#0071e3]/90 transition-all shadow-lg shadow-[#0071e3]/20 active:scale-95">
          + New Masterpiece
        </Link>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 auto-rows-auto md:auto-rows-[160px]">

        {/* Analytics Chart Card */}
        <div className="md:col-span-8 md:row-span-2 bg-white rounded-[24px] sm:rounded-[32px] border border-black/5 p-6 sm:p-8 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow group min-h-[300px] md:min-h-0">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2"><BarChart3 size={20} className="text-[#0071e3]" /> Studio Activity</h3>
              <p className="text-[#86868b] text-[0.75rem] sm:text-[0.85rem] mt-1">Growth & Interaction Trends</p>
            </div>
            <span className="px-3 py-1 bg-[#34c759]/10 text-[#34c759] rounded-full text-[0.65rem] sm:text-[0.7rem] font-bold">
              +{stats.products > 0 ? (Math.min(25, (stats.activeProds / stats.products * 12) + (stats.inquiries * 0.5)).toFixed(1)) : '0.0'}%
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 px-2 pointer-events-none">
            <svg viewBox="0 0 360 100" className="w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lightChartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0071e3" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#0071e3" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#lightChartGradient)" />
              <polyline
                fill="none"
                stroke="#0071e3"
                strokeWidth="2.5"
                points={chartPoints}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="absolute top-1/2 right-12 -translate-y-1/2 hidden lg:flex flex-col gap-6 text-right">
            <div>
              <p className="text-[0.65rem] uppercase font-bold text-[#86868b]">Featured Highlights</p>
              <p className="text-2xl font-bold text-[#1d1d1f]">
                {stats.featured} Masterpieces
              </p>
            </div>
            <div>
              <p className="text-[0.65rem] uppercase font-bold text-[#86868b]">Total Outreach</p>
              <p className="text-2xl font-bold text-[#1d1d1f]">
                {stats.inquiries} Inquiries
              </p>
            </div>
          </div>
        </div>

        {/* Inquiry Card */}
        <div className="md:col-span-4 md:row-span-2 bg-[#0071e3] rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 flex flex-col justify-between text-white shadow-xl shadow-[#0071e3]/20 hover:scale-[1.01] transition-transform group relative overflow-hidden min-h-[240px] md:min-h-0">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <MessageSquare size={24} />
              <ArrowUpRight size={20} className="opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="mt-auto">
              <h3 className="text-4xl sm:text-5xl font-bold tracking-tighter mb-2">{stats.newInquiries}</h3>
              <p className="text-white/90 text-[0.9rem] sm:text-[1rem] leading-tight font-medium">New Client Inquiries awaiting response.</p>
              <Link href="/admin/inquiries" className="inline-block mt-6 px-5 py-2 bg-white/20 hover:bg-white/30 rounded-full text-[0.75rem] sm:text-[0.8rem] font-bold transition-all">
                Manage All →
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="md:col-span-3 bg-white rounded-[24px] border border-black/5 p-6 shadow-sm flex flex-col justify-between group hover:border-[#0071e3]/30 transition-colors">
          <div className="flex justify-between text-[#86868b]"><Package size={18} /> <span className="text-[0.65rem] font-bold uppercase tracking-widest">Total Pieces</span></div>
          <h4 className="text-2xl font-bold mt-4">{stats.products}</h4>
        </div>

        <div className="md:col-span-3 bg-white rounded-[24px] border border-black/5 p-6 shadow-sm flex flex-col justify-between group hover:border-[#0071e3]/30 transition-colors">
          <div className="flex justify-between text-[#86868b]"><Layers size={18} /> <span className="text-[0.65rem] font-bold uppercase tracking-widest">Collections</span></div>
          <h4 className="text-2xl font-bold mt-4">{stats.categories}</h4>
        </div>

        <div className="md:col-span-3 bg-white rounded-[24px] border border-black/5 p-6 shadow-sm flex flex-col justify-between group hover:border-[#0071e3]/30 transition-colors">
          <div className="flex justify-between text-[#86868b]"><ImageIcon size={18} /> <span className="text-[0.65rem] font-bold uppercase tracking-widest">Media</span></div>
          <h4 className="text-2xl font-bold mt-4">{stats.files}</h4>
        </div>

        <div className="md:col-span-3 bg-white rounded-[24px] border border-black/5 p-6 shadow-sm flex flex-col justify-between group hover:border-[#0071e3]/30 transition-colors">
          <div className="flex justify-between text-[#86868b]"><TrendingUp size={18} /> <span className="text-[0.65rem] font-bold uppercase tracking-widest">Live Now</span></div>
          <h4 className="text-2xl font-bold mt-4 text-[#34c759]">{stats.activeProds}</h4>
        </div>

        {/* Recent Products Grid */}
        <div className="md:col-span-12 bg-white rounded-[32px] border border-black/5 p-8 sm:p-10 mt-4 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold text-[#1d1d1f]">Latest Additions</h3>
            <Link href="/admin/products" className="text-[#0071e3] text-[0.85rem] font-bold hover:underline">View Collection →</Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {recentProducts.map(p => (
              <div key={p.id} className="group cursor-pointer space-y-3">
                <div className="aspect-[4/5] rounded-[20px] overflow-hidden bg-[#f5f5f7] border border-black/5 relative group-hover:shadow-lg transition-all duration-500">
                  {p.primary_image || p.first_image ? (
                    <img src={p.primary_image || p.first_image} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#ccc]"><ImageIcon size={24} /></div>
                  )}
                </div>
                <div className="px-1">
                  <h4 className="text-[0.85rem] font-bold text-[#1d1d1f] truncate group-hover:text-[#0071e3] transition-colors">{p.name}</h4>
                  <p className="text-[0.7rem] text-[#86868b] font-medium uppercase tracking-tight">{p.category_name || 'Artisanal Piece'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

