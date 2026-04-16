'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';

const heroSlides = [
  {
    image: '/images/hero-refined-3.png',
    badge: 'Marble Masterpieces',
    title: 'The Stone of\nGods',
    subtitle: 'Pietra Dura surfaces featuring semi-precious stone inlays. Eternal beauty for modern spaces.',
  },
  {
    image: '/images/hero-refined-1.png',
    badge: 'The Silver Collection',
    title: 'Silver Throne of\nMajesty',
    subtitle: 'Hand-carved solid teak, encased in pure silver sheet. A masterpiece of royal heritage.',
  },
  {
    image: '/images/hero-refined-2.png',
    badge: 'Art of Bone Inlay',
    title: 'Labyrinth of\nElegance',
    subtitle: 'Thousands of bone fragments, inlaid with surgical precision to create timeless floral mosaics.',
  },
];

const materials = [
  { name: 'Silver', image: '/images/material-silver-v2.png', desc: '99% Pure Silver Sheet' },
  { name: 'Bone Inlay', image: '/images/material-bone-v2.png', desc: 'Ethically Sourced Camel Bone' },
  { name: 'Mother of Pearl', image: '/images/material-mop-v2.png', desc: 'Iridescent Ocean Shells' },
  { name: 'Marble', image: '/images/material-marble.png', desc: 'Makrana & Semi-Precious Stones' },
];

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch('/api/categories?active_only=true')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data.filter(c => !c.parent_id));
        }
      })
      .catch(() => { });

    fetch('/api/products?featured=true&limit=6')
      .then(res => res.json())
      .then(data => {
        if (data.products) {
          setFeaturedProducts(data.products);
        }
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3); // Changed manually as heroSlides is a constant of 3 items
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [categories, featuredProducts]);

  const slide = heroSlides[currentSlide];

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Pushpa Arts",
            "url": "https://pushpaarts.com",
            "logo": "https://pushpaarts.com/images/Pushpa-Exports.svg",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-94141-62629",
              "contactType": "Sales and Inquiries",
              "areaServed": "Worldwide",
              "availableLanguage": ["English", "Hindi"]
            },
            "sameAs": [
              "https://www.instagram.com/pushpaarts",
              "https://www.facebook.com/pushpaarts"
            ],
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Udaipur",
              "addressRegion": "Rajasthan",
              "addressCountry": "India"
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": "https://pushpaarts.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://pushpaarts.com/product-category?search={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      {/* ===== HERO SECTION ===== */}
      <section className="relative h-[100svh] min-h-[750px] flex items-center bg-black overflow-hidden">
        <div className="absolute inset-0 z-[1]">
          {heroSlides.map((s, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-all duration-[2000ms] ${i === currentSlide ? 'opacity-55 scale-100 z-10' : 'opacity-0 scale-110 z-0'}`}
            >
              <Image 
                src={s.image} 
                alt={s.badge} 
                fill 
                priority={i === 0}
                className="object-cover"
                sizes="100vw"
              />
            </div>
          ))}
          <div className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_60%,rgba(0,0,0,0.8)_100%),linear-gradient(90deg,rgba(0,0,0,0.7)_0%,transparent_40%,transparent_60%,rgba(0,0,0,0.7)_100%)]" />
        </div>

        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-[var(--spacing-container)]">
          <div className="max-w-[900px] text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.3)]" key={currentSlide}>
            <span className="inline-block text-[0.7rem] tracking-[0.4em] uppercase text-[#D4AF37] mb-10 font-medium">{slide.badge}</span>
            <h1 className="text-[clamp(3rem,10vw,6rem)] text-white font-light leading-[0.95] mb-10 drop-shadow-[0_5px_15px_rgba(0,0,0,0.2)]">
              {slide.title.split('\n').map((line, i) => (
                <span key={i} className="block-reveal">
                  {line}
                  {i < slide.title.split('\n').length - 1 && <br />}
                </span>
              ))}
            </h1>
            <p className="text-[1.15rem] text-white/90 max-w-[550px] leading-[1.8] mb-16 font-light">{slide.subtitle}</p>
            <div className="flex items-center gap-10">
              <Link href="/product-category" className="px-12 py-5 bg-[#B8860B] text-white text-[0.7rem] uppercase tracking-[0.2em] font-semibold transition-all shadow-[0_10px_30px_rgba(184,134,11,0.2)] hover:bg-white hover:text-[#1F1F1F] hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(184,134,11,0.4)]">Explore Collection</Link>
              <Link href="/about" className="text-[0.7rem] uppercase tracking-[0.15em] font-semibold border-b border-white/30 pb-1 text-white hover:border-white transition-all">Our Craftsmanship →</Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-16 right-[var(--spacing-container)] flex flex-col gap-6 z-[100]">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              className={`h-[2px] cursor-pointer transition-all border-none ${i === currentSlide ? 'bg-[#B8860B] w-16' : 'bg-white/20 w-10'}`}
              onClick={() => setCurrentSlide(i)}
            />
          ))}
        </div>
      </section>

      {/* ===== SHOP BY MATERIAL ===== */}
      <section className="py-[var(--spacing-section)] bg-[#F5F1EE] border-b border-[#E5E0DA]">
        <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
          <div className="text-left reveal">
            <h2 className="text-[clamp(2.2rem,5vw,3.8rem)] text-[#1F1F1F] font-heading mb-6">The Elements of Artistry</h2>
            <p className="text-[clamp(0.85rem,2vw,0.95rem)] text-[#4A4A4A] uppercase tracking-[0.2em] font-normal leading-relaxed max-w-[650px]">Discover pieces categorized by their core materials.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {materials.map((m, i) => (
              <div key={i} className={`relative aspect-[0.8] overflow-hidden group reveal stagger-${i + 1}`}>
                <div className="w-full h-full relative">
                  <Image 
                    src={m.image} 
                    alt={m.name} 
                    fill
                    className="object-cover transition-transform duration-[1.5s] group-hover:scale-110" 
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 p-10 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent text-white">
                    <h3 className="text-[1.8rem] mb-2 font-heading">{m.name}</h3>
                    <p className="text-[0.6rem] uppercase tracking-[0.2em] opacity-80">{m.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES EDITORIAL GRID ===== */}
      <section className="py-[var(--spacing-section)] reveal">
        <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1.5fr_1fr] gap-16 items-center">
            <div className="lg:pr-8">
              <span className="text-[#B8860B] uppercase tracking-[0.2em]">Curation</span>
              <h2 className="text-[clamp(2.2rem,5vw,3.8rem)] text-[#1F1F1F] font-heading mt-4 mb-6">Celestial Rooms</h2>
              <p className="text-[#4A4A4A] text-base leading-[1.9] font-light">From grand Rajasthani palaces to contemporary minimal lofts, our pieces bring a soul to every space they inhabit.</p>
              <Link href="/product-category" className="inline-block px-10 py-4 mt-8 border border-[#1F1F1F] text-[0.7rem] uppercase tracking-[0.2em] font-semibold transition-all hover:bg-[#1F1F1F] hover:text-white">Explore All Collections</Link>
            </div>

            <div>
              {categories[0] && <CategoryCard category={categories[0]} variant="large" />}
            </div>

            <div className="flex flex-col gap-6">
              {categories.slice(1, 4).map((cat, i) => (
                <CategoryCard key={cat.id} category={cat} variant="compact" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== THE ARTISAN'S PROCESS ===== */}
      <section className="relative h-[100svh] min-h-[800px] overflow-hidden reveal">
        <div className="absolute inset-0 bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url(/images/workshop-ambient.png)' }}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative h-full flex items-center max-w-[1600px] mx-auto px-[var(--spacing-container)]">
            <div className="bg-[#FCFAF8] p-[clamp(3rem,10vw,6rem)] max-w-[750px] relative z-10 shadow-2xl reveal">
              <span className="uppercase tracking-[0.3em] text-[#B8860B]">The Process</span>
              <h2 className="text-[#1F1F1F] font-heading text-[clamp(2.5rem,6vw,4rem)] font-light leading-[0.95] my-6">Slow Made, <br />Forever Loved</h2>
              <p className="my-10 text-[1.1rem] font-light leading-loose text-[#1F1F1F]">A single bone inlay dresser takes over 4 weeks of hand-carving and precision placement. This is not manufacturing; this is a slow conversation between wood, bone, and artist.</p>
              <div className="flex flex-wrap gap-20 mt-16 border-t border-[#E5E0DA] pt-10">
                <div><strong className="block text-[2.8rem] font-heading text-[#B8860B] leading-none mb-2">300+</strong> <span className="text-[0.65rem] uppercase tracking-[0.2em] text-[#8C8C8C] font-semibold">Hours/Piece</span></div>
                <div><strong className="block text-[2.8rem] font-heading text-[#B8860B] leading-none mb-2">100%</strong> <span className="text-[0.65rem] uppercase tracking-[0.2em] text-[#8C8C8C] font-semibold">Handmade</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Contact SERVICES ===== */}
      <section className="py-[var(--spacing-section)] bg-[#F5F1EE] reveal">
        <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 lg:gap-32">
            <div className="reveal">
              <span className="text-[#B8860B] uppercase tracking-[0.2em]">Contact</span>
              <h2 className="text-[#1F1F1F] font-heading text-[3.5rem] mt-6 leading-none">Commission a <br />Masterpiece</h2>
              <p className="text-[1rem] text-[#4A4A4A] leading-[1.9] font-light max-w-[500px] my-8">
                Your vision, our heritage. We offer complete customization for our entire collection, allowing you to select specific motifs, materials, and dimensions to suit your unique space.
              </p>
              <ul className="flex flex-col gap-5 my-8">
                <li className="flex items-center gap-4 text-[0.9rem] text-[#4A4A4A]"><span className="text-[#B8860B] text-xs">●</span> Custom Dimensions & Layouts</li>
                <li className="flex items-center gap-4 text-[0.9rem] text-[#4A4A4A]"><span className="text-[#B8860B] text-xs">●</span> Choice of Silver, Bone, or MOP</li>
                <li className="flex items-center gap-4 text-[0.9rem] text-[#4A4A4A]"><span className="text-[#B8860B] text-xs">●</span> Direct Consultation with Master Artisans</li>
              </ul>
              <Link href="/contact" className="inline-block px-12 py-5 bg-[#B8860B] text-white text-[0.7rem] uppercase tracking-[0.2em] font-semibold transition-all shadow-xl hover:bg-white hover:text-[#1F1F1F]">Inquire for Customization</Link>
            </div>
            <div className="reveal delay-200 aspect-square relative mt-16 md:mt-0">
              <img src="/images/hero-luxury-1.png" alt="Custom Silver Throne" className="w-full h-full object-cover object-[center_20%]" />
              <div className="absolute -bottom-10 -left-10 md:left-auto md:-right-10 bg-white p-10 shadow-2xl max-w-[300px] z-10 w-[80%]">
                <p className="italic text-[0.95rem] text-[#1F1F1F] leading-relaxed">"The attention to detail in our custom bone inlay dresser was remarkable. A true heirloom."</p>
                <p className="mt-4 text-[0.7rem] uppercase tracking-[0.15em] font-bold text-[#4A4A4A]">— Private Collector, London</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRENDING MASTERPIECES ===== */}
      <section className="py-[var(--spacing-section)] bg-white reveal">
        <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h2 className="text-[clamp(2.2rem,5vw,3.8rem)] text-[#1F1F1F] font-heading m-0">Coveted Masterpieces</h2>
              <p className="text-[1rem] text-[#4A4A4A] leading-[1.9] font-light m-0 mt-2">The most coveted pieces of the season.</p>
            </div>
            <Link href="/product-category" className="text-[0.7rem] uppercase tracking-[0.15em] font-semibold border-b border-[#1F1F1F]/30 pb-1 text-[#1F1F1F] hover:border-[#1F1F1F] transition-all">Explore Collections →</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((p, i) => (
              <div key={p.id} className={`reveal stagger-${i % 3 + 1}`}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA / NEWSLETTER ===== */}
      <section className="py-32 bg-[#1F1F1F] reveal">
        <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)] text-center">
          <h2 className="text-[clamp(3rem,10vw,6rem)] text-white font-heading mb-6">Bring Royalty Home</h2>
          <p className="text-white/60 max-w-[600px] mx-auto mb-12 text-lg font-light leading-relaxed">Join our inner circle for exclusive previews of new artisan drops and custom interior inspiration.</p>
          <div className="flex max-w-[500px] w-full mx-auto relative group">
            <input type="email" placeholder="YOUR EMAIL ADDRESS" className="flex-1 bg-transparent border-b border-white/30 text-white text-[0.8rem] px-2 py-4 tracking-[0.1em] placeholder:text-white/40 focus:outline-none focus:border-[#B8860B] transition-colors" />
            <button className="bg-transparent border-b border-[#B8860B] text-[#B8860B] text-[0.8rem] uppercase font-bold tracking-[0.2em] px-4 transition-colors hover:text-white hover:border-white">Subscribe</button>
          </div>
        </div>
      </section>
    </main>
  );
}
