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
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[100svh] min-h-[700px] flex items-center overflow-hidden bg-black">
      <div className="absolute inset-0 z-[1]">
        {heroSlides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out ${i === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
          >
            <Image 
              src={s.image} 
              alt={s.badge} 
              fill 
              priority={i === 0}
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-[var(--spacing-container)]">
        <div className="max-w-[800px] text-white" key={currentSlide}>
          <div className="overflow-hidden mb-6">
            <p className="text-[0.7rem] md:text-[0.8rem] tracking-[0.4em] uppercase font-bold text-[var(--color-accent)] animate-in fade-in slide-in-from-bottom-full duration-1000">
              {heroSlides[currentSlide].badge}
            </p>
          </div>
          <div className="overflow-hidden mb-8">
            <h1 className="text-[clamp(3.5rem,10vw,6.5rem)] font-heading leading-[0.95] animate-in fade-in slide-in-from-bottom-full duration-[1200ms] delay-200">
              {heroSlides[currentSlide].title.split('\n').map((line, idx) => (
                <span key={idx} className="block">{line}</span>
              ))}
            </h1>
          </div>
          <div className="overflow-hidden mb-12">
            <p className="text-[1.1rem] md:text-[1.25rem] text-white/80 max-w-[550px] leading-relaxed font-light animate-in fade-in slide-in-from-bottom-full duration-[1400ms] delay-400">
              {heroSlides[currentSlide].subtitle}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
            <Link 
              href="/product-category" 
              className="px-8 sm:px-14 py-4 sm:py-5 bg-[var(--color-accent)] text-white text-[0.65rem] sm:text-[0.7rem] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold transition-all hover:bg-white hover:text-black hover:-translate-y-1 shadow-2xl"
            >
              Shop Collection
            </Link>
            <Link href="/about" className="text-[0.7rem] uppercase tracking-[0.2em] font-bold border-b border-white/30 pb-1 hover:border-white transition-all">Our Heritage</Link>
          </div>
        </div>
      </div>

      {/* Slider Indicators */}
      <div className="absolute bottom-12 left-[var(--spacing-container)] flex gap-4 z-[100]">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            className={`h-[3px] cursor-pointer transition-all duration-500 border-none ${i === currentSlide ? 'bg-white w-12' : 'bg-white/30 w-6'}`}
            onClick={() => setCurrentSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            suppressHydrationWarning
          />
        ))}
      </div>
    </section>
  );
}
