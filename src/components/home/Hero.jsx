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
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
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
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
