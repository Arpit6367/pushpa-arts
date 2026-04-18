'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Header({ initialCategories = [], settings = {} }) {
  const [categories, setCategories] = useState(initialCategories);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isDarkHeader = isHome && !scrolled;

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
    <header className={`fixed top-0 left-0 right-0 z-[2000] transition-all duration-500 ${scrolled ? 'bg-[#FCFAF8]/95 backdrop-blur-xl shadow-lg' : 'bg-transparent'}`}>
      <div className={`bg-[#1F1F1F] text-[#FCFAF8] text-center overflow-hidden transition-all duration-500 ${scrolled ? 'h-0 opacity-0' : 'py-3 h-auto opacity-100'}`}>
        <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
          <p className="text-[0.65rem] tracking-[0.2em] uppercase font-medium">{settings.site_tagline || 'Exquisite Handcrafted Furniture — Shipping Worldwide from Udaipur'}</p>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
        <div className={`grid grid-cols-[1fr_auto_1fr] items-center transition-all duration-500 lg:grid-cols-[1fr_auto_1fr] ${scrolled ? 'py-3' : 'py-6 md:py-8'}`}>
          <nav className="hidden lg:flex gap-12 justify-start">
            <Link href="/" className={`text-[0.65rem] font-bold uppercase tracking-[0.25em] relative py-2 transition-all duration-300 hover:opacity-100 hover:text-[#B8860B] ${pathname === '/' ? 'opacity-100 text-[#B8860B] border-b-[1.5px] border-[#B8860B]' : `opacity-70 ${isDarkHeader ? 'text-white' : 'text-[#1F1F1F]'}`}`}>Home</Link>
            <Link href="/product-category" className={`text-[0.65rem] font-bold uppercase tracking-[0.25em] relative py-2 transition-all duration-300 hover:opacity-100 hover:text-[#B8860B] ${pathname?.startsWith('/product-category') ? 'opacity-100 text-[#B8860B] border-b-[1.5px] border-[#B8860B]' : `opacity-70 ${isDarkHeader ? 'text-white' : 'text-[#1F1F1F]'}`}`}>Collections</Link>
          </nav>

          <Link href="/" className="text-center px-0 lg:px-16 col-start-2">
            <img src="/images/Pushpa-Exports.svg" alt="Pushpa Arts" className={`w-auto transition-all duration-500 mx-auto ${isDarkHeader ? 'brightness-0 invert' : 'brightness-90'} ${scrolled ? 'h-10 md:h-12' : 'h-[clamp(45px,6vw,70px)]'}`} />
          </Link>

          <nav className="hidden lg:flex gap-12 justify-end items-center col-start-3">
            <Link href="/about" className={`text-[0.65rem] font-bold uppercase tracking-[0.25em] relative py-2 transition-all duration-300 hover:opacity-100 hover:text-[#B8860B] ${pathname === '/about' ? 'opacity-100 text-[#B8860B] border-b-[1.5px] border-[#B8860B]' : `opacity-70 ${isDarkHeader ? 'text-white' : 'text-[#1F1F1F]'}`}`}>Our Story</Link>
            <Link href="/contact" className={`text-[0.65rem] font-bold uppercase tracking-[0.25em] relative py-2 transition-all duration-300 hover:opacity-100 hover:text-[#B8860B] ${pathname === '/contact' ? 'opacity-100 text-[#B8860B] border-b-[1.5px] border-[#B8860B]' : `opacity-70 ${isDarkHeader ? 'text-white' : 'text-[#1F1F1F]'}`}`}>Contact</Link>
            <a href={`https://wa.me/${(settings.whatsapp_number || '919414162629').replace(/[^0-9]/g, '')}`} className={`text-[0.65rem] font-bold border px-5 py-2 tracking-[0.15em] uppercase transition-all duration-300 hover:bg-[#B8860B] hover:text-white hover:shadow-[0_5px_15px_rgba(184,134,11,0.1)] ${isDarkHeader ? 'text-white border-white/30' : 'text-[#B8860B] border-[#B8860B]'}`} target="_blank" rel="noopener noreferrer">
              Chat
            </a>
          </nav>

          <button className="flex lg:hidden flex-col justify-center items-end gap-1.5 w-[30px] h-[30px] border-none bg-transparent cursor-pointer z-[4000] col-start-3 ml-auto" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            <span className={`h-[1.5px] transition-all duration-300 ${mobileOpen ? 'w-full rotate-45 translate-y-[7.5px] bg-[#1F1F1F]' : `w-full ${isDarkHeader ? 'bg-white' : 'bg-[#1F1F1F]'}`}`}></span>
            <span className={`h-[1.5px] transition-all duration-300 ${mobileOpen ? 'opacity-0' : `w-[70%] ${isDarkHeader ? 'bg-white' : 'bg-[#1F1F1F]'}`}`}></span>
            <span className={`h-[1.5px] transition-all duration-300 ${mobileOpen ? 'w-full -rotate-45 -translate-y-[7.5px] bg-[#1F1F1F]' : `w-full ${isDarkHeader ? 'bg-white' : 'bg-[#1F1F1F]'}`}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-[#FCFAF8] z-[3000] flex flex-col transition-all duration-700 ease-in-out ${mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-10 overflow-y-auto">
          <div className="flex flex-col gap-6 md:gap-8 my-auto">
            <Link href="/" className="font-heading text-4xl md:text-6xl text-[#1F1F1F] transition-colors hover:text-[#B8860B]" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link href="/product-category" className="font-heading text-4xl md:text-6xl text-[#1F1F1F] transition-colors hover:text-[#B8860B]" onClick={() => setMobileOpen(false)}>Collections</Link>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 py-6 border-y border-[#E5E0DA]">
              {parentCategories.slice(0, 6).map(cat => (
                <Link key={cat.id} href={`/product-category/${cat.slug_path}`} className="text-[0.65rem] text-[#8C8C8C] uppercase tracking-[0.2em] font-bold hover:text-[#B8860B]" onClick={() => setMobileOpen(false)}>
                  {cat.name}
                </Link>
              ))}
            </div>

            <Link href="/about" className="font-heading text-4xl md:text-6xl text-[#1F1F1F] transition-colors hover:text-[#B8860B]" onClick={() => setMobileOpen(false)}>Our Story</Link>
            <Link href="/contact" className="font-heading text-4xl md:text-6xl text-[#1F1F1F] transition-colors hover:text-[#B8860B]" onClick={() => setMobileOpen(false)}>Contact</Link>
          </div>

          <div className="mt-auto pt-10 w-full">
            <p className="text-[0.6rem] uppercase tracking-[0.2em] text-[#B8860B] mb-4">Handcrafted Excellence</p>
            <div className="flex justify-center gap-6 opacity-60">
              {/* Social icons could go here */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
