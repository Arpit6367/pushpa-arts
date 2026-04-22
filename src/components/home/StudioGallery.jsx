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
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-10">
          <div className="max-w-[700px] reveal">
            <p className="text-[var(--color-accent)] uppercase tracking-[0.4em] font-bold text-[0.55rem] mb-4 block stagger-1">Behind The Scenes</p>
            <h2 className="text-[clamp(2rem,5vw,3.2rem)] font-heading text-[var(--color-text-primary)] leading-[1.1] stagger-2">
              Where Generations of <br className="hidden sm:block" />
              <span className="italic text-[var(--color-accent)]">Mastery</span> Converge
            </h2>
          </div>
          <div className="max-w-[450px] reveal delay-200">
            <p className="text-[var(--color-text-secondary)] text-[0.95rem] font-light leading-relaxed mb-6">
              Every masterpiece at Pushpa Exports is born from patience. We don't just build furniture; we preserve a lineage of royal Rajasthani artistry.
            </p>
            <div className="w-16 h-[1px] bg-[var(--color-accent)]/40"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
          {galleryImages.map((img, i) => (
            <div key={i} className={`reveal group relative aspect-[0.75] overflow-hidden bg-gray-50 delay-${(i + 1) * 100}`}>
              <Image
                src={img.src}
                alt={img.label}
                fill
                className="object-cover transition-transform duration-[2s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-10">
                <p className="text-[var(--color-accent)] text-[0.55rem] uppercase tracking-[0.4em] font-bold mb-3 translate-y-6 group-hover:translate-y-0 transition-all duration-700">
                  {img.category}
                </p>
                <h4 className="text-white text-xl font-heading translate-y-6 group-hover:translate-y-0 transition-all duration-700 delay-75">
                  {img.label}
                </h4>
                <div className="w-12 h-[1px] bg-white/30 mt-6 translate-y-6 group-hover:translate-y-0 transition-all duration-700 delay-150"></div>
              </div>

              {/* Corner accent decorative line */}
              <div className="absolute top-6 left-6 w-8 h-[1px] bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute top-6 left-6 h-8 w-[1px] bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
