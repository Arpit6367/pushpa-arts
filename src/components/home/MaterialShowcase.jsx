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
    <section className="py-[var(--spacing-section)] bg-white overflow-hidden relative">
      {/* Decorative Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[5rem] sm:text-[10rem] lg:text-[15rem] font-heading text-black/[0.02] select-none pointer-events-none hidden sm:block uppercase tracking-[0.2em]">
        Artistry
      </div>

      <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)] relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
          
          {/* Left: Info Grid */}
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <span className="text-[var(--color-accent)] uppercase tracking-[0.6em] text-[0.55rem] md:text-[0.6rem] font-bold mb-8 md:mb-12 block text-center lg:text-left">The Alchemy of Craft</span>
            
            <div className="flex flex-col gap-10 md:gap-16">
              {materials.map((m) => (
                <div 
                  key={m.id} 
                  className={`group cursor-pointer transition-all duration-700 relative pl-8 md:pl-12 py-2 md:py-4`}
                  onMouseEnter={() => setActive(m.id)}
                  onClick={() => setActive(m.id)}
                >
                  {/* Vertical Indicator */}
                  <div className={`absolute left-0 top-0 bottom-0 w-[1px] transition-all duration-700 ${active === m.id ? 'bg-[var(--color-accent)] w-[3px]' : 'bg-black/5'}`} />
                  
                  <h3 className={`text-[1.25rem] sm:text-[1.75rem] lg:text-[2.2rem] font-heading mb-4 md:mb-6 tracking-wide transition-colors duration-500 ${active === m.id ? 'text-[var(--color-text-primary)]' : 'text-black/20 hover:text-black/40'}`}>
                    {m.title}
                  </h3>
                  
                  <div className={`overflow-hidden transition-all duration-1000 ease-in-out ${active === m.id ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="flex items-center gap-4 mb-4 md:mb-6">
                      <div className="w-6 md:w-8 h-[1px] bg-[var(--color-accent)]" />
                      <span className="text-[var(--color-accent)] text-[0.5rem] md:text-[0.55rem] uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold">{m.subtitle}</span>
                    </div>
                    <p className="text-[var(--color-text-secondary)] text-sm leading-loose max-w-[450px] font-light">
                      {m.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Immersive Image with Floating Effect */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2 relative aspect-[4/5] sm:aspect-[0.8] lg:h-[750px] reveal-zoom">
            <div className="absolute -inset-10 bg-[var(--color-bg-mint)]/30 rounded-full blur-[100px] -z-10 animate-pulse" />
            
            <div className="relative h-full w-full overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] lg:shadow-[0_30px_100px_-20px_rgba(0,0,0,0.15)] rounded-sm group">
              {materials.map((m) => (
                <div 
                  key={m.id}
                  className={`absolute inset-0 transition-all duration-1000 ease-out ${active === m.id ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-110 translate-y-10'}`}
                >
                  <Image 
                    src={m.image} 
                    alt={m.title}
                    fill
                    className="object-cover transition-transform duration-[10s] ease-linear group-hover:scale-110"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                </div>
              ))}
            </div>
            
            {/* Artistic Floating Badge */}
            <div className="absolute -bottom-6 lg:-bottom-10 -left-6 lg:-left-10 bg-white p-6 lg:p-8 shadow-2xl hidden sm:block animate-bounce-slow">
              <div className="border border-[var(--color-accent)]/20 p-4 lg:p-6">
                <span className="text-[0.45rem] lg:text-[0.5rem] uppercase tracking-[0.4em] font-bold text-[var(--color-accent)] block mb-2">Heritage Art</span>
                <span className="text-lg lg:text-xl font-heading text-[var(--color-text-primary)]">Handcrafted <br /> excellence</span>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
