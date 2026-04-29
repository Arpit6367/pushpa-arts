'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';

export default function ProductDetailClient({ product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y });
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isLightboxOpen]);

  useEffect(() => {
    if (!product) return;

    const stored = localStorage.getItem('recentlyViewed');
    let viewed = stored ? JSON.parse(stored) : [];
    
    if (viewed[0]?.id !== product.id) {
      viewed = viewed.filter(p => p.id !== product.id);
      
      const productSummary = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        category_slug_path: product.category_slug_path,
        first_image: product.images?.[0]?.file_path
      };
      
      viewed.unshift(productSummary);
      viewed = viewed.slice(0, 10);
      localStorage.setItem('recentlyViewed', JSON.stringify(viewed));
    }
    
    setRecentlyViewed(viewed.filter(p => p.id !== product.id));
  }, [product]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 bg-[#FDFDFD]">
        <h3 className="text-4xl font-heading mb-6 text-[var(--color-text-primary)]">Masterpiece not found</h3>
        <p className="text-[var(--color-text-secondary)] mb-10 max-w-md mx-auto">The artistic creation you are seeking is currently unavailable in our digital gallery.</p>
        <Link href="/product-category" className="bg-black text-white px-10 py-4 text-[0.65rem] uppercase tracking-[0.3em] font-bold hover:bg-[var(--color-accent)] transition-all">
          Browse Collections
        </Link>
      </div>
    );
  }

  const images = product.images || [];
  const currentImage = images[activeImage]?.file_path;

  const renderBreadcrumbs = () => {
    const breadcrumbs = [];

    if (product.category_slug_path) {
      const parts = product.category_slug_path.split('/');
      let currentPath = '/product-category';

      parts.forEach((part, index) => {
        currentPath += `/${part}`;
        const name = (index === parts.length - 1) ? product.category_name : part.replace(/-/g, ' ');

        breadcrumbs.push(
          <span key={part} className="flex items-center gap-3">
            <span className="w-6 h-[1px] bg-black/10"></span>
            <Link href={currentPath} className="hover:text-[var(--color-accent)] transition-colors">{name}</Link>
          </span>
        );
      });
    }

    return (
      <div className="flex flex-wrap items-center gap-4 text-[0.65rem] tracking-[0.3em] uppercase text-black/40 mb-12 reveal stagger-1">
        <Link href="/" className="hover:text-[var(--color-accent)] transition-colors">Home</Link>
        <Link href="/product-category" className="flex items-center gap-3 hover:text-[var(--color-accent)] transition-colors">
          <span className="w-6 h-[1px] bg-black/10"></span>
          Collections
        </Link>
        {breadcrumbs}
      </div>
    );
  };

  return (
    <div className="bg-white">
      {/* Immersive Lightbox */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-[#0A0A0A]/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 md:p-10 animate-in fade-in duration-500 cursor-pointer"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(false);
            }}
            className="absolute top-8 right-8 text-white/50 hover:text-[var(--color-accent)] transition-all z-[110] flex flex-col items-center gap-3 group"
          >
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[var(--color-accent)] transition-all">
              <span className="text-2xl font-light">×</span>
            </div>
            <span className="text-[0.55rem] uppercase tracking-[0.4em] font-bold">Dismiss</span>
          </button>
          
          <div 
            className="relative w-full h-full max-w-6xl max-h-[75vh] flex items-center justify-center cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
             <Image 
                src={currentImage} 
                alt={product.name} 
                fill
                className="object-contain p-4 md:p-10" 
                sizes="100vw"
                priority
              />
          </div>

          <div 
            className="mt-12 flex gap-6 overflow-x-auto pb-6 max-w-full px-6 scrollbar-hide cursor-default no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((img, index) => (
              <button
                key={img.id}
                suppressHydrationWarning
                className={`relative w-20 h-20 flex-shrink-0 bg-white/5 rounded-sm overflow-hidden border transition-all duration-500 ${index === activeImage ? 'border-[var(--color-accent)]' : 'border-transparent opacity-40 hover:opacity-100'}`}
                onClick={() => setActiveImage(index)}
              >
                <Image 
                  src={img.file_path} 
                  alt={img.alt_text || product.name} 
                  fill
                  className="object-cover" 
                  sizes="100px"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <section className="pt-32 pb-16 md:pt-48 md:pb-32">
        <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-24 items-start">
            
            {/* Gallery Section with Premium Zoom */}
            <div className="flex flex-col gap-10 reveal lg:sticky lg:top-40 z-10">
              <div 
                className="relative aspect-[0.9] lg:aspect-[0.8] bg-[#FDFDFD] overflow-hidden border border-black/[0.03] shadow-2xl shadow-black/[0.02] cursor-zoom-in group"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onClick={() => setIsLightboxOpen(true)}
              >
                {currentImage ? (
                  <div 
                    className="w-full h-full relative transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1)"
                    style={isZooming ? { 
                      transform: 'scale(1.8)',
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                    } : {}}
                  >
                    <Image 
                      src={currentImage} 
                      alt={product.name} 
                      fill
                      className="object-contain p-10 md:p-16" 
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-black/20 bg-[#F9F7F5]">
                    <span className="text-[0.6rem] tracking-[0.5em] uppercase font-bold">Studio Imagery Curating</span>
                  </div>
                )}
                
                <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md text-black text-[0.55rem] font-bold uppercase tracking-[0.3em] px-6 py-3 border border-black/5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  Expand View
                </div>

                {product.is_featured && (
                  <div className="absolute top-10 left-10 bg-[var(--color-accent)] text-white text-[0.55rem] font-bold uppercase tracking-[0.4em] px-6 py-3 shadow-2xl">
                    Masterpiece
                  </div>
                )}
                
                {/* Decorative corner accent */}
                <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-black/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
              </div>

              {/* Enhanced Thumbnails */}
              {images.length > 1 && (
                <div className="relative">
                  <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x no-scrollbar">
                    {images.map((img, index) => (
                      <button
                        key={img.id}
                        suppressHydrationWarning
                        className={`relative aspect-square w-24 md:w-32 flex-shrink-0 bg-white cursor-pointer overflow-hidden border transition-all duration-700 snap-start ${index === activeImage ? 'border-[var(--color-accent)] shadow-2xl shadow-[var(--color-accent)]/10 scale-95' : 'border-black/5 opacity-40 hover:opacity-100'}`}
                        onClick={() => setActiveImage(index)}
                      >
                        <Image 
                          src={img.file_path} 
                          alt={img.alt_text || product.name} 
                          fill
                          className="object-contain p-3" 
                          sizes="150px"
                        />
                      </button>
                    ))}
                  </div>
                  {/* Progress indicator */}
                  <div className="h-[1px] bg-black/5 w-full mt-2 relative">
                    <div 
                      className="absolute h-[2px] bg-[var(--color-accent)] top-[-0.5px] transition-all duration-700"
                      style={{ 
                        width: `${100 / images.length}%`,
                        left: `${(activeImage / images.length) * 100}%`
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Content Section with Rich Typography */}
            <div className="flex flex-col pt-4">
              {renderBreadcrumbs()}

              <h1 className="reveal stagger-2 text-[clamp(2.2rem,6vw,3.5rem)] font-heading leading-[1.1] mb-6 text-[var(--color-text-primary)] italic">
                {product.name}
              </h1>

              <div className="reveal stagger-3 flex flex-wrap items-center gap-x-10 gap-y-4 mb-16">
                {product.sku && (
                  <div className="text-[0.6rem] text-black/30 font-bold tracking-[0.4em] uppercase flex items-center gap-4">
                    <span className="w-10 h-[1px] bg-black/10"></span>
                    REF: {product.sku}
                  </div>
                )}
                <div className="text-[0.6rem] text-[var(--color-accent)] font-bold tracking-[0.4em] uppercase flex items-center gap-4">
                  <span className="w-10 h-[1px] bg-[var(--color-accent)]/30"></span>
                  Udaipur Heritage
                </div>
              </div>

              {product.description && (
                <div
                  className="reveal stagger-4 text-[1rem] md:text-[1.05rem] text-[var(--color-text-secondary)] leading-[1.8] mb-12 font-light space-y-6"
                  dangerouslySetInnerHTML={{ 
                    __html: product.description
                      .replace(/\n\n/g, '<br/><br/>')
                      .replace(/\n/g, '<br/>')
                  }}
                />
              )}

              <div className="reveal stagger-5 space-y-8 pt-12 border-t border-black/[0.03]">
                <div className="flex flex-col sm:flex-row gap-6">
                  <a
                    href={`https://wa.me/919414162629?text=Greetings, I am very interested in the ${product.name}. Could you please provide more details?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-[1.2] flex items-center justify-center gap-4 px-10 py-5 bg-black text-white text-[0.7rem] uppercase tracking-[0.4em] font-bold transition-all hover:bg-[var(--color-accent)] hover:shadow-2xl hover:shadow-[var(--color-accent)]/20 group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-4">
                      <span className="text-lg">💬</span> Artisan Inquiry
                    </span>
                    <div className="absolute inset-0 bg-[var(--color-accent)] translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  </a>

                  <Link href="/contact" className="flex-1 text-center inline-block px-10 py-5 border border-black/10 text-[0.7rem] uppercase tracking-[0.4em] font-bold transition-all hover:border-black hover:bg-black hover:text-white group">
                    Contact Studio
                  </Link>
                </div>

                <div className="flex items-center justify-center gap-6 opacity-30">
                  <div className="h-[1px] flex-1 bg-black"></div>
                  <p className="text-[0.55rem] uppercase tracking-[0.3em] font-bold whitespace-nowrap">Secure Worldwide Logistics</p>
                  <div className="h-[1px] flex-1 bg-black"></div>
                </div>
              </div>

              {/* Heritage Certification Box */}
              <div className="reveal stagger-6 mt-20 p-10 md:p-14 bg-[#F9F7F5] relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-[var(--color-accent)]/40 group-hover:h-full transition-all duration-700"></div>
                <div className="relative z-10">
                  <p className="text-[var(--color-accent)] uppercase tracking-[0.5em] text-[0.6rem] font-bold mb-6">Heritage Protocols</p>
                  <p className="text-[1.05rem] text-[var(--color-text-secondary)] leading-relaxed italic font-light">
                    "Each masterpiece is certified as an authentic Udaipur handcrafted creation, following royal artisan protocols passed down through generations. Our Inlay masters ensure every detail meets the standards once reserved for Rajput palaces."
                  </p>
                  <div className="mt-8 flex items-center gap-4">
                    <span className="text-[0.6rem] font-bold tracking-[0.3em] uppercase opacity-20">Artisan Guild of Rajasthan</span>
                    <div className="w-12 h-[1px] bg-black/10"></div>
                  </div>
                </div>
                {/* Subtle background icon */}
                <div className="absolute bottom-[-20%] right-[-10%] opacity-[0.03] rotate-12 transition-transform duration-1000 group-hover:rotate-0">
                  <Image src="/images/Pushpa-Exports.svg" alt="logo" width={300} height={300} className="brightness-0" style={{ width: 'auto', height: 'auto' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Related Creations Section */}
          {product.related_products && product.related_products.length > 0 && (
            <div className="mt-40 md:mt-56 reveal">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10">
                <div className="reveal">
                  <p className="text-[var(--color-accent)] uppercase tracking-[0.5em] text-[0.6rem] font-bold mb-6 stagger-1">Discovery</p>
                  <h2 className="text-[clamp(2.5rem,5vw,4rem)] text-[var(--color-text-primary)] font-heading m-0 stagger-2">
                    Related <span className="italic text-[var(--color-accent)]">Masterpieces</span>
                  </h2>
                </div>
                <Link 
                  href={`/product-category/${product.category_slug_path}`} 
                  className="group flex items-center gap-4 text-[0.7rem] uppercase tracking-[0.3em] font-bold text-black stagger-3 mb-2"
                >
                  <span className="border-b border-black/20 pb-1 group-hover:border-black transition-all">View Entire Collection</span>
                  <span className="w-10 h-[1px] bg-black/10 group-hover:w-16 group-hover:bg-black transition-all duration-700"></span>
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                {product.related_products.map((rp, i) => (
                  <div key={rp.id} className={`reveal stagger-${(i % 4) + 1}`}>
                    <ProductCard product={rp} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recently Viewed History */}
          {recentlyViewed.length > 0 && (
            <div className="mt-40 md:mt-56 pt-24 border-t border-black/[0.03] reveal">
              <div className="mb-20">
                 <p className="text-[var(--color-accent)] uppercase tracking-[0.5em] text-[0.6rem] font-bold mb-6">Gallery History</p>
                 <h2 className="text-[clamp(2.5rem,5vw,4rem)] text-[var(--color-text-primary)] font-heading m-0">
                   Recently <span className="italic text-[var(--color-accent)]">Explored</span>
                 </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12">
                {recentlyViewed.map((rv, i) => (
                  <Link 
                    key={rv.id} 
                    href={`/shop/${rv.category_slug_path}/${rv.slug}`}
                    className={`group reveal stagger-${(i % 5) + 1}`}
                  >
                    <div className="aspect-[0.9] relative bg-[#FDFDFD] overflow-hidden border border-black/[0.03] mb-6 shadow-sm group-hover:shadow-xl transition-all duration-700">
                      {rv.first_image ? (
                        <Image 
                          src={rv.first_image} 
                          alt={rv.name} 
                          fill 
                          className="object-contain p-6 transition-transform duration-[1.5s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110" 
                          sizes="250px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-black/10 text-[0.5rem] font-bold tracking-widest uppercase">Studio Imagery</div>
                      )}
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    </div>
                    <h4 className="text-[0.65rem] uppercase tracking-[0.2em] font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent)] transition-colors duration-300 line-clamp-1">{rv.name}</h4>
                    <div className="w-6 h-[1px] bg-black/10 mt-3 group-hover:w-10 group-hover:bg-[var(--color-accent)] transition-all duration-500"></div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
