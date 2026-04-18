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

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y });
  };

  // Handle ESC key to close lightbox
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Lock scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isLightboxOpen]);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6 bg-[#FCFAF8]">
        <h3 className="text-4xl font-heading mb-6 text-[#1F1F1F]">Masterpiece not found</h3>
        <p className="text-[#8C8C8C] mb-10 max-w-md mx-auto">The artistic creation you are seeking is currently unavailable in our digital gallery.</p>
        <Link href="/product-category" className="bg-[#1F1F1F] text-white px-10 py-4 text-[0.7rem] uppercase tracking-[0.2em] font-bold hover:bg-[#B8860B] transition-all">
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
          <span key={part} className="flex items-center gap-2">
            <span className="opacity-30">/</span>
            <Link href={currentPath} className="opacity-60 hover:opacity-100 transition-opacity">{name}</Link>
          </span>
        );
      });
    }

    return (
      <div className="flex flex-wrap items-center gap-2 text-[0.75rem] tracking-[0.2em] uppercase text-[#1F1F1F] mb-10 reveal">
        <Link href="/" className="opacity-60 hover:opacity-100 transition-opacity">Home</Link>
        {breadcrumbs}
        <span className="opacity-30">/</span>
        <span className="font-bold text-[#B8860B]">{product.name}</span>
      </div>
    );
  };

  return (
    <div className="bg-[#FCFAF8]">
      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 md:p-10 animate-in fade-in duration-300 cursor-pointer"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(false);
            }}
            className="absolute top-6 right-6 md:top-10 md:right-10 text-white/70 hover:text-[#B8860B] transition-all z-[110] flex flex-col items-center gap-2 group"
          >
            <span className="text-4xl md:text-5xl font-thin group-hover:rotate-90 transition-transform duration-500">×</span>
            <span className="text-[0.6rem] uppercase tracking-[0.2em] font-bold hidden md:block">Close View</span>
          </button>
          
          <div 
            className="relative w-full h-full max-w-5xl max-h-[70vh] md:max-h-[80vh] flex items-center justify-center cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
             <Image 
                src={currentImage} 
                alt={product.name} 
                fill
                className="object-contain" 
                sizes="100vw"
                priority
              />
          </div>

          <div 
            className="mt-10 flex gap-4 overflow-x-auto pb-4 max-w-full px-4 scrollbar-hide cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((img, index) => (
              <button
                key={img.id}
                className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 bg-white/10 rounded-[2px] overflow-hidden border-2 transition-all ${index === activeImage ? 'border-[#B8860B]' : 'border-transparent opacity-50'}`}
                onClick={() => setActiveImage(index)}
              >
                <Image 
                  src={img.file_path} 
                  alt={img.alt_text || product.name} 
                  fill
                  className="object-cover" 
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <section className="pt-40 pb-24 md:pt-48 md:pb-32">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-24 items-start">
            {/* Gallery Section */}
            <div className="flex flex-col gap-8 reveal lg:sticky lg:top-32 z-10">
              <div 
                className="relative aspect-square lg:aspect-[4/5] bg-white overflow-hidden rounded-[2px] border border-black/5 shadow-2xl shadow-[#1F1F1F]/5 cursor-zoom-in group"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onClick={() => setIsLightboxOpen(true)}
              >
                {currentImage ? (
                  <div 
                    className="w-full h-full relative transition-transform duration-300 ease-out"
                    style={isZooming ? { 
                      transform: 'scale(1.5)',
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                    } : {}}
                  >
                    <Image 
                      src={currentImage} 
                      alt={product.name} 
                      fill
                      className="object-contain p-8 md:p-16" 
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#8C8C8C] bg-[#F5F1EE]">
                    <span className="text-4xl mb-4 opacity-20">🖼️</span>
                    <span className="text-[0.6rem] tracking-[0.2em] uppercase font-bold opacity-40">Studio Imagery Curating</span>
                  </div>
                )}
                
                <div className="absolute bottom-6 right-6 bg-white/80 backdrop-blur-sm text-[#1F1F1F] text-[0.6rem] font-bold uppercase tracking-[0.2em] px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Click to Expand
                </div>

                {product.is_featured && (
                  <div className="absolute top-8 left-8 bg-[#B8860B] text-white text-[0.6rem] font-bold uppercase tracking-[0.2em] px-4 py-2 shadow-lg">
                    Featured Masterpiece
                  </div>
                )}
              </div>

              {/* Slider for Thumbnails */}
              {images.length > 1 && (
                <div className="relative">
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                    {images.map((img, index) => (
                      <button
                        key={img.id}
                        className={`relative aspect-square w-24 md:w-32 flex-shrink-0 bg-white cursor-pointer rounded-[2px] overflow-hidden border transition-all duration-500 snap-start ${index === activeImage ? 'border-[#B8860B] ring-1 ring-[#B8860B] shadow-lg scale-95' : 'border-black/5 opacity-60 hover:opacity-100'}`}
                        onClick={() => setActiveImage(index)}
                      >
                        <Image 
                          src={img.file_path} 
                          alt={img.alt_text || product.name} 
                          fill
                          className="object-cover p-2" 
                          sizes="150px"
                        />
                      </button>
                    ))}
                  </div>
                  {/* Subtle indicators for many images */}
                  {images.length > 4 && (
                    <div className="absolute -bottom-1 left-0 right-0 h-[1px] bg-[#E5E0DA]">
                      <div 
                        className="h-full bg-[#B8860B] transition-all duration-500" 
                        style={{ width: `${((activeImage + 1) / images.length) * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="flex flex-col">
              {renderBreadcrumbs()}

              <h1 className="reveal delay-100 text-[clamp(2.8rem,6vw,4.5rem)] font-heading leading-[1.1] mb-6 text-[#1F1F1F] italic">
                {product.name}
              </h1>

              <div className="reveal delay-200 flex items-center gap-6 mb-12">
                {product.sku && (
                  <div className="text-[0.65rem] text-[#8C8C8C] font-bold tracking-[0.2em] uppercase border-r border-[#E5E0DA] pr-6">
                    REF: {product.sku}
                  </div>
                )}
                <div className="text-[0.65rem] text-[#B8860B] font-bold tracking-[0.2em] uppercase">
                  Handcrafted in Udaipur
                </div>
              </div>

              {product.description && (
                <div
                  className="reveal delay-300 text-[1.15rem] text-[#4A4A4A] leading-[2.1] mb-12 font-light space-y-6 first-letter:text-4xl first-letter:font-heading first-letter:mr-1 first-letter:float-left first-letter:text-[#B8860B]"
                  dangerouslySetInnerHTML={{ __html: product.description.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>') }}
                />
              )}

              <div className="reveal delay-400 space-y-6 pt-8 border-t border-[#F0EDE6]">
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={`https://wa.me/919414162629?text=Greetings, I am very interested in the ${product.name}. Could you please provide more details?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-4 px-10 py-6 bg-[#1F1F1F] text-white text-[0.7rem] uppercase tracking-[0.3em] font-bold transition-all hover:bg-[#B8860B] hover:shadow-2xl hover:shadow-[#B8860B]/30 group"
                  >
                    <span className="transition-transform group-hover:scale-125">💬</span>
                    <span>Artisan Inquiry</span>
                  </a>

                  <Link href="/contact" className="flex-1 text-center inline-block px-10 py-6 border border-[#1F1F1F] text-[0.7rem] uppercase tracking-[0.3em] font-bold transition-all hover:bg-[#1F1F1F] hover:text-white group">
                    <span className="mr-2 opacity-50 transition-opacity group-hover:opacity-100">✉</span>
                    Contact Request
                  </Link>
                </div>

                <p className="text-[0.6rem] text-[#8C8C8C] uppercase tracking-[0.1em] text-center pt-4">
                  Worldwide Shipping Available via Secure Specialized Transport
                </p>
              </div>

              <div className="reveal delay-500 mt-20 p-10 bg-[#F5F1EE] border-l-4 border-[#B8860B]">
                <h5 className="text-[#B8860B] uppercase tracking-[0.25em] text-[0.6rem] font-bold mb-4">Heritage Certification</h5>
                <p className="text-[0.9rem] text-[#4A4A4A] leading-relaxed italic font-light">
                  "Each piece is certified as an authentic Udaipur handcrafted creation, following royal artisan protocols passed down through generations. Our Inlay masters ensure every detail meets the standards once reserved for Rajput palaces."
                </p>
              </div>
            </div>
          </div>

          {/* Related Creations */}
          {product.related_products && product.related_products.length > 0 && (
            <div className="mt-48 reveal">
              <div className="flex items-center justify-between mb-16">
                <h2 className="text-[clamp(2.2rem,5vw,3.5rem)] text-[#1F1F1F] font-heading m-0">
                  Related <span className="text-[#B8860B]">Creations</span>
                </h2>
                <Link href="/product-category" className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-[#B8860B] border-b border-[#B8860B] pb-1 hover:opacity-70 transition-opacity italic">Explore Collections</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {product.related_products.map(rp => (
                  <ProductCard key={rp.id} product={rp} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
