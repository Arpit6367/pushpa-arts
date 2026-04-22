'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const materials = [
  {
    id: 'silver',
    title: 'Pure Silver',
    subtitle: '99.9% Refined Foil',
    desc: 'Our master artisans painstakingly apply individual sheets of pure silver onto hand-carved wood. This ancestral technique, known as Chandi-Ki-Gadhai, results in a finish that radiates a soft, moonlight glow.',
    image: '/images/mat_silver.png'
  },
  {
    id: 'bone',
    title: 'Bone Inlay',
    subtitle: 'Mosaic Artistry',
    desc: 'Each petal and leaf is hand-carved from ethically sourced camel bone and set into a polished resin. A single console table can take up to six weeks of dedicated focus by a team of three artisans.',
    image: '/images/mat_bone.png'
  },
  {
    id: 'marble',
    title: 'Marble Pietra Dura',
    subtitle: 'Imperial Stone Inlay',
    desc: 'Perfected in the royal courts, Pietra Dura involves inlaying delicate semi-precious stones into solid white Makrana marble. A testament to precision and the enduring beauty of Rajasthan.',
    image: '/images/mat_marble.png'
  }
];

export default function MaterialShowcase() {
  const [active, setActive] = useState(materials[0].id);

  return (
    <section className="py-[var(--spacing-section)] bg-[#FDFDFD] overflow-hidden relative">
      {/* Dynamic Floating Background Label */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] lg:text-[20rem] font-heading text-black/[0.01] select-none pointer-events-none hidden md:block uppercase tracking-[0.3em] transition-all duration-1000">
        {active}
      </div>

      <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)] relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-center">

          {/* Left: Info Grid */}
          <div className="w-full lg:w-1/2 order-2 lg:order-1 reveal">
            <div className="mb-12 md:mb-16 text-center lg:text-left">
              <p className="text-[var(--color-accent)] uppercase tracking-[0.5em] text-[0.55rem] font-bold mb-4 stagger-1">The Alchemy of Craft</p>
              <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-heading leading-tight stagger-2">Mastery in <br className="hidden lg:block" /><span className="italic text-[var(--color-accent)]">Materials</span></h2>
            </div>

            <div className="flex flex-col gap-12 md:gap-16">
              {materials.map((m, i) => (
                <div
                  key={m.id}
                  className={`group cursor-pointer transition-all duration-700 relative pl-10 md:pl-16 py-4 stagger-${i + 3}`}
                  onMouseEnter={() => setActive(m.id)}
                  onClick={() => setActive(m.id)}
                >
                  {/* Modern Animated Indicator */}
                  <div className={`absolute left-0 top-0 bottom-0 w-[1px] transition-all duration-700 ${active === m.id ? 'bg-[var(--color-accent)] w-[4px]' : 'bg-black/10 group-hover:bg-black/30'}`} />

                  <h3 className={`text-[1.2rem] sm:text-[1.6rem] lg:text-[2.2rem] font-heading mb-4 tracking-wide transition-all duration-700 ${active === m.id ? 'text-[var(--color-text-primary)] translate-x-4' : 'text-black/10 hover:text-black/30'}`}>
                    {m.title}
                  </h3>

                  <div className={`overflow-hidden transition-all duration-[1000ms] cubic-bezier(0.16, 1, 0.3, 1) ${active === m.id ? 'max-h-[400px] opacity-100 translate-x-4' : 'max-h-0 opacity-0 translate-x-0'}`}>
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-10 h-[1px] bg-[var(--color-accent)]" />
                      <span className="text-[var(--color-accent)] text-[0.6rem] uppercase tracking-[0.4em] font-bold">{m.subtitle}</span>
                    </div>
                    <p className="text-[var(--color-text-secondary)] text-[1.05rem] leading-[1.8] max-w-[500px] font-light">
                      {m.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Immersive Image with Kinetic Animation */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2 relative aspect-[4/5] lg:h-[850px] reveal-zoom">
            {/* Glowing orb background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-[var(--color-accent)]/10 to-transparent rounded-full blur-[120px] animate-pulse" />

            <div className="relative h-full w-full overflow-hidden shadow-2xl rounded-sm group">
              {materials.map((m) => (
                <div
                  key={m.id}
                  className={`absolute inset-0 transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) ${active === m.id ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                >
                  <Image
                    src={m.image}
                    alt={m.title}
                    fill
                    className="object-cover transition-transform duration-[15s] ease-linear group-hover:scale-110"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  {/* Subtle glass overlay for a premium look */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
                </div>
              ))}

              {/* Corner accent border */}
              <div className="absolute inset-8 border border-white/20 pointer-events-none group-hover:inset-12 transition-all duration-1000"></div>
            </div>

            {/* Elegant Floating Badge */}
            {/* <div className="absolute -bottom-8 -left-8 lg:-bottom-12 lg:-left-12 bg-white p-8 lg:p-12 shadow-[30px_30px_60px_-15px_rgba(0,0,0,0.15)] hidden sm:block animate-float">
              <div className="border border-[var(--color-accent)]/30 p-6 lg:p-8">
                <span className="text-[0.5rem] uppercase tracking-[0.5em] font-bold text-[var(--color-accent)] block mb-4">Udaipur Artistry</span>
                <span className="text-xl lg:text-3xl font-heading text-[var(--color-text-primary)] leading-tight">Mastery in <br /> Selection</span>
              </div>
            </div> */}
          </div>

        </div>
      </div>
    </section>
  );
}
