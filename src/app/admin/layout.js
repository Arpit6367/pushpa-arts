'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import './admin.css';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Skip auth check on login page
    if (pathname === '/admin/login') {
      setChecking(false);
      setIsAuthenticated(true);
      return;
    }

    // Check if we have the admin cookie by trying an authenticated endpoint
    fetch('/api/files')
      .then(res => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else if (res.status === 401) {
          router.push('/admin/login');
        } else {
          // If it's a 500 or other error but NOT 401, we might still be authenticated
          // but the endpoint is broken. However, for safety, let's treat as unauthenticated
          // or just proceed if it's not a clear auth failure.
          // Actually, if we are on login page we're fine.
          setIsAuthenticated(true); // Fallback to allowing access if it's just a server error
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

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Login page renders without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f5f5f7' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/categories', label: 'Categories', icon: '📁' },
    { href: '/admin/products', label: 'Products', icon: '📦' },
    { href: '/admin/products/new', label: 'Add Product', icon: '➕' },
    { href: '/admin/file-manager', label: 'File Manager', icon: '🖼️' },
  ];

  return (
    <div className={`admin-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Mobile Header */}
      <div className="admin-mobile-header">
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
        <div className="brand-logo">
          <img src="/images/Pushpa-Exports.svg" alt="Logo" style={{ height: '30px' }} />
        </div>
        <div style={{ width: '40px' }}></div> {/* Spacer */}
      </div>

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-brand">
          <img src="/images/Pushpa-Exports.svg" alt="Pushpa Arts" style={{ height: '90px', width: 'auto' }} />
          <p>Administration</p>
        </div>
        <nav className="admin-nav">
          {navItems.map(item => {
            const isActive = item.href === '/admin' 
              ? pathname === '/admin' 
              : pathname.startsWith(item.href) && (pathname.length === item.href.length || pathname[item.href.length] === '/');
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={isActive ? 'active' : ''}
              >
                <span className="admin-nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="admin-sidebar-footer">
          <Link href="/" style={{ display: 'block', textAlign: 'center', color: '#999', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: '500' }}>
            ← View Website
          </Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <div className={`admin-sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)} />

      <div className="admin-main">
        {children}
      </div>
    </div>
  );
}
