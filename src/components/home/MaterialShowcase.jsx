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

export default function MaterialShowcase({ items = [] }) {
  const displayItems = items.length > 0 ? items.map(item => ({
    id: item.id.toString(),
    title: item.title,
    subtitle: 'Mosaic Artistry', // Default subtitle or could be added to DB
    desc: item.description,
    image: item.image
  })) : materials;
  const [active, setActive] = useState(displayItems[0]?.id);

  useEffect(() => {
    if (displayItems.length > 0 && !active) {
      setActive(displayItems[0].id);
    }
  }, [displayItems, active]);

  if (displayItems.length === 0) return null;

  return (
    <section className="py-[var(--spacing-section)] bg-[#FDFDFD] overflow-hidden relative">
      {/* Dynamic Floating Background Label */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] lg:text-[20rem] font-heading text-black/[0.01] select-none pointer-events-none hidden md:block uppercase tracking-[0.3em] transition-all duration-1000">
        {displayItems.find(m => m.id === active)?.title?.split(' ')[0]}
      </div>

      <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)] relative z-10">
        {/* UNIQUE MOBILE VIEW: Editorial Slider */}
        <div className="md:hidden">
          <div className="mb-10 text-center">
            <p className="text-[var(--color-accent)] uppercase tracking-[0.5em] text-[0.5rem] font-bold mb-3">The Alchemy of Craft</p>
            <h2 className="text-3xl font-heading leading-tight">Mastery in <span className="italic text-[var(--color-accent)]">Materials</span></h2>
          </div>

          <div 
            className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-6 px-4 pb-10 -mx-4"
            onScroll={(e) => {
              const scrollLeft = e.currentTarget.scrollLeft;
              const width = e.currentTarget.offsetWidth;
              const index = Math.round(scrollLeft / width);
              if (displayItems[index]) {
                setActive(displayItems[index].id);
              }
            }}
          >
            {displayItems.map((m, i) => (
              <div 
                key={m.id}
                className="flex-shrink-0 w-[85vw] snap-center relative"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-xl mb-6">
                   <Image 
                     src={m.image}
                     alt={m.title}
                     fill
                     className="object-cover"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                   
                   {/* Vertical Material Title */}
                   <div className="absolute top-8 left-8">
                      <span className="text-white/40 text-[0.5rem] uppercase tracking-[0.4em] font-bold block mb-2">Heritage Material</span>
                      <h3 className="text-white text-2xl font-heading italic">{m.title}</h3>
                   </div>
                </div>

                <div className="px-2">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-8 h-[1px] bg-[var(--color-accent)]" />
                    <span className="text-[var(--color-accent)] text-[0.55rem] uppercase tracking-[0.3em] font-bold">{m.subtitle}</span>
                  </div>
                  <p className="text-[var(--color-text-secondary)] text-[0.9rem] leading-relaxed italic">
                    "{m.desc}"
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Slider Progress Indicator */}
          <div className="flex justify-center gap-3 mt-4">
            {displayItems.map((m) => (
              <div 
                key={m.id}
                className={`h-[2px] transition-all duration-500 ${active === m.id ? 'w-8 bg-[var(--color-accent)]' : 'w-2 bg-black/10'}`}
              />
            ))}
          </div>
        </div>

        {/* DESKTOP VIEW: Kinetic Interactive Grid (Unchanged) */}
        <div className="hidden md:flex flex-col lg:flex-row gap-16 lg:gap-32 items-center">

          {/* Left: Info Grid */}
          <div className="w-full lg:w-1/2 order-2 lg:order-1 reveal">
            <div className="mb-10 md:mb-16 text-center lg:text-left">
              <p className="text-[var(--color-accent)] uppercase tracking-[0.5em] text-[0.55rem] font-bold mb-3 md:mb-4 stagger-1">The Alchemy of Craft</p>
              <h2 className="text-[clamp(1.8rem,4vw,3.2rem)] font-heading leading-tight stagger-2">Mastery in <br className="hidden lg:block" /><span className="italic text-[var(--color-accent)]">Materials</span></h2>
            </div>

            <div className="flex flex-col gap-6 md:gap-16">
              {displayItems.map((m, i) => (
                <div
                  key={m.id}
                  className={`group cursor-pointer transition-all duration-700 relative pl-10 md:pl-16 py-4 stagger-${i + 3}`}
                  onMouseEnter={() => setActive(m.id)}
                  onClick={() => setActive(m.id)}
                >
                  {/* Modern Animated Indicator */}
                  <div className={`absolute left-0 top-0 bottom-0 w-[1px] transition-all duration-700 ${active === m.id ? 'bg-[var(--color-accent)] w-[4px]' : 'bg-black/10 group-hover:bg-black/30'}`} />

                  <h3 className={`text-[1.1rem] md:text-[1.6rem] lg:text-[2.2rem] font-heading mb-3 md:mb-4 tracking-wide transition-all duration-700 ${active === m.id ? 'text-[var(--color-text-primary)] translate-x-2 md:translate-x-4' : 'text-black/30 md:text-black/10 hover:text-black/30'}`}>
                    {m.title}
                  </h3>

                  <div className={`overflow-hidden transition-all duration-[1000ms] cubic-bezier(0.16, 1, 0.3, 1) ${active === m.id ? 'max-h-[500px] opacity-100 translate-x-2 md:translate-x-4' : 'max-h-0 opacity-0 translate-x-0'}`}>
                    <div className="flex items-center gap-4 md:gap-6 mb-4 md:mb-6">
                      <div className="w-8 md:w-10 h-[1px] bg-[var(--color-accent)]" />
                      <span className="text-[var(--color-accent)] text-[0.55rem] md:text-[0.6rem] uppercase tracking-[0.4em] font-bold">{m.subtitle}</span>
                    </div>
                    <p className="text-[var(--color-text-secondary)] text-[0.95rem] md:text-[1.05rem] leading-[1.8] max-w-[500px] font-light">
                      {m.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Immersive Image with Kinetic Animation */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2 relative aspect-[4/3] md:aspect-[4/5] lg:h-[850px] reveal-zoom">
            {/* Glowing orb background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-[var(--color-accent)]/10 to-transparent rounded-full blur-[120px] animate-pulse" />

            <div className="relative h-full w-full overflow-hidden shadow-2xl rounded-sm group">
              {displayItems.map((m) => (
                <div
                  key={m.id}
                  className={`absolute inset-0 transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) ${active === m.id ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                >
                  {m.image ? (
                    <Image
                      src={m.image}
                      alt={m.title}
                      fill
                      className="object-cover transition-transform duration-[15s] ease-linear group-hover:scale-110"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                  )}
                  {/* Subtle glass overlay for a premium look */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
                </div>
              ))}

              {/* Corner accent border */}
              <div className="absolute inset-6 md:inset-8 border border-white/20 pointer-events-none group-hover:inset-10 transition-all duration-1000"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
