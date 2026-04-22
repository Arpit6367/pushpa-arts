'use client';
import Image from 'next/image';

const galleryImages = [
  { src: '/images/process_1.png', label: 'Silver Carving' },
  { src: '/images/process_2.png', label: 'Stone Selection' },
  { src: '/images/hero-luxury-2.png', label: 'Bone Inlay' },
  { src: '/images/workshop-ambient.png', label: 'Final Polish' },
];

export default function StudioGallery() {
  return (
    <section className="py-[var(--spacing-section)] bg-[#FDFDFD]">
      <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-[600px]">
            <span className="text-[var(--color-accent)] uppercase tracking-[0.4em] font-bold text-[0.6rem] mb-4 block">Inside the Studio</span>
            <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-heading text-[var(--color-text-primary)] leading-tight">Crafting the <br className="hidden sm:block" /> Extraordinary</h2>
          </div>
          <p className="text-[var(--color-text-muted)] max-w-[400px] text-sm leading-relaxed mb-2">
            Every piece at Pushpa Arts undergoes a meticulous journey of transformation, handled by generational master artisans.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {galleryImages.map((img, i) => (
            <div key={i} className="group relative aspect-[0.8] overflow-hidden bg-gray-100">
              <Image 
                src={img.src} 
                alt={img.label}
                fill
                className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
                <span className="text-white text-[0.6rem] uppercase tracking-[0.3em] font-bold opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  {img.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
