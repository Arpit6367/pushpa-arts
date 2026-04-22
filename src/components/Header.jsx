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
    window.addEventListener('scroll', handleScroll, { passive: true });
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
      <header className={`fixed top-0 left-0 right-0 z-[2000] transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm py-3' : 'bg-transparent py-6 md:py-10'}`}>
        <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
          {/* Mobile View */}
          <div className="flex lg:hidden items-center justify-between">
            <Link href="/" className="transition-transform duration-500 hover:scale-105 active:scale-95">
              <img
                src="/images/Pushpa-Exports.svg"
                alt="Pushpa Arts"
                className={`h-10 w-auto transition-all duration-500 ${isDarkHeader ? 'brightness-0 invert' : ''}`}
              />
            </Link>
            <button
              className="relative z-[3001] flex flex-col justify-center items-end gap-2.5 w-10 h-10 bg-transparent border-none cursor-pointer group"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <span className={`h-[2px] transition-all duration-500 ${mobileOpen ? 'w-full rotate-45 translate-y-[12px] bg-black' : `w-full ${isDarkHeader ? 'bg-white' : 'bg-black'}`}`}></span>
              <span className={`h-[2px] transition-all duration-500 ${mobileOpen ? 'opacity-0' : `w-[75%] group-hover:w-full ${isDarkHeader ? 'bg-white' : 'bg-black'}`}`}></span>
              <span className={`h-[2px] transition-all duration-500 ${mobileOpen ? 'w-full -rotate-45 -translate-y-[12px] bg-black' : `w-full ${isDarkHeader ? 'bg-white' : 'bg-black'}`}`}></span>
            </button>
          </div>

          {/* Desktop View */}
          <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center">
            <nav className="flex items-center gap-12">
              <Link href="/" className={`group relative text-[0.65rem] font-bold uppercase tracking-[0.3em] transition-all ${pathname === '/' ? 'text-[var(--color-accent)]' : (isDarkHeader ? 'text-white' : 'text-black')}`}>
                Home
                <span className={`absolute bottom-[-8px] left-0 h-[1.5px] bg-[var(--color-accent)] transition-all duration-500 ${pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>

              <div className="relative group/dropdown">
                <Link href="/product-category" className={`group flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.3em] transition-all ${pathname?.startsWith('/product-category') ? 'text-[var(--color-accent)]' : (isDarkHeader ? 'text-white' : 'text-black')}`}>
                  Collections
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-500 group-hover/dropdown:rotate-180" />
                  <span className={`absolute bottom-[-8px] left-0 h-[1.5px] bg-[var(--color-accent)] transition-all duration-500 ${pathname?.startsWith('/product-category') ? 'w-full' : 'w-0 group-hover/dropdown:w-full'}`}></span>
                </Link>

                <div className="absolute top-full left-[-20px] pt-8 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-500 translate-y-4 group-hover/dropdown:translate-y-0 pointer-events-none group-hover/dropdown:pointer-events-auto">
                  <div className="bg-white shadow-[0_30px_100px_rgba(0,0,0,0.1)] p-10 grid grid-cols-2 gap-x-12 gap-y-5 min-w-[550px] border border-black/5 rounded-sm">
                    {parentCategories.map(cat => (
                      <Link key={cat.id} href={`/product-category/${cat.slug_path}`} className="group/item flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.2em] font-bold text-black/40 hover:text-[var(--color-accent)] transition-all py-1">
                        <span className="w-0 h-[1px] bg-[var(--color-accent)] transition-all duration-500 group-hover/item:w-4"></span>
                        {cat.name}
                      </Link>
                    ))}
                    <div className="col-span-2 mt-4 pt-6 border-t border-black/[0.03]">
                      <Link href="/product-category" className="flex items-center gap-4 text-[0.6rem] uppercase tracking-[0.3em] font-bold text-[var(--color-accent)] group/all">
                        <span>Explore All Series</span>
                        <span className="w-8 h-[1px] bg-[var(--color-accent)] transition-all duration-500 group-hover/all:w-16"></span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            <Link href="/" className="px-12 transition-all duration-700 hover:scale-105 active:scale-95">
              <img
                src="/images/Pushpa-Exports.svg"
                alt="Pushpa Arts"
                className={`transition-all duration-700 ${isDarkHeader ? 'brightness-0 invert' : ''} ${scrolled ? 'h-12' : 'h-16 md:h-20'}`}
              />
            </Link>

            <div className="flex items-center justify-end gap-12">
              <nav className="flex items-center gap-12">
                <Link href="/about" className={`group relative text-[0.65rem] font-bold uppercase tracking-[0.3em] transition-all ${pathname === '/about' ? 'text-[var(--color-accent)]' : (isDarkHeader ? 'text-white' : 'text-black')}`}>
                  Our Story
                  <span className={`absolute bottom-[-8px] left-0 h-[1.5px] bg-[var(--color-accent)] transition-all duration-500 ${pathname === '/about' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>
                <Link href="/contact" className={`group relative text-[0.65rem] font-bold uppercase tracking-[0.3em] transition-all ${pathname === '/contact' ? 'text-[var(--color-accent)]' : (isDarkHeader ? 'text-white' : 'text-black')}`}>
                  Contact
                  <span className={`absolute bottom-[-8px] left-0 h-[1.5px] bg-[var(--color-accent)] transition-all duration-500 ${pathname === '/contact' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                </Link>
              </nav>

              <a
                href={`https://wa.me/${(settings.whatsapp_number || '919414162629').replace(/[^0-9]/g, '')}`}
                className={`group relative flex items-center gap-3 text-[0.65rem] font-bold border px-8 py-4 uppercase tracking-[0.2em] transition-all overflow-hidden ${isDarkHeader ? 'text-white border-white/20' : 'text-[var(--color-accent)] border-[var(--color-accent)]/30'}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <MessageSquare className="w-4 h-4" /> Concierge
                </span>
                <div className={`absolute inset-0 transition-transform duration-500 translate-y-full group-hover:translate-y-0 ${isDarkHeader ? 'bg-white text-black' : 'bg-[var(--color-accent)]'}`}></div>
                {/* Special text color handling for the button background fill */}
                <style jsx>{`
                  a:hover span { color: ${isDarkHeader ? 'black' : 'white'}; }
                `}</style>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-[#FDFCFB] z-[3000] flex flex-col transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) lg:hidden ${mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <div className="flex-1 flex flex-col p-12 pt-32 overflow-y-auto no-scrollbar">
          <div className="flex flex-col gap-14">
            <Link
              href="/"
              className={`font-heading text-5xl transition-all duration-500 ${mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: '100ms' }}
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>

            <div className={`flex flex-col gap-6 transition-all duration-500 ${mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '200ms' }}>
              <p className="text-[0.6rem] uppercase tracking-[0.5em] font-bold text-[var(--color-accent)]">Collections</p>
              <div className="flex flex-col gap-6 pl-4 border-l border-black/5">
                {parentCategories.map((cat, i) => (
                  <Link
                    key={cat.id}
                    href={`/product-category/${cat.slug_path}`}
                    className="text-2xl font-heading text-black/60 hover:text-[var(--color-accent)] transition-colors"
                    onClick={() => setMobileOpen(false)}
                    style={{ transitionDelay: `${250 + (i * 50)}ms` }}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/about"
              className={`font-heading text-5xl transition-all duration-500 ${mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: '400ms' }}
              onClick={() => setMobileOpen(false)}
            >
              Our Story
            </Link>

            <Link
              href="/contact"
              className={`font-heading text-5xl transition-all duration-500 ${mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: '500ms' }}
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </Link>
          </div>

          <div className={`mt-24 pt-10 border-t border-black/5 transition-all duration-700 ${mobileOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
            <a
              href={`https://wa.me/${(settings.whatsapp_number || '919414162629').replace(/[^0-9]/g, '')}`}
              className="w-full flex items-center justify-center gap-4 py-6 bg-black text-white text-[0.7rem] uppercase tracking-[0.4em] font-bold shadow-2xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageSquare className="w-5 h-5" /> Concierge Service
            </a>
            <div className="text-center mt-8 text-[0.55rem] uppercase tracking-[0.3em] font-bold text-black/20 italic">
              Crafting Udaipur Excellence Since Generations
            </div>
          </div>
        </div>

        <button
          className="absolute top-10 right-10 w-16 h-16 rounded-full bg-black/5 flex items-center justify-center transition-all hover:bg-black hover:text-white"
          onClick={() => setMobileOpen(false)}
          aria-label="Close Menu"
        >
          <X className="w-8 h-8" />
        </button>
      </div>
    </>
  );
}
