'use client';
import Image from 'next/image';

const galleryImages = [
  { src: '/images/process_1.png', label: 'Silver Carving', category: 'Handwork' },
  { src: '/images/process_2.png', label: 'Stone Selection', category: 'Raw Materials' },
  { src: '/images/hero-luxury-2.png', label: 'Bone Inlay', category: 'Mastery' },
  { src: '/images/workshop-ambient.png', label: 'Final Polish', category: 'Finishing' },
];

export default function StudioGallery() {
  return (
    <section className="py-[var(--spacing-section)] bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end mb-12 md:mb-16 gap-8 lg:gap-10 text-center lg:text-left">
          <div className="max-w-[700px] reveal">
            <p className="text-[var(--color-accent)] uppercase tracking-[0.4em] font-bold text-[0.55rem] mb-4 block stagger-1">Behind The Scenes</p>
            <h2 className="text-[clamp(1.8rem,5vw,3.2rem)] font-heading text-[var(--color-text-primary)] leading-[1.1] stagger-2">
              Where Generations of <br className="hidden sm:block" />
              <span className="italic text-[var(--color-accent)]">Mastery</span> Converge
            </h2>
          </div>
          <div className="max-w-[450px] reveal delay-200">
            <p className="text-[var(--color-text-secondary)] text-[0.9rem] md:text-[0.95rem] font-light leading-relaxed mb-6">
              Every masterpiece at Pushpa Exports is born from patience. We don't just build furniture; we preserve a lineage of royal Rajasthani artistry.
            </p>
            <div className="w-12 md:w-16 h-[1px] bg-[var(--color-accent)]/40 mx-auto lg:mx-0"></div>
          </div>
        </div>

        <div className="flex overflow-x-auto lg:grid lg:grid-cols-4 gap-6 lg:gap-10 no-scrollbar snap-x snap-mandatory px-6 lg:px-0 -mx-6 lg:mx-0 pb-10 lg:pb-0">
          {galleryImages.map((img, i) => (
            <div 
              key={i} 
              className={`reveal group relative aspect-[0.75] overflow-hidden bg-gray-50 flex-shrink-0 w-[80vw] sm:w-[60vw] lg:w-auto snap-center delay-${(i + 1) * 100}`}
            >
              <Image
                src={img.src}
                alt={img.label}
                fill
                className="object-cover transition-transform duration-[2s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110"
              />
              {/* Overlay: Always partially visible on mobile, full on hover desktop */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-8 md:p-10">
                <p className="text-[var(--color-accent)] text-[0.5rem] md:text-[0.55rem] uppercase tracking-[0.4em] font-bold mb-2 md:mb-3 translate-y-0 lg:translate-y-6 lg:group-hover:translate-y-0 transition-all duration-700">
                  {img.category}
                </p>
                <h4 className="text-white text-lg md:text-xl font-heading translate-y-0 lg:translate-y-6 lg:group-hover:translate-y-0 transition-all duration-700 delay-75">
                  {img.label}
                </h4>
                <div className="w-10 md:w-12 h-[1px] bg-white/30 mt-4 md:mt-6 translate-y-0 lg:translate-y-6 lg:group-hover:translate-y-0 transition-all duration-700 delay-150"></div>
              </div>

              {/* Corner accent decorative line */}
              <div className="absolute top-6 left-6 w-8 h-[1px] bg-white/20 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-6 left-6 h-8 w-[1px] bg-white/20 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
