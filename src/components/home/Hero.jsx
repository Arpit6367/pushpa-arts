'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { heroSlides } from '@/constants/siteData';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[100svh] min-h-[700px] flex items-center overflow-hidden bg-[#0A0A0A]">
      {/* Background Slides */}
      <div className="absolute inset-0 z-[1]">
        {heroSlides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-all duration-[2500ms] ease-out ${
              i === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            }`}
          >
            <Image 
              src={s.image} 
              alt={s.badge} 
              fill 
              priority={i === 0}
              className="object-cover"
              sizes="100vw"
            />
            {/* Rich gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-[var(--spacing-container)]">
        <div className="max-w-[850px] text-white" key={currentSlide}>
          <div className="overflow-hidden mb-5">
            <p className="text-[0.6rem] md:text-[0.7rem] tracking-[0.4em] uppercase font-bold text-[var(--color-accent)] animate-fade-in-up">
              {heroSlides[currentSlide].badge}
            </p>
          </div>
          
          <div className="mb-6">
            <h1 className="text-[clamp(2.8rem,8vw,5.5rem)] font-heading leading-[0.95] tracking-tight">
              {heroSlides[currentSlide].title.split('\n').map((line, idx) => (
                <span key={idx} className="block overflow-hidden">
                  <span className={`block animate-fade-in-up`} style={{ animationDelay: `${200 + (idx * 150)}ms` }}>
                    {line}
                  </span>
                </span>
              ))}
            </h1>
          </div>

          <div className="overflow-hidden mb-10">
            <p className="text-[0.95rem] md:text-[1.1rem] text-white/70 max-w-[500px] leading-relaxed font-light animate-fade-in-up" style={{ animationDelay: '600ms' }}>
              {heroSlides[currentSlide].subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-10 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
            <Link 
              href="/product-category" 
              className="group relative px-10 sm:px-16 py-4 sm:py-5 bg-[var(--color-accent)] text-white text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.3em] font-bold transition-all duration-500 hover:bg-white hover:text-black overflow-hidden shadow-2xl"
            >
              <span className="relative z-10">Shop Collection</span>
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
            </Link>
            <Link 
              href="/about" 
              className="group flex items-center gap-4 text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.3em] font-bold transition-all"
            >
              <span className="border-b border-white/30 pb-1 group-hover:border-white transition-all">Our Heritage</span>
              <span className="w-8 h-[1px] bg-white/30 group-hover:w-12 group-hover:bg-white transition-all duration-500"></span>
            </Link>
          </div>
        </div>
      </div>

      {/* Modern Slide Indicators */}
      <div className="absolute bottom-12 left-[var(--spacing-container)] flex items-center gap-6 z-[100]">
        <div className="flex gap-3">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              className={`h-[2px] cursor-pointer transition-all duration-700 border-none ${
                i === currentSlide ? 'bg-[var(--color-accent)] w-16' : 'bg-white/20 w-8 hover:bg-white/40'
              }`}
              onClick={() => setCurrentSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
              suppressHydrationWarning
            />
          ))}
        </div>
        <div className="hidden sm:block text-white/30 text-[0.6rem] font-bold tracking-[0.3em] uppercase">
          {String(currentSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
        </div>
      </div>

      {/* Decorative side text */}
      <div className="absolute right-[var(--spacing-container)] bottom-12 z-[100] hidden lg:block">
        <div className="rotate-90 origin-right flex items-center gap-6 text-[0.6rem] font-bold tracking-[0.4em] uppercase text-white/30">
          <span className="w-12 h-[1px] bg-white/20"></span>
          Handcrafted in Udaipur
        </div>
      </div>
    </section>
  );
}
