'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setChecking(false);
      setIsAuthenticated(true);
      return;
    }

    fetch('/api/files')
      .then(res => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else if (res.status === 401) {
          router.push('/admin/login');
        } else {
          setIsAuthenticated(true);
        }
        setChecking(false);
      })
      .catch(() => {
        setIsAuthenticated(false);
        router.push('/admin/login');
        setChecking(false);
      });
  }, [pathname, router]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f5f5f7]">
        <div className="w-8 h-8 rounded-full border-4 border-[#0071e3]/20 border-t-[#0071e3] animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const navItems = [
    { href: '/admin', label: 'Overview', icon: '📊' },
    { href: '/admin/categories', label: 'Collections', icon: '📁' },
    { href: '/admin/products', label: 'Masterpieces', icon: '📦' },
    { href: '/admin/products/new', label: 'New Masterpiece', icon: '➕' },
    { href: '/admin/inquiries', label: 'Inquiries', icon: '📩' },
    { href: '/admin/file-manager', label: 'Studio Gallery', icon: '🖼️' },
  ];

  return (
    <div className="flex min-h-screen bg-[#fbfbfd] font-admin text-[#1d1d1f] antialiased lg:flex-row">
      <div className="lg:hidden fixed top-0 left-0 right-0 h-[60px] bg-white/75 backdrop-blur-xl border-b border-black/10 z-[1500] flex items-center justify-between px-5">
        <button className="text-2xl bg-none border-none text-[#111] cursor-pointer p-2 flex items-center justify-center" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
        <div className="brand-logo">
          <img src="/images/Pushpa-Exports.svg" alt="Logo" className="h-6 brightness-0" />
        </div>
        <div className="w-10"></div>
      </div>

      <aside className={`w-[260px] bg-white/75 backdrop-blur-xl border-r border-black/10 p-0 fixed top-0 left-0 bottom-0 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0 shadow-[10px_0_40px_rgba(0,0,0,0.15)] z-[1200]' : '-translate-x-full z-[1050]'} lg:z-[1000]`}>
        <div className="px-8 py-12 flex flex-col gap-2">
          <img src="/images/Pushpa-Exports.svg" alt="Pushpa Exports" className="h-[70px] ml-8 w-auto self-start" />
          <p className="text-[0.65rem] text-[#86868b] uppercase tracking-[0.2rem] font-semibold">Studio Management</p>
        </div>
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          {navItems.map(item => {
            const isActive = item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href) && (pathname.length === item.href.length || pathname[item.href.length] === '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-5 py-3 text-[0.95rem] transition-all duration-200 rounded-[10px] mb-1 ${isActive ? 'bg-[#0071e3] text-white font-medium' : 'text-[#1d1d1f] font-normal hover:bg-black/5'}`}
              >
                <span className="text-[1.2rem]">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-5 py-6 border-t border-black/10 flex flex-col gap-3">
          <Link href="/" className="w-full p-3 bg-black/5 border border-black/10 text-[#1d1d1f] rounded-[10px] text-[0.9rem] font-semibold text-center mt-2 transition-all hover:bg-[#ff3b30]/10 hover:border-[#ff3b30]/20 hover:text-[#ff3b30]">
            Visit Store
          </Link>
          <button onClick={handleLogout} className="w-full p-3 bg-black/5 border border-black/10 text-[#1d1d1f] rounded-[10px] text-[0.9rem] font-medium cursor-pointer transition-all hover:bg-[#ff3b30]/10 hover:border-[#ff3b30]/20 hover:text-[#ff3b30]">Sign Out</button>
        </div>
      </aside>

      <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[900] transition-all duration-300 lg:hidden ${sidebarOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}`} onClick={() => setSidebarOpen(false)} />

      <div className="flex-1 bg-[#fbfbfd] min-h-screen transition-all duration-300 lg:ml-[260px] ml-0 pt-[60px] lg:pt-0">
        <div className="px-4 sm:px-8 lg:px-12 lg:pt-10 pt-4 text-[0.85rem] font-medium text-[#86868b] flex items-center gap-2 overflow-x-auto">
          <Link href="/admin" className="hover:text-[#1d1d1f] transition-colors">Studio</Link>
          {pathname !== '/admin' && (
            <>
              <span className="mx-1">/</span>
              <span className="text-[#1d1d1f] capitalize">
                {pathname.split('/').slice(2).map(p => p.replace(/-/g, ' ')).join(' / ')}
              </span>
            </>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
