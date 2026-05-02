'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function BentoGallery() {
  return (
    <section className="py-[var(--spacing-section)] bg-[#FDFDFD]">
      <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-4 md:gap-8 h-full md:h-[700px]">

          {/* Large Left Item */}
          <div className="col-span-2 md:col-span-7 relative group overflow-hidden h-[400px] md:h-full reveal">
            <Image
              src="/images/hero_1.png"
              alt="Royal Inlay Artisan Craftsmanship"
              fill
              className="object-cover transition-transform duration-[2.5s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 text-white max-w-[450px]">
              <span className="text-[0.5rem] md:text-[0.55rem] uppercase tracking-[0.4em] font-bold mb-2 md:mb-3 block text-[var(--color-accent)] reveal stagger-1">Limited Edition</span>
              <h3 className="text-2xl md:text-4xl font-heading mb-6 md:mb-8 leading-[1.2] reveal stagger-2">The Royal <br className="hidden md:block" />Inlay Collection</h3>
              <Link
                href="/product-category"
                className="inline-block px-6 md:px-10 py-3 md:py-4 bg-white text-black text-[0.6rem] md:text-[0.7rem] uppercase tracking-[0.3em] font-bold hover:bg-[var(--color-accent)] hover:text-white transition-all duration-500 reveal stagger-3"
              >
                Discover Collection
              </Link>
            </div>
          </div>

          {/* Right Column Grid */}
          <div className="col-span-2 md:col-span-5 grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-10">

            {/* Top Right Item */}
            <div className="relative group overflow-hidden aspect-[1/1.2] md:aspect-auto md:h-full reveal delay-200">
              <Image
                src="/images/bespoke_interior.png"
                alt="Bespoke Interiors"
                fill
                className="object-cover transition-transform duration-[2.5s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 md:p-6">
                <span className="text-[0.45rem] md:text-[0.5rem] uppercase tracking-[0.3em] md:tracking-[0.4em] font-bold mb-2 md:mb-3 text-[var(--color-accent)]">Atelier</span>
                <h3 className="text-base md:text-2xl font-heading text-white mb-3 md:mb-5">Artisan Studios</h3>
                <Link href="/about" className="group flex items-center gap-2 md:gap-3 text-white text-[0.5rem] md:text-[0.6rem] uppercase tracking-[0.3em] font-bold">
                  <span className="border-b border-white/40 pb-0.5 md:pb-1 group-hover:border-white transition-all">Explore</span>
                  <span className="w-4 md:w-6 h-[1px] bg-white/40 group-hover:w-8 md:group-hover:w-10 group-hover:bg-white transition-all duration-500"></span>
                </Link>
              </div>
            </div>

            {/* Bottom Right Item */}
            <div className="relative group overflow-hidden aspect-[1/1.2] md:aspect-auto md:h-full reveal delay-400">
              <Image
                src="/images/cat_silver.png"
                alt="Custom Orders"
                fill
                className="object-cover transition-transform duration-[2.5s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F302A]/90 via-[#1F302A]/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 md:p-6">
                <span className="text-[0.45rem] md:text-[0.5rem] uppercase tracking-[0.3em] md:tracking-[0.4em] font-bold mb-2 md:mb-3 text-[var(--color-accent)]">Bespoke</span>
                <h3 className="text-base md:text-2xl font-heading text-white mb-3 md:mb-5">Custom Orders</h3>
                <Link href="/contact" className="group flex items-center gap-2 md:gap-3 text-white text-[0.5rem] md:text-[0.6rem] uppercase tracking-[0.3em] font-bold">
                  <span className="border-b border-white/40 pb-0.5 md:pb-1 group-hover:border-white transition-all">Request</span>
                  <span className="w-4 md:w-6 h-[1px] bg-white/40 group-hover:w-8 md:group-hover:w-10 group-hover:bg-white transition-all duration-500"></span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
