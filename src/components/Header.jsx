'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/categories?active_only=true')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch(() => { });
  }, []);

  const parentCategories = categories.filter(c => !c.parent_id);

  return (
    <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="header-announcement">
        <div className="container">
          <p>Exquisite Handcrafted Furniture — Shipping Worldwide from Udaipur</p>
        </div>
      </div>

      <div className="container">
        <div className="header-main-desktop">
          <nav className="header-nav-left">
            <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>Heritage</Link>
            <Link href="/product-category" className={`nav-link ${pathname?.startsWith('/product-category') ? 'active' : ''}`}>Collections</Link>
          </nav>

          <Link href="/" className="logo-centered">
            <img src="/images/Pushpa-Exports.svg" alt="Pushpa Arts" />
          </Link>

          <nav className="header-nav-right">
            <Link href="/about" className={`nav-link ${pathname === '/about' ? 'active' : ''}`}>Our Story</Link>
            <Link href="/contact" className={`nav-link ${pathname === '/contact' ? 'active' : ''}`}>Bespoke</Link>
            <a href="https://wa.me/919414162629" className="whatsapp-link" target="_blank" rel="noopener noreferrer">
              Chat with Artisan
            </a>
          </nav>

          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <button className="mobile-close" onClick={() => setMobileOpen(false)}>&times;</button>
        <div className="mobile-menu-content">
          <Link href="/" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link href="/product-category" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Collections</Link>
          <div className="mobile-sub-nav">
            {parentCategories.map(cat => (
              <Link key={cat.id} href={`/product-category/${cat.slug_path}`} onClick={() => setMobileOpen(false)}>
                {cat.name}
              </Link>
            ))}

          </div>
          <Link href="/about" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Our Story</Link>
          <Link href="/contact" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Contact Us</Link>
        </div>
      </div>
    </header>
  );
}
