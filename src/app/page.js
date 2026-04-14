'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';

const heroSlides = [
  {
    image: '/images/hero-1.png',
    badge: 'Silver Furniture Collection',
    title: 'Handcrafted Silver\nFurniture',
    subtitle: 'Exquisite throne chairs, beds and more — covered in pure silver sheet with intricate hand-carved motifs.',
  },
  {
    image: '/images/hero-2.png',
    badge: 'Bone Inlay Collection',
    title: 'Artistry in\nBone Inlay',
    subtitle: 'Geometric precision meets centuries-old tradition. Console tables, dressers and cabinets crafted with camel bone.',
  },
  {
    image: '/images/hero-3.png',
    badge: 'Marble & Stone',
    title: 'Natural Marble\nMasterpieces',
    subtitle: 'Pietra dura dining tables and surfaces inlaid with semi-precious stones — lapis lazuli, malachite and mother of pearl.',
  },
];

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState('right');

  const nextSlide = useCallback(() => {
    setSlideDirection('right');
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setSlideDirection('left');
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  const goToSlide = useCallback((index) => {
    setSlideDirection(index > currentSlide ? 'right' : 'left');
    setCurrentSlide(index);
  }, [currentSlide]);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  useEffect(() => {
    fetch('/api/categories?active_only=true')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data.filter(c => !c.parent_id));
        }
      })
      .catch(() => { });

    fetch('/api/products?featured=true&limit=8')
      .then(res => res.json())
      .then(data => {
        if (data.products) {
          setFeaturedProducts(data.products);
        }
      })
      .catch(() => { });
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <>
      {/* ===== HERO SLIDESHOW ===== */}
      <section className="hero-slideshow" id="hero-section">
        {/* Background Images */}
        {heroSlides.map((s, i) => (
          <div
            key={i}
            className={`hero-slide-bg ${i === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${s.image})` }}
          />
        ))}

        {/* Dark Overlay */}
        <div className="hero-overlay" />

        {/* Content */}
        <div className="hero-slide-content" key={currentSlide}>
          <div className="hero-badge-pill">{slide.badge}</div>
          <h1 className="hero-title">
            {slide.title.split('\n').map((line, i) => (
              <span key={i}>
                {i === 0 ? <span className="hero-title-gold">{line}</span> : line}
                {i < slide.title.split('\n').length - 1 && <br />}
              </span>
            ))}
          </h1>
          <p className="hero-description">{slide.subtitle}</p>
          <div className="hero-actions">
            <Link href="/categories" className="btn btn-hero-primary">
              Explore Collections
            </Link>
            <Link href="/contact" className="btn btn-hero-outline">
              Get a Quote
            </Link>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button className="hero-arrow hero-arrow-left" onClick={prevSlide} aria-label="Previous slide">
          ‹
        </button>
        <button className="hero-arrow hero-arrow-right" onClick={nextSlide} aria-label="Next slide">
          ›
        </button>

        {/* Dots */}
        <div className="hero-dots">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        {/* <div className="hero-scroll-indicator">
          <div className="hero-scroll-line" />
        </div> */}
      </section>

      {/* ===== TRUST STRIP ===== */}
      <section className="trust-strip">
        <div className="container">
          <div className="trust-items">
            <div className="trust-item">
              <span className="trust-icon">🏆</span>
              <div>
                <strong>Heritage Artisans</strong>
                <p>7+ Generations of Craft</p>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">✈️</span>
              <div>
                <strong>Global Delivery</strong>
                <p>White-Glove Shipping</p>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🎨</span>
              <div>
                <strong>Custom Design</strong>
                <p>Bespoke to Your Needs</p>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">💎</span>
              <div>
                <strong>Genuine Materials</strong>
                <p>Silver, Bone, Marble</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES SECTION ===== */}
      <section className="section" id="categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Collection</h2>
          <div className="gold-line"></div>
          <p className="section-subtitle">
            Explore our curated range of luxury handcrafted furniture, each piece a work of art.
          </p>

          {categories.length > 0 ? (
            <div className="categories-grid">
              {categories.map(cat => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>Discovering Collections...</h3>
            </div>
          )}
        </div>
      </section>

      {/* ===== VIDEO / STORY SECTION ===== */}
      <section className="video-story-section" id="story-section">
        <div className="video-story-grid">
          <div className="video-story-media">
            <div className="video-wrapper">
              <img
                src="/images/workshop.png"
                alt="Pushpa Arts Workshop — Master artisans at work"
                className="video-poster"
              />
              <div className="video-play-overlay">
                <div className="video-play-btn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span>Watch Our Story</span>
              </div>
            </div>
          </div>
          <div className="video-story-content">
            <div className="video-story-badge">Our Heritage</div>
            <h2>A Legacy of <span>Precision</span> & Artistry</h2>
            <p>
              Pushpa Arts was founded with a single vision: to bring the rare handicrafts of
              Rajasthan to discerning homes worldwide.
            </p>
            <p>
              From the intricate carving of pure silver to the geometric precision of bone inlay,
              our Udaipur workshop is where tradition meets contemporary elegance.
              Every piece is a collaboration between master artisans and the finest natural materials.
            </p>
            <div className="video-story-stats">
              <div className="stat-item">
                <strong>7+</strong>
                <span>Generations</span>
              </div>
              <div className="stat-item">
                <strong>50+</strong>
                <span>Artisans</span>
              </div>
              <div className="stat-item">
                <strong>30+</strong>
                <span>Countries</span>
              </div>
            </div>
            <Link href="/about" className="btn btn-outline" style={{ marginTop: '1.5rem' }}>
              Read Our Full Story →
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      {featuredProducts.length > 0 && (
        <section className="section" id="featured-section" style={{ background: '#fafafa' }}>
          <div className="container">
            <h2 className="section-title">Handpicked Masterpieces</h2>
            <div className="gold-line"></div>
            <p className="section-subtitle">
              Some of our most intricate and popular creations, available for order worldwide.
            </p>

            <div className="products-grid">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
              <Link href="/categories" className="btn btn-outline">
                Explore Full Range →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== FEATURES / USP SECTION ===== */}
      <section className="section" id="features-section">
        <div className="container">
          <h2 className="section-title">Why Pushpa Arts</h2>
          <div className="gold-line"></div>
          <p className="section-subtitle">
            Authenticity, quality, and timeless craftsmanship in every detail.
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏅</div>
              <h3>Artisan Heritage</h3>
              <p>Crafted by native Udaipur artisans who have mastered these traditional crafts over seven generations.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Bespoke Design</h3>
              <p>Every piece can be customized to your specific dimensions, colors, and pattern requirements.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌎</div>
              <h3>Global Shipping</h3>
              <p>Expert packaging and white-glove delivery to clients across the US, UK, and Europe.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💎</div>
              <h3>Authentic Materials</h3>
              <p>We use genuine silver, ethically sourced camel bone, and the finest Makrana marble.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
