'use client';
import { useEffect, useRef, useState } from 'react';

export default function ParallaxSection() {
  const sectionRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrolled = window.scrollY - (rect.top + window.scrollY - window.innerHeight);
      setScrollY(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[80svh] md:h-[120svh] min-h-[500px] md:min-h-[800px] flex items-center justify-center overflow-hidden bg-black">
      {/* Dynamic Background Image */}
      <div
        className="absolute inset-0 z-0 transition-transform duration-300 ease-out"
        style={{
          backgroundImage: "url('/images/parallax_bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `scale(${1 + scrollY * 0.0002}) translateY(${scrollY * 0.1}px)`
        }}
      />

      {/* Layered Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 z-[1]" />
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] z-[2]" />

      {/* Floating Content */}
      <div className="relative z-10 text-center text-white px-[var(--spacing-container)] w-full">
        <div
          className="transition-transform duration-500 ease-out"
          style={{ transform: `translateY(${-scrollY * 0.05}px)` }}
        >
          <span className="text-[0.7rem] uppercase tracking-[0.5em] text-[var(--color-accent)] mb-10 block font-bold reveal active">The Heritage Pulse</span>
          <h2 className="text-[clamp(3rem,8vw,7rem)] font-heading leading-[1] mb-12 drop-shadow-2xl">
            Legacy <br /> <span className="italic font-light opacity-80">Redefined</span>
          </h2>
        </div>

        <div
          className="max-w-[600px] mx-auto transition-transform duration-700 ease-out"
          style={{ transform: `translateY(${-scrollY * 0.02}px)` }}
        >
          <p className="text-lg md:text-xl text-white/70 font-light leading-relaxed mb-12 px-6">
            In the heart of Udaipur, we don't just build furniture; we preserve a thousand-year-old dialogue between stone and soul.
          </p>
          <div className="w-[1px] h-24 bg-[var(--color-accent)] mx-auto opacity-50" />
        </div>
      </div>
    </section>
  );
}
