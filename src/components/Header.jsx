'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, MessageSquare, X } from 'lucide-react';

export default function Header({ initialCategories = [], settings = {} }) {
  const [categories, setCategories] = useState(initialCategories);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const hasDarkHero = isHome || pathname === '/about' || pathname === '/contact';
  const isDarkHeader = hasDarkHero && !scrolled;

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (initialCategories.length === 0) {
      fetch('/api/categories?active_only=true')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setCategories(data);
          }
        })
        .catch(() => { });
    } else {
      setCategories(initialCategories);
    }
  }, [initialCategories]);

  const parentCategories = categories.filter(c => !c.parent_id);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[2000] transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
          {/* Mobile View: Logo Left, Large Menu Right */}
          <div className="flex lg:hidden items-center justify-between py-6">
            <Link href="/">
              <img
                src="/images/Pushpa-Exports.svg"
                alt="Pushpa Arts"
                className={`h-10 w-auto transition-all duration-500 ${isDarkHeader ? 'brightness-0 invert' : ''}`}
              />
            </Link>
            <button
              className="relative z-[2001] flex flex-col justify-center items-end gap-2.5 w-10 h-10 bg-transparent border-none cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <span className={`h-[2px] transition-all duration-300 ${mobileOpen ? 'w-full rotate-45 translate-y-[12px] bg-black' : `w-full ${isDarkHeader ? 'bg-white' : 'bg-black'}`}`}></span>
              <span className={`h-[2px] transition-all duration-300 ${mobileOpen ? 'opacity-0' : `w-[75%] ${isDarkHeader ? 'bg-white' : 'bg-black'}`}`}></span>
              <span className={`h-[2px] transition-all duration-300 ${mobileOpen ? 'w-full -rotate-45 -translate-y-[12px] bg-black' : `w-full ${isDarkHeader ? 'bg-white' : 'bg-black'}`}`}></span>
            </button>
          </div>

          {/* Desktop View: Grid 3 Cols, Logo Center (Unchanged) */}
          <div className={`hidden lg:grid grid-cols-3 items-center transition-all duration-500 ${scrolled ? 'py-4' : 'py-6 md:py-8'}`}>
            <nav className="flex items-center gap-10">
              <Link href="/" className={`text-[0.7rem] font-semibold uppercase tracking-[0.2em] transition-all hover:text-[var(--color-accent)] ${pathname === '/' ? 'text-[var(--color-accent)]' : (isDarkHeader ? 'text-white' : 'text-[var(--color-text-primary)]')}`}>Home</Link>
              <div className="relative group">
                <Link href="/product-category" className={`flex items-center gap-1 text-[0.7rem] font-semibold uppercase tracking-[0.2em] transition-all hover:text-[var(--color-accent)] ${pathname?.startsWith('/product-category') ? 'text-[var(--color-accent)]' : (isDarkHeader ? 'text-white' : 'text-[var(--color-text-primary)]')}`}>
                  Collections <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                </Link>
                <div className="absolute top-full left-0 pt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <div className="bg-white shadow-2xl p-8 grid grid-cols-2 gap-x-12 gap-y-4 min-w-[500px] border border-black/5">
                    {parentCategories.map(cat => (
                      <Link key={cat.id} href={`/product-category/${cat.slug_path}`} className="text-[0.65rem] uppercase tracking-[0.15em] text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] transition-colors py-1">
                        {cat.name}
                      </Link>
                    ))}
                    <Link href="/product-category" className="col-span-2 text-[0.6rem] uppercase tracking-[0.2em] font-bold text-[var(--color-accent)] pt-4 border-t border-black/5">View All Series →</Link>
                  </div>
                </div>
              </div>
            </nav>

            <Link href="/" className="flex justify-center">
              <img
                src="/images/Pushpa-Exports.svg"
                alt="Pushpa Arts"
                className={`w-auto transition-all duration-500 ${isDarkHeader ? 'brightness-0 invert' : 'brightness-0'} ${scrolled ? 'h-8 md:h-10' : 'h-10 md:h-16'}`}
              />
            </Link>

            <div className="flex items-center justify-end gap-10">
              <nav className="flex items-center gap-10">
                <Link href="/about" className={`text-[0.7rem] font-semibold uppercase tracking-[0.2em] transition-all hover:text-[var(--color-accent)] ${pathname === '/about' ? 'text-[var(--color-accent)]' : (isDarkHeader ? 'text-white' : 'text-[var(--color-text-primary)]')}`}>Our Story</Link>
                <Link href="/contact" className={`text-[0.7rem] font-semibold uppercase tracking-[0.2em] transition-all hover:text-[var(--color-accent)] ${pathname === '/contact' ? 'text-[var(--color-accent)]' : (isDarkHeader ? 'text-white' : 'text-[var(--color-text-primary)]')}`}>Contact</Link>
              </nav>
              <a
                href={`https://wa.me/${(settings.whatsapp_number || '919414162629').replace(/[^0-9]/g, '')}`}
                className={`hidden md:flex items-center gap-2 text-[0.7rem] font-bold border px-6 py-3 uppercase tracking-[0.1em] transition-all ${isDarkHeader ? 'text-white border-white/30 hover:bg-white hover:text-[var(--color-text-primary)]' : 'text-[var(--color-accent)] border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white'}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageSquare className="w-4 h-4" /> Concierge
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay — OUTSIDE header to avoid backdrop-blur containing block */}
      <div className={`fixed inset-0 bg-white z-[3000] flex flex-col transition-all duration-700 ease-in-out lg:hidden ${mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <div className="flex-1 flex flex-col p-10 pt-24 overflow-y-auto">
          <div className="flex flex-col gap-10">
            <Link href="/" className="font-heading text-4xl text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors" onClick={() => setMobileOpen(false)}>Home</Link>

            <div className="flex flex-col gap-4">
              <h4 className="text-[0.6rem] uppercase tracking-[0.3em] font-bold text-[var(--color-accent)] mb-2">Collections</h4>
              <div className="grid grid-cols-1 gap-4 pl-4 border-l border-[var(--color-bg-mint)]">
                {parentCategories.map(cat => (
                  <Link key={cat.id} href={`/product-category/${cat.slug_path}`} className="text-xl font-heading text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors" onClick={() => setMobileOpen(false)}>
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/about" className="font-heading text-4xl text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors" onClick={() => setMobileOpen(false)}>Our Story</Link>
            <Link href="/contact" className="font-heading text-4xl text-[var(--color-text-primary)] hover:text-[var(--color-accent)] transition-colors" onClick={() => setMobileOpen(false)}>Contact</Link>
          </div>

          <div className="mt-auto pt-10">
            <a
              href={`https://wa.me/${(settings.whatsapp_number || '919414162629').replace(/[^0-9]/g, '')}`}
              className="w-full flex items-center justify-center gap-2 py-4 bg-[var(--color-secondary)] text-white text-[0.7rem] uppercase tracking-[0.2em] font-bold shadow-xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageSquare className="w-4 h-4" /> Message on WhatsApp
            </a>
          </div>
        </div>
        <button className="absolute top-8 right-8 text-[var(--color-text-primary)] p-4" onClick={() => setMobileOpen(false)}>
          <X className="w-8 h-8" />
        </button>
      </div>
    </>
  );
}
