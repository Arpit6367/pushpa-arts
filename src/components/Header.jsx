'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const getSubcategories = (parentId) => {
    return categories.filter(c => c.parent_id === parentId);
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-top">
          <div className="header-top-left">
            <span>Udaipur, Rajasthan, India</span>
          </div>
          <div className="header-top-right">
            <a href="mailto:info@pushpaarts.com">info@pushpaarts.com</a>
            <span style={{ margin: '0 15px', opacity: 0.3 }}>|</span>
            <Link href="/contact">Inquiry</Link>
          </div>
        </div>
        <div className="header-main">
          <Link href="/" className="logo">
            <img src="/images/Pushpa-Exports.svg" alt="Pushpa Arts" style={{ height: '60px', width: 'auto' }} />
          </Link>

          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className={`nav ${mobileOpen ? 'open' : ''}`}>
            <Link href="/" className="nav-link active" onClick={() => setMobileOpen(false)}>Home</Link>

            <div className="nav-item">
              <Link href="/categories" className="nav-link" onClick={() => setMobileOpen(false)}>Furniture Types</Link>
              {parentCategories.length > 0 && (
                <div className="nav-dropdown">
                  {parentCategories.map(cat => (
                    <Link key={cat.id} href={`/categories/${cat.slug}`} onClick={() => setMobileOpen(false)}>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/about" className="nav-link" onClick={() => setMobileOpen(false)}>Our Story</Link>
            <Link href="/contact" className="nav-link" onClick={() => setMobileOpen(false)}>Contact Us</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
