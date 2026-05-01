'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, MessageSquare, X, Menu, Search, ShoppingBag, ShoppingCart } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { useCart } from '@/context/CartContext';

export default function Header({ initialCategories = [], settings = {} }) {
  const [categories, setCategories] = useState(initialCategories);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const settingsFromContext = useSettings();
  const isEcommerce = settingsFromContext.is_ecommerce;
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileOpen]);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (initialCategories && initialCategories.length > 0) {
      setCategories(initialCategories);
    }
  }, [initialCategories]);

  useEffect(() => {
    // Only fetch if we have no categories and none were provided from server
    if (categories.length === 0 && (!initialCategories || initialCategories.length === 0)) {
      fetch('/api/categories?active_only=true')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setCategories(data);
          }
        })
        .catch(() => { });
    }
  }, []); // Run once on mount to avoid loops

  const parentCategories = categories.filter(c => !c.parent_id);
  const getChildren = (parentId) => categories.filter(c => c.parent_id === parentId);

  return (
    <>
      {/* Promo Bar (Dynamic height and transparency) */}
      {/* <div className={`fixed top-0 left-0 right-0 z-[2001] text-white text-[0.5rem] md:text-[0.55rem] uppercase tracking-[0.3em] font-bold py-2.5 text-center transition-all duration-500 ${scrolled ? '-translate-y-full' : 'translate-y-0'} ${!scrolled && pathname === '/' ? 'bg-transparent' : 'bg-[#1A2F27]'}`}>
        Curating Generations of Udaipur Craftsmanship
      </div> */}

      <header className={`fixed top-0 left-0 right-0 z-[2000] transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm py-2' : 'bg-transparent py-4'}`}>
        <div className="max-w-[1700px] mx-auto px-[var(--spacing-container)]">

          <div className="flex items-center justify-between lg:justify-start gap-12 lg:gap-16 min-h-[50px] lg:min-h-[80px]">
            {/* Logo */}
            <Link
              href="/"
              className="transition-all duration-700 hover:scale-105 active:scale-95 z-[2005] flex-shrink-0"
            >
              <img
                src="/images/Pushpa-Exports.svg"
                alt="Pushpa Exports"
                className={`transition-all duration-700 object-contain h-10 md:h-14 w-auto ${!scrolled && pathname === '/' ? 'brightness-0 invert' : ''}`}
              />
            </Link>

            {/* Desktop Navigation (Unified in Single Row) */}
            <nav className="hidden lg:flex items-center gap-x-6 xl:gap-x-10 h-full">
              {parentCategories.map((parent, index) => {
                const children = getChildren(parent.id);
                const isActive = pathname?.includes(parent.slug);

                return (
                  <div key={parent.id} className="group/dropdown py-4 relative h-full flex items-center">
                    <Link
                      href={`/product-category/${parent.slug_path}`}
                      className={`group flex items-center gap-2 text-[1rem] xl:text-[1rem] font-medium leading-tight transition-all whitespace-nowrap ${isActive ? 'text-[#B4975A]' : (!scrolled && pathname === '/' ? 'text-white hover:text-[#B4975A]' : 'text-black hover:text-[#B4975A]')}`}
                    >
                      <div className="flex flex-col items-start text-left">
                        <span className="block leading-none mb-0.5">{parent.name.replace(' Furniture', '')}</span>
                        <span className={`block leading-none text-[0.8rem] transition-opacity duration-700 ${!scrolled && pathname === '/' ? 'opacity-40' : 'opacity-60'}`}>{parent.name.includes('Furniture') ? 'Furniture' : parent.name.includes('Work') ? 'Work' : ''}</span>
                      </div>
                      {children.length > 0 && <ChevronDown className={`w-4 h-4 transition-all duration-500 group-hover/dropdown:rotate-180 ${!scrolled && pathname === '/' ? 'opacity-50' : 'opacity-40'}`} />}
                    </Link>

                    {children.length > 0 && (
                      <div className={`absolute ${index > parentCategories.length - 5 ? 'right-0' : 'left-0'} top-full pt-2 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-700 translate-y-2 group-hover/dropdown:translate-y-0 pointer-events-none group-hover/dropdown:pointer-events-auto z-[2002]`}>
                        <div className="bg-white shadow-[0_40px_120px_rgba(0,0,0,0.15)] overflow-hidden border border-black/[0.03] rounded-sm flex w-[850px]">

                          {/* Left: Category Tree */}
                          <div className="flex-1 p-10 lg:p-12 bg-[#FDFDFD]">
                            <div className="mb-8 flex items-center justify-between">
                              <div>
                                <h4 className="text-[var(--color-accent)] uppercase tracking-[0.4em] font-bold text-[0.55rem] mb-2">Collections</h4>
                                <h3 className="text-xl font-heading text-[var(--color-text-primary)]">{parent.name}</h3>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-x-10 gap-y-5">
                              {children.slice(0, 15).map(child => (
                                <Link
                                  key={child.id}
                                  href={`/product-category/${child.slug_path}`}
                                  className="group/item flex flex-col gap-1 transition-all"
                                >
                                  <span className="text-[0.6rem] xl:text-[0.65rem] uppercase tracking-[0.15em] font-bold text-black/60 group-hover/item:text-[var(--color-accent)] transition-colors">
                                    {child.name}
                                  </span>
                                  <div className="w-0 h-[1px] bg-[var(--color-accent)]/30 transition-all duration-500 group-hover/item:w-8"></div>
                                </Link>
                              ))}

                              {children.length > 15 && (
                                <Link
                                  href={`/product-category/${parent.slug_path}`}
                                  className="group/item flex flex-col gap-1 transition-all pt-2"
                                >
                                  <span className="text-[0.6rem] xl:text-[0.65rem] uppercase tracking-[0.25em] font-bold text-[var(--color-accent)] hover:underline flex items-center gap-1">
                                    View All {children.length} Series
                                  </span>
                                </Link>
                              )}
                            </div>
                          </div>

                          {/* Right: Featured Visual */}
                          <div className="flex w-[320px] relative overflow-hidden group/img bg-[#F9F7F5] border-l border-black/[0.03]">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                            {parent.image ? (
                              <Image
                                src={parent.image}
                                alt={parent.name}
                                fill
                                className="object-cover transition-transform duration-[3s] group-hover/img:scale-110"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-black/5 font-heading text-8xl uppercase tracking-tighter select-none rotate-12">
                                {parent.name.split(' ')[0]}
                              </div>
                            )}
                            <div className="absolute bottom-8 left-8 right-8 z-20">
                              <span className="text-[var(--color-accent)] uppercase tracking-[0.4em] font-bold text-[0.45rem] mb-2 block">Handcrafted Art</span>
                              <h4 className="text-lg font-heading text-white mb-4 leading-tight">Authentic {parent.name}</h4>
                              <Link
                                href={`/product-category/${parent.slug_path}`}
                                className="inline-block px-6 py-2.5 bg-white text-black text-[0.55rem] uppercase tracking-[0.3em] font-bold hover:bg-[var(--color-accent)] hover:text-white transition-all duration-500"
                              >
                                Explore
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-4 ml-auto">
              {isEcommerce && (
                <button
                  onClick={() => setIsCartOpen(true)}
                  className={`p-2 transition-all active:scale-90 relative ${!scrolled && pathname === '/' ? 'text-white hover:text-[#B4975A]' : 'text-black hover:text-[#B4975A]'}`}
                  aria-label="View Cart"
                  suppressHydrationWarning
                >
                  <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                  {mounted && cartCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--color-accent)] text-white text-[0.6rem] flex items-center justify-center rounded-full font-bold animate-in zoom-in duration-300">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}

              <button
                className={`lg:hidden p-2 transition-all active:scale-90 ${!scrolled && pathname === '/' ? 'text-white hover:text-[#B4975A]' : 'text-black hover:text-[#B4975A]'}`}
                onClick={() => setMobileOpen(true)}
                aria-label="Open Menu"
                suppressHydrationWarning
              >
                <Menu className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-white z-[5000] flex flex-col transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) lg:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-black/[0.05]">
          <img src="/images/Pushpa-Exports.svg" alt="Pushpa Exports" className="h-10 md:h-12 w-auto" />
          <button
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/5 rounded-full hover:bg-black hover:text-white transition-colors"
            onClick={() => setMobileOpen(false)}
            aria-label="Close Menu"
            suppressHydrationWarning
          >
            <X className="w-5 h-5 md:w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 md:p-12 pt-12 no-scrollbar">
          <div className="flex flex-col gap-6">
            {parentCategories.map((parent) => {
              const children = getChildren(parent.id);
              const isExpanded = expandedId === parent.id;

              return (
                <div key={parent.id} className="flex flex-col border-b border-black/[0.03] last:border-0 pb-6 mb-6 last:pb-0 last:mb-0">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/product-category/${parent.slug_path}`}
                      className="font-heading text-2xl text-black hover:text-[var(--color-accent)] transition-colors flex-1"
                      onClick={() => setMobileOpen(false)}
                    >
                      {parent.name}
                    </Link>
                    {children.length > 0 && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : parent.id)}
                        className={`w-12 h-12 flex items-center justify-center bg-black/[0.03] rounded-full transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`}
                        suppressHydrationWarning
                      >
                        <ChevronDown className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {children.length > 0 && (
                    <div className={`overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? 'max-h-[1500px] mt-8 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="flex flex-col gap-5 pl-6 border-l-2 border-[var(--color-accent)]/20">
                        {children.slice(0, 15).map(child => (
                          <Link
                            key={child.id}
                            href={`/product-category/${child.slug_path}`}
                            className="text-lg font-heading text-black/40 hover:text-[var(--color-accent)] transition-colors"
                            onClick={() => setMobileOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                        {children.length > 15 && (
                          <Link
                            href={`/product-category/${parent.slug_path}`}
                            className="text-[0.65rem] uppercase tracking-[0.25em] font-bold text-[var(--color-accent)] pt-4"
                            onClick={() => setMobileOpen(false)}
                          >
                            View All {children.length} Series
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-24 pt-10 border-t border-black/[0.05]">
            <p className="text-[0.6rem] uppercase tracking-[0.4em] font-bold text-black/30 mb-8 md:mb-10">Personal Concierge</p>
            <a
              href={`https://wa.me/${(settings.whatsapp_number || '919414162629').replace(/[^0-9]/g, '')}`}
              className="flex items-center justify-center gap-4 py-6 md:py-8 bg-black text-white text-[0.7rem] md:text-[0.8rem] uppercase tracking-[0.4em] font-bold hover:bg-[var(--color-accent)] transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              suppressHydrationWarning
            >
              <MessageSquare className="w-5 h-5 md:w-6 h-6" /> {isEcommerce ? 'Shop Support' : 'WhatsApp Support'}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
