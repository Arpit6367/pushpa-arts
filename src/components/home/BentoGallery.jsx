'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function BentoGallery() {
  return (
    <section className="py-[var(--spacing-section)] bg-[#F7F7F7]">
      <div className="max-w-[1600px] mx-auto px-[var(--spacing-container)]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 h-full md:h-[800px]">
          
          {/* Large Left Item */}
          <div className="md:col-span-7 relative group overflow-hidden h-[350px] md:h-full">
            <Image 
              src="/images/hero_1.png" 
              alt="Luxury Craftsmanship"
              fill
              className="object-cover transition-transform duration-[2s] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
            <div className="absolute bottom-8 left-8 md:bottom-16 md:left-16 text-white max-w-[400px]">
              <span className="text-[0.6rem] uppercase tracking-[0.3em] font-bold mb-3 md:mb-4 block">Limited Edition</span>
              <h3 className="text-3xl md:text-5xl font-heading mb-6 md:mb-8 leading-tight">The Royal Inlay Collection</h3>
              <Link href="/product-category" className="inline-block px-8 md:px-10 py-3 md:py-4 bg-white text-black text-[0.65rem] md:text-[0.7rem] uppercase tracking-[0.2em] font-bold hover:bg-[var(--color-accent)] hover:text-white transition-all">Discover</Link>
            </div>
          </div>

          {/* Right Column Grid */}
          <div className="md:col-span-5 grid grid-cols-2 md:grid-rows-2 md:grid-cols-1 gap-4 md:gap-8">
            
            {/* Top Right Item */}
            <div className="relative group overflow-hidden min-h-[200px]">
              <Image 
                src="/images/bespoke_interior.png" 
                alt="Bespoke Interiors"
                fill
                className="object-cover transition-transform duration-[2s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 md:p-8">
                <h3 className="text-xl md:text-3xl font-heading text-white mb-3 md:mb-4">Artisan Studios</h3>
                <Link href="/about" className="text-white text-[0.6rem] uppercase tracking-[0.2em] font-bold border-b border-white/50 pb-1 hover:border-white transition-all">Explore the craft</Link>
              </div>
            </div>

            {/* Bottom Right Item */}
            <div className="relative group overflow-hidden min-h-[200px]">
              <Image 
                src="/images/cat_silver.png" 
                alt="Global Shipping"
                fill
                className="object-cover transition-transform duration-[2s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 md:p-8">
                <h3 className="text-xl md:text-3xl font-heading text-white mb-3 md:mb-4">Custom Orders</h3>
                <Link href="/contact" className="text-white text-[0.6rem] uppercase tracking-[0.2em] font-bold border-b border-white/50 pb-1 hover:border-white transition-all">Get a quote</Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
