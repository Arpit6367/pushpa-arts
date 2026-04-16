'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';

const heroSlides = [
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
  {
    image: '/images/hero-refined-3.png',
    badge: 'Marble Masterpieces',
    title: 'The Stone of\nGods',
    subtitle: 'Pietra Dura surfaces featuring semi-precious stone inlays. Eternal beauty for modern spaces.',
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
  const containerRef = useRef(null);

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
      {/* ===== HERO SECTION ===== */}
      <section className="hero-editorial">
        <div className="hero-bg-wrapper">
          {heroSlides.map((s, i) => (
            <div
              key={i}
              className={`hero-bg-img ${i === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${s.image})` }}
            />
          ))}
          <div className="hero-overlay-soft" />
        </div>

        <div className="container hero-content-container">
          <div className="hero-text-area" key={currentSlide}>
            <span className="hero-badge-minimal">{slide.badge}</span>
            <h1 className="title-display">
              {slide.title.split('\n').map((line, i) => (
                <span key={i} className="block-reveal">
                  {line}
                  {i < slide.title.split('\n').length - 1 && <br />}
                </span>
              ))}
            </h1>
            <p className="hero-para-refined">{slide.subtitle}</p>
            <div className="hero-btn-row">
              <Link href="/product-category" className="btn-premium">Explore Collection</Link>
              <Link href="/about" className="btn-link-elegant">Our Craftsmanship →</Link>
            </div>
          </div>
        </div>

        <div className="hero-controls-refined">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              className={`hero-dot-line ${i === currentSlide ? 'active' : ''}`}
              onClick={() => setCurrentSlide(i)}
            />
          ))}
        </div>
      </section>

      {/* ===== SHOP BY MATERIAL ===== */}
      <section className="section bg-latte section-material">
        <div className="container">
          <div className="section-header-left reveal">
            <h2 className="section-title" style={{ textAlign: 'left' }}>The Elements of Artistry</h2>
            <p className="section-subtitle" style={{ textAlign: 'left', marginLeft: 0 }}>Discover pieces categorized by their core materials.</p>
          </div>

          <div className="material-grid">
            {materials.map((m, i) => (
              <div key={i} className={`material-card reveal stagger-${i + 1}`}>
                <div className="material-img-box">
                  <img src={m.image} alt={m.name} />
                  <div className="material-overlay">
                    <h3>{m.name}</h3>
                    <p>{m.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES EDITORIAL GRID ===== */}
      <section className="section reveal">
        <div className="container">
          <div className="editorial-grid">
            <div className="editorial-text-col">
              <span className="gold-accent uppercase ls-2">Curation</span>
              <h2 className="section-title" style={{ textAlign: 'left', marginTop: '1rem' }}>Celestial Rooms</h2>
              <p className="editorial-p">From grand Rajasthani palaces to contemporary minimal lofts, our pieces bring a soul to every space they inhabit.</p>
              <Link href="/product-category" className="btn-premium-outline" style={{ marginTop: '2rem' }}>View All Categories</Link>
            </div>

            <div className="editorial-main-item">
              {categories[0] && <CategoryCard category={categories[0]} variant="large" />}
            </div>

            <div className="editorial-sub-items">
              {categories.slice(1, 4).map((cat, i) => (
                <CategoryCard key={cat.id} category={cat} variant="compact" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== THE ARTISAN'S PROCESS ===== */}
      <section className="section-story reveal">
        <div className="story-parallax-bg" style={{ backgroundImage: 'url(/images/workshop-ambient.png)' }}>
          <div className="story-overlay" />
          <div className="container story-content">
            <div className="story-box reveal">
              <span className="uppercase ls-3 gold-accent">The Process</span>
              <h2 className="title-display" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>Slow Made, <br />Forever Loved</h2>
              <p>A single bone inlay dresser takes over 4 weeks of hand-carving and precision placement. This is not manufacturing; this is a slow conversation between wood, bone, and artist.</p>
              <div className="story-stats-premium">
                <div className="stat"><strong>300+</strong> <span>Hours/Piece</span></div>
                <div className="stat"><strong>100%</strong> <span>Handmade</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BESPOKE SERVICES ===== */}
      <section className="section bg-latte reveal">
        <div className="container">
          <div className="editorial-grid" style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '8rem' }}>
            <div className="reveal">
              <span className="gold-accent uppercase ls-2">Bespoke</span>
              <h2 className="title-display" style={{ marginTop: '1.5rem', fontSize: '3.5rem' }}>Commission a <br />Masterpiece</h2>
              <p className="editorial-p" style={{ maxWidth: '500px', margin: '2rem 0' }}>
                Your vision, our heritage. We offer complete customization for our entire collection, allowing you to select specific motifs, materials, and dimensions to suit your unique space.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '2rem 0', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                  <span style={{ color: 'var(--color-gold)' }}>●</span> Custom Dimensions & Layouts
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                  <span style={{ color: 'var(--color-gold)' }}>●</span> Choice of Silver, Bone, or MOP
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                  <span style={{ color: 'var(--color-gold)' }}>●</span> Direct Consultation with Master Artisans
                </li>
              </ul>
              <Link href="/contact" className="btn-premium" style={{ display: 'inline-block' }}>Inquire for Customization</Link>
            </div>
            <div className="reveal delay-200">
              <div className="about-image" style={{ aspectRatio: '1', position: 'relative' }}>
                <img src="/images/hero-luxury-1.png" alt="Custom Silver Throne" style={{ objectPosition: 'center 20%' }} />
                <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', background: '#fff', padding: '2.5rem', boxShadow: 'var(--shadow-lg)', maxWidth: '300px' }}>
                  <p style={{ fontStyle: 'italic', margin: 0, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>"The attention to detail in our custom bone inlay dresser was remarkable. A true heirloom."</p>
                  <p style={{ marginTop: '1rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>— Private Collector, London</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRENDING MASTERPIECES ===== */}
      <section className="section reveal" style={{ background: '#fff' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <div>
              <h2 className="section-title" style={{ textAlign: 'left', margin: 0 }}>Trending Now</h2>
              <p className="editorial-p" style={{ margin: 0 }}>The most coveted pieces of the season.</p>
            </div>
            <Link href="/product-category" className="btn-link-elegant">View Gallery →</Link>
          </div>

          <div className="featured-carousel-grid">
            {featuredProducts.map((p, i) => (
              <div key={p.id} className={`reveal stagger-${i % 3 + 1}`}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA / NEWSLETTER ===== */}
      <section className="section bg-dark reveal" style={{ padding: '8rem 0' }}>
        <div className="container text-center">
          <h2 className="title-display" style={{ color: '#fff' }}>Bring Royalty Home</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto 3rem' }}>Join our inner circle for exclusive previews of new artisan drops and custom interior inspiration.</p>
          <div className="newsletter-premium">
            <input type="email" placeholder="YOUR EMAIL ADDRESS" />
            <button>Subscribe</button>
          </div>
        </div>
      </section>
    </main>
  );
}
