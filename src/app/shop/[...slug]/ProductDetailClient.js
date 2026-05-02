'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { useSettings } from '@/context/SettingsContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Ruler, Weight, Package, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

export default function ProductDetailClient({ product }) {
  const [activeImage, setActiveImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const { is_ecommerce } = useSettings();
  const { addToCart } = useCart();
  const scrollRef = useRef(null);

  const scrollGallery = (direction) => {
    if (scrollRef.current) {
      const { scrollTop, scrollLeft } = scrollRef.current;
      const scrollAmount = direction === 'up' || direction === 'down' ? 120 : 200;

      if (direction === 'up') scrollRef.current.scrollTo({ top: scrollTop - scrollAmount, behavior: 'smooth' });
      if (direction === 'down') scrollRef.current.scrollTo({ top: scrollTop + scrollAmount, behavior: 'smooth' });
      if (direction === 'left') scrollRef.current.scrollTo({ left: scrollLeft - scrollAmount, behavior: 'smooth' });
      if (direction === 'right') scrollRef.current.scrollTo({ left: scrollLeft + scrollAmount, behavior: 'smooth' });
    }
  };

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const price = parseFloat(product.price);
  const salePrice = parseFloat(product.sale_price);
  const hasDiscount = salePrice > 0 && salePrice < price;

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
          className="fixed inset-0 z-[3000] bg-[#0A0A0A] flex flex-col items-center justify-center p-4 md:p-12 animate-in fade-in duration-700"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Architectural Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(false);
            }}
            className="fixed top-20 right-10 text-white/40 hover:text-white transition-all z-[3010] group flex flex-col items-center gap-4"
          >
            <div className="relative w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/40 transition-all overflow-hidden">
              <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 text-3xl font-light leading-none">×</span>
            </div>
            <span className="text-[0.6rem] uppercase tracking-[0.5em] font-bold opacity-0 group-hover:opacity-100 transition-all">Close</span>
          </button>

          {/* Large Image Viewport */}
          <div
            className="relative w-full h-full max-w-7xl max-h-[85vh] flex items-center justify-center cursor-default group/image"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-20 h-20 flex items-center justify-center text-white/20 hover:text-white transition-all group-hover/image:left-4"
                >
                  <ChevronLeft className="w-8 h-8 font-thin" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-20 h-20 flex items-center justify-center text-white/20 hover:text-white transition-all group-hover/image:right-4"
                >
                  <ChevronRight className="w-8 h-8 font-thin" />
                </button>
              </>
            )}

            <Image
              src={currentImage}
              alt={product.name}
              fill
              className="object-contain p-4 md:p-12 transition-transform duration-1000"
              sizes="100vw"
              priority
            />
          </div>

          {/* Lightbox Thumbnails */}
          {images.length > 1 && (
            <div
              className="mt-8 flex gap-4 overflow-x-auto pb-6 max-w-full px-12 no-scrollbar cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, index) => (
                <button
                  key={`lightbox-${img.id}`}
                  className={`relative w-16 h-16 flex-shrink-0 bg-white/5 rounded-sm overflow-hidden border transition-all duration-700 ${index === activeImage ? 'border-[var(--color-accent)] scale-110' : 'border-transparent opacity-30 hover:opacity-100'}`}
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
          )}
        </div>
      )}

      <section className="pt-16 pb-12 md:pt-20 md:pb-24">
        <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-24 items-start">
            {/* Gallery Section with Premium Zoom */}
            <div className="lg:sticky lg:top-28 z-10 reveal">
              <div className={`grid grid-cols-1 ${images.length > 1 ? 'lg:grid-cols-[96px_1fr]' : ''} gap-4 lg:gap-6 items-start`}>

                {/* Thumbnails Column (Vertical on Desktop with Scroll) */}
                {images.length > 1 && (
                  <div className="w-full lg:w-24 order-2  lg:order-1 relative group">
                    {/* Desktop Up Button */}
                    <button
                      onClick={() => scrollGallery('up')}
                      className="hidden lg:flex absolute -top-8 left-1/2 -translate-x-1/2 z-20 w-8 h-8 items-center justify-center bg-white shadow-md rounded-full text-black/40 hover:text-[var(--color-accent)] transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>

                    <div
                      ref={scrollRef}
                      className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[700px] pb-4 lg:pb-0 snap-x lg:snap-y snap-mandatory custom-scrollbar pr-1 no-scrollbar"
                    >
                      {images.map((img, index) => (
                        <button
                          key={img.id}
                          suppressHydrationWarning
                          className={`relative aspect-square w-20 lg:w-full flex-shrink-0 bg-white cursor-pointer overflow-hidden border transition-all duration-500 snap-start ${index === activeImage ? 'border-[var(--color-accent)] shadow-md scale-95' : 'border-black/5 opacity-40 hover:opacity-100'}`}
                          onClick={() => setActiveImage(index)}
                        >
                          <Image
                            src={img.file_path}
                            alt={img.alt_text || product.name}
                            fill
                            className="object-contain p-2"
                            sizes="100px"
                          />
                        </button>
                      ))}
                    </div>

                    {/* Desktop Down Button */}
                    <button
                      onClick={() => scrollGallery('down')}
                      className="hidden lg:flex absolute -bottom-8 left-1/2 -translate-x-1/2 z-20 w-8 h-8 items-center justify-center bg-white shadow-md rounded-full text-black/40 hover:text-[var(--color-accent)] transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {/* Mobile Left/Right Hints (Visible on touch devices if needed) */}
                  </div>
                )}

                {/* Main Image Column */}
                <div className={`w-full ${images.length > 1 ? 'order-1 lg:order-2' : ''}`}>
                  <div
                    className="relative aspect-[1] lg:aspect-[0.85] bg-[#FDFDFD] overflow-hidden border border-black/[0.03] shadow-xl shadow-black/[0.01] cursor-zoom-in group"
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
                          className="object-contain p-6 md:p-10"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          priority
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-black/20 bg-[#F9F7F5]">
                        <span className="text-[0.6rem] tracking-[0.5em] uppercase font-bold">Studio Imagery Curating</span>
                      </div>
                    )}

                    {/* Navigation Arrows for Main Image */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => { e.stopPropagation(); prevImage(); }}
                          suppressHydrationWarning
                          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white/80 backdrop-blur-md text-black opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white cursor-pointer"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); nextImage(); }}
                          suppressHydrationWarning
                          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-white/80 backdrop-blur-md text-black opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white cursor-pointer"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md text-black text-[0.55rem] font-bold uppercase tracking-[0.3em] px-5 py-2.5 border border-black/5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      Expand View
                    </div>

                    {/* Decorative corner accent */}
                    <div className="absolute top-6 right-6 w-10 h-10 border-t border-r border-black/5 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section with Rich Typography */}
            <div className="flex flex-col pt-4">
              {renderBreadcrumbs()}

              <h1 className="reveal stagger-2 text-[clamp(1.8rem,5vw,2.8rem)] font-heading leading-[1.1] mb-4 text-[var(--color-text-primary)] italic">
                {product.name}
              </h1>

              <div className="reveal stagger-3 flex flex-wrap items-center gap-x-8 gap-y-3 mb-6">
                {product.sku && (
                  <div className="text-[0.6rem] text-black/30 font-bold tracking-[0.4em] uppercase flex items-center gap-3">
                    <span className="w-8 h-[1px] bg-black/10"></span>
                    REF: {product.sku}
                  </div>
                )}
                {/* <div className="text-[0.6rem] text-[var(--color-accent)] font-bold tracking-[0.4em] uppercase flex items-center gap-3">
                  <span className="w-8 h-[1px] bg-[var(--color-accent)]/30"></span>
                  Udaipur Heritage
                </div> */}
              </div>

              {is_ecommerce && (
                <div className="reveal stagger-3.5 mb-8">
                  {hasDiscount ? (
                    <div className="flex items-center gap-4">
                      <span className="text-[1rem] text-[#86868b] line-through font-light">₹{price.toLocaleString()}</span>
                      <span className="text-[2rem] font-heading text-[var(--color-accent)] italic">₹{salePrice.toLocaleString()}</span>
                    </div>
                  ) : (
                    <span className="text-[2rem] font-heading text-[var(--color-text-primary)] italic">₹{price.toLocaleString()}</span>
                  )}
                </div>
              )}

              {/* Main Actions - Moved Up */}
              <div className="reveal stagger-4 space-y-6 mb-10">
                <div className="flex flex-col sm:flex-row gap-4">
                  {is_ecommerce ? (
                    <button
                      onClick={() => addToCart(product)}
                      suppressHydrationWarning
                      className="flex-[1.2] cursor-pointer flex items-center justify-center gap-3 px-8 py-4 bg-black text-white text-[0.65rem] uppercase tracking-[0.3em] font-bold transition-all hover:bg-[var(--color-accent)] hover:shadow-xl hover:shadow-[var(--color-accent)]/20 group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        <ShoppingCart className="w-4 h-4" /> Add to Collection
                      </span>
                      <div className="absolute inset-0 bg-[var(--color-accent)] translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    </button>
                  ) : (
                    <a
                      href={`https://wa.me/919414162629?text=Greetings, I am very interested in the ${product.name}. Could you please provide more details?`}
                      target="_blank"
                      rel="noopener noreferrer"
                      suppressHydrationWarning
                      className="flex-[1.2] flex items-center justify-center gap-3 px-8 py-4 bg-black text-white text-[0.65rem] uppercase tracking-[0.3em] font-bold transition-all hover:bg-[var(--color-accent)] hover:shadow-xl hover:shadow-[var(--color-accent)]/20 group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        <span className="text-lg">💬</span> Artisan Inquiry
                      </span>
                      <div className="absolute inset-0 bg-[var(--color-accent)] translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    </a>
                  )}

                  <Link href="/contact" className="flex-1 text-center inline-block px-8 py-4 border border-black/10 text-[0.65rem] uppercase tracking-[0.3em] font-bold transition-all hover:border-black hover:bg-black hover:text-white group">
                    {is_ecommerce ? 'Request Bespoke' : 'Contact Studio'}
                  </Link>
                </div>

                <div className="flex items-center justify-center gap-6 opacity-30">
                  <div className="h-[1px] flex-1 bg-black"></div>
                  <p className="text-[0.55rem] uppercase tracking-[0.3em] font-bold whitespace-nowrap">Secure Worldwide Logistics</p>
                  <div className="h-[1px] flex-1 bg-black"></div>
                </div>
              </div>

              {/* Technical Specifications - Moved Below Buttons */}
              {(product.weight || product.length || product.width || product.height) && (
                <div className="reveal stagger-4.5 grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 p-6 bg-[#F9F7F5] border border-black/[0.03]">
                  {product.weight > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[0.55rem] font-bold uppercase tracking-widest text-[#86868b]">
                        <Weight className="w-3.5 h-3.5" /> Weight
                      </div>
                      <p className="text-[0.8rem] font-bold text-[#1d1d1f]">{product.weight} kg</p>
                    </div>
                  )}
                  {product.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[0.55rem] font-bold uppercase tracking-widest text-[#86868b]">
                        <Ruler className="w-3.5 h-3.5" /> Length
                      </div>
                      <p className="text-[0.8rem] font-bold text-[#1d1d1f]">{product.length} cm</p>
                    </div>
                  )}
                  {product.width > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[0.55rem] font-bold uppercase tracking-widest text-[#86868b]">
                        <Package className="w-3.5 h-3.5" /> Width
                      </div>
                      <p className="text-[0.8rem] font-bold text-[#1d1d1f]">{product.width} cm</p>
                    </div>
                  )}
                  {product.height > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[0.55rem] font-bold uppercase tracking-widest text-[#86868b]">
                        <Ruler className="w-3.5 h-3.5 rotate-90" /> Height
                      </div>
                      <p className="text-[0.8rem] font-bold text-[#1d1d1f]">{product.height} cm</p>
                    </div>
                  )}
                </div>
              )}

              {/* Product Description with Read More */}
              {product.description && (
                <div className="reveal stagger-5 mb-8">
                  <div className="relative">
                    <div
                      className={`text-[0.95rem] md:text-[1rem] text-[var(--color-text-secondary)] leading-[1.7] font-light artisan-description overflow-hidden transition-all duration-700 ${isDescriptionExpanded ? 'max-h-[5000px]' : 'max-h-[160px]'}`}
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                    {!isDescriptionExpanded && product.description.length > 100 && (
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                    )}
                  </div>
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    suppressHydrationWarning
                    className="mt-4 cursor-pointer text-[0.6rem] uppercase tracking-[0.4em] font-bold text-[var(--color-accent)] hover:text-black transition-colors flex items-center gap-2 group border-b border-transparent hover:border-[var(--color-accent)] pb-1"
                  >
                    {isDescriptionExpanded ? 'View Less' : 'Read Full Narrative'}
                    <span className={`transition-transform duration-500 ${isDescriptionExpanded ? 'rotate-180' : ''}`}>↓</span>
                  </button>
                </div>
              )}

              {/* Heritage Certification Box */}
              {/* <div className="reveal stagger-6 mt-20 p-10 md:p-14 bg-[#F9F7F5] relative overflow-hidden group">
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
                <div className="absolute bottom-[-20%] right-[-10%] opacity-[0.03] rotate-12 transition-transform duration-1000 group-hover:rotate-0">
                  <Image src="/images/Pushpa-Exports.svg" alt="logo" width={300} height={300} className="brightness-0" style={{ width: 'auto', height: 'auto' }} />
                </div>
              </div> */}
            </div>
          </div>

          {/* Related Creations Section */}
          {product.related_products && product.related_products.length > 0 && (
            <div className="mt-20 reveal">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-10">
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
            <div className="mt-10 pt-24 border-t border-black/[0.03] reveal">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                <div>
                  <p className="text-[var(--color-accent)] uppercase tracking-[0.5em] text-[0.6rem] font-bold mb-6">Gallery History</p>
                  <h2 className="text-[clamp(2.5rem,5vw,4rem)] text-[var(--color-text-primary)] font-heading m-0">
                    Recently <span className="italic text-[var(--color-accent)]">Explored</span>
                  </h2>
                </div>

                {/* History Slider Controls */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      const el = document.getElementById('recent-history-slider');
                      if (el) el.scrollBy({ left: -300, behavior: 'smooth' });
                    }}
                    suppressHydrationWarning
                    className="w-12 h-12 flex items-center justify-center border border-black/10 rounded-full hover:border-black transition-all group cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5 text-black/40 group-hover:text-black" />
                  </button>
                  <button
                    onClick={() => {
                      const el = document.getElementById('recent-history-slider');
                      if (el) el.scrollBy({ left: 300, behavior: 'smooth' });
                    }}
                    suppressHydrationWarning
                    className="w-12 h-12 flex items-center justify-center border border-black/10 rounded-full hover:border-black transition-all group cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5 text-black/40 group-hover:text-black" />
                  </button>
                </div>
              </div>

              <div
                id="recent-history-slider"
                className="flex gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-8"
              >
                {recentlyViewed.map((rv, i) => (
                  <Link
                    key={rv.id}
                    href={`/shop/${rv.category_slug_path}/${rv.slug}`}
                    className={`group min-w-[200px] md:min-w-[280px] snap-start reveal stagger-${(i % 5) + 1}`}
                  >
                    <div className="aspect-[0.9] relative bg-[#FDFDFD] overflow-hidden border border-black/[0.03] mb-6 shadow-sm group-hover:shadow-xl transition-all duration-700">
                      {rv.first_image ? (
                        <Image
                          src={rv.first_image}
                          alt={rv.name}
                          fill
                          className="object-contain p-6 transition-transform duration-[1.5s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110"
                          sizes="300px"
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
